import { useAuth0 } from "@auth0/auth0-react";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SampleList from "./components/SampleList";
import Slider from "./components/Slider";
import "./home.css";

import "./components/bootstrap_gene_page/css/sb-admin-2.min.css";
import "./components/bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";

import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SideNav, { NavIcon, NavItem, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
const user_post_url = `${process.env.REACT_APP_BACKEND_URL}/api/registration`;

function Home() {
    const [searchResult, setSearchResult] = useState([]);
    //   Space so that user can run "blank" search
    const [searchInput, setSearchInput] = useState(" ");
    const [searchFilter, setSearchFilter] = useState("gene");
    const [listPage, setListPage] = useState(1);
    const [isMounted, setIsMounted] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    const { user } = useAuth0();
    const userMetadata = user?.["https://unique.app.com/user_metadata"];

    useEffect(() => {
        if (isMounted) {
            handleSearch();
        } else {
            handleUserSubmit();
            setIsMounted(true);
        }
    }, [listPage]);

    //   Url to search gene by keywords: 'api/gene/search/<str:search_word>/<str:page_id>'
    const handleSearch = async () => {
        try {
            const response = await axios.get(
                `${
                    process.env.REACT_APP_BACKEND_URL
                }/api/${searchFilter}/search/${searchInput}/${listPage.toString()}`
            );
            setSearchResult(response.data["genes"]);
            setTotalPages(parseInt(response.data["total_pages"]));
            setHasSearched(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleIncrementPage = async () => {
        setListPage(listPage + 1);
    };

    const handleDecrementPage = () => {
        setListPage(listPage - 1);
    };

    const handleUserSubmit = async () => {
        const email = user.email;
        const first_name = userMetadata.given_name;
        const last_name = userMetadata.family_name;
        // ONLY STORE USER UID part
        const auth0_uid = user.sub.split("|")[1];

        const formData = new FormData();
        formData.append("email", email);
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("auth0_uid", auth0_uid);

        axios
            .post(user_post_url, formData)
            .then(() => {
                console.log(
                    "Account information successfully submitted on backend."
                );
            })
            .catch((error) => {
                if (error.response.status === 409) {
                    console.log(
                        "Account informaiton already registered in DB. No update needed."
                    );
                }
            });
    };

    return (
        <body id="page-top">
            <div id="wrapper">
                <div id="content-wrapper" class="d-flex flex-column">
                    <div id="content">
                        <div class="container-fluid" id="home_page_full">
                            <SideNav
                                id="side_navigation_menu"
                                onSelect={(selected) => {
                                    // Add your code here
                                }}
                            >
                                <SideNav.Toggle />
                                <SideNav.Nav defaultSelected="home">
                                    <NavItem eventKey="home">
                                        <NavIcon>
                                            <i
                                                className="fa fa-fw fa-home"
                                                style={{
                                                    fontSize: "1.75em",
                                                    color: "white",
                                                }}
                                            />
                                        </NavIcon>
                                        <NavText style={{ color: "white" }}>
                                            Home
                                        </NavText>
                                    </NavItem>
                                    <NavItem eventKey="search_gene">
                                        <NavIcon>
                                            <FontAwesomeIcon
                                                id="gene_icon"
                                                icon={icon({
                                                    name: "dna",
                                                    style: "solid",
                                                })}
                                            />
                                        </NavIcon>
                                        <NavText style={{ color: "white" }}>
                                            Gene Search
                                        </NavText>
                                    </NavItem>
                                    <NavItem eventKey="search_dataset">
                                        <NavIcon>
                                            <FontAwesomeIcon
                                                id="dataset_search_icon"
                                                icon={icon({
                                                    name: "file",
                                                    style: "solid",
                                                })}
                                            />
                                        </NavIcon>
                                        <NavText style={{ color: "white" }}>
                                            Dataset Search
                                        </NavText>
                                    </NavItem>
                                    <NavItem eventKey="search_dataset">
                                        <NavIcon></NavIcon>
                                        <NavText style={{ color: "white" }}>
                                            <a
                                                href="/homepage"
                                                id="landing_page_link_from_home"
                                            >
                                                Landing Page
                                            </a>
                                        </NavText>
                                    </NavItem>
                                </SideNav.Nav>
                            </SideNav>
                            <div class="row justify-content-end">
                                <div class="col-md-12 bg-light text-right mr-5 mt-5">
                                    <a
                                        href="/upload"
                                        class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                                    >
                                        <i class="fas fa-upload fa-sm text-white-50"></i>
                                        Upload
                                    </a>
                                </div>
                            </div>

                            <div class="row justify-content-center">
                                <h3 class="h3 mb-5 text-gray-800">
                                    Human Genomics Search
                                </h3>
                            </div>

                            <div className="row justify-content-center mt-5 mb-5">
                                <div className="search">
                                    <TextField
                                        id="input_keyword"
                                        onChange={(e) =>
                                            setSearchInput(e.target.value)
                                        }
                                        variant="outlined"
                                        fullWidth
                                        label="Search by gene names or dataset name"
                                    />

                                    <TextField
                                        value={searchFilter}
                                        label="Filter"
                                        select
                                        style={{ width: "10rem" }}
                                        onChange={(e) => {
                                            setSearchFilter(e.target.value);
                                        }}
                                    >
                                        <MenuItem value={"gene"}>Gene</MenuItem>
                                        <MenuItem value={"dataset"}>
                                            Dataset
                                        </MenuItem>
                                        <MenuItem value={"all"}>All</MenuItem>
                                    </TextField>
                                    <IconButton
                                        type="submit"
                                        aria-label="search"
                                        onClick={handleSearch}
                                    >
                                        <SearchIcon style={{ fill: "blue" }} />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="row justify-content-center">
                                <div className="search-result mb-5 mt-5">
                                    <ul className="search-result">
                                        <Slider />
                                    </ul>
                                </div>
                            </div>

                            <div className="row justify-content-center">
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <div>
                                            <SampleList
                                                resultList={searchResult}
                                            />
                                            {!hasSearched && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    Start Searching!
                                                </div>
                                            )}
                                            {hasSearched &&
                                                searchResult.length === 0 && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        No results
                                                    </div>
                                                )}
                                        </div>
                                        {searchResult.length > 0 && (
                                            <div>
                                                <div className="float-left">
                                                    {listPage > 1 && (
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={
                                                                handleDecrementPage
                                                            }
                                                        >
                                                            Prev Page
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="float-right">
                                                    {listPage < totalPages && (
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={
                                                                handleIncrementPage
                                                            }
                                                        >
                                                            Next Page
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script src="./bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
            <script src="./bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

            <script src="./bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

            <script src="./bootstrap_gene_page/js/sb-admin-2.min.js"></script>

            <script src="./bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

            <script src="./bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
            <script src="./bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
        </body>
    );
}

export default Home;

{
    /*
<ul
          class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
          id="accordionSidebar"
        >
          <hr class="sidebar-divider my-0" />

          <li class="nav-item active">
            <a class="nav-link" href="index.html">
              <i class="fas fa-fw fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </a>
          </li>

          <hr class="sidebar-divider"></hr>

          <div class="sidebar-heading">Interface</div>

          <li class="nav-item">
            <a
              class="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#collapseTwo"
              aria-expanded="true"
              aria-controls="collapseTwo"
            >
              <i class="fas fa-fw fa-cog"></i>
              <span>Components</span>
            </a>
            <div
              id="collapseTwo"
              class="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordionSidebar"
            >
              <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Custom Components:</h6>
                <a class="collapse-item" href="buttons.html">
                  Buttons
                </a>
                <a class="collapse-item" href="cards.html">
                  Cards
                </a>
              </div>
            </div>
          </li>

          <li class="nav-item">
            <a
              class="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#collapseUtilities"
              aria-expanded="true"
              aria-controls="collapseUtilities"
            >
              <i class="fas fa-fw fa-wrench"></i>
              <span>Utilities</span>
            </a>
            <div
              id="collapseUtilities"
              class="collapse"
              aria-labelledby="headingUtilities"
              data-parent="#accordionSidebar"
            >
              <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Custom Utilities:</h6>
                <a class="collapse-item" href="utilities-color.html">
                  Colors
                </a>
                <a class="collapse-item" href="utilities-border.html">
                  Borders
                </a>
                <a class="collapse-item" href="utilities-animation.html">
                  Animations
                </a>
                <a class="collapse-item" href="utilities-other.html">
                  Other
                </a>
              </div>
            </div>
          </li>

          <hr class="sidebar-divider" />

          <div class="sidebar-heading">Addons</div>

          <li class="nav-item">
            <a
              class="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#collapsePages"
              aria-expanded="true"
              aria-controls="collapsePages"
            >
              <i class="fas fa-fw fa-folder"></i>
              <span>Pages</span>
            </a>
            <div
              id="collapsePages"
              class="collapse"
              aria-labelledby="headingPages"
              data-parent="#accordionSidebar"
            >
              <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header">Login Screens:</h6>
                <a class="collapse-item" href="login.html">
                  Login
                </a>
                <a class="collapse-item" href="register.html">
                  Register
                </a>
                <a class="collapse-item" href="forgot-password.html">
                  Forgot Password
                </a>
                <div class="collapse-divider"></div>
                <h6 class="collapse-header">Other Pages:</h6>
                <a class="collapse-item" href="404.html">
                  404 Page
                </a>
                <a class="collapse-item" href="blank.html">
                  Blank Page
                </a>
              </div>
            </div>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="/homepage">
              <i class="fas fa-fw fa-chart-area"></i>
              <span>Landing Page</span>
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="/gene_bootstrap">
              <i class="fas fa-fw fa-table"></i>
              <span>Bootstrap Sample Page</span>
            </a>
          </li>

          <hr class="sidebar-divider d-none d-md-block" />
        </ul>

*/
}
