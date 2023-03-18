import React, { useState } from 'react';
import TextField from "@mui/material/TextField";
import { IconButton, Button } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import "./home.css";
import SampleList from './components/SampleList';
import Slider from './components/Slider';


function Home() {
    const [search, setSearch] = useState('');
    return (
        <div className='home'>
            <h2>
                Human Genomics Search
            </h2>
            <a href={"/homepage"}><h4> Home Page </h4></a>
            <div className='search'>
                <TextField
                    id='input_keyword'
                    onChange={(e) => setSearch(e.target.value)}
                    variant='outlined'
                    fullWidth
                    label="Search by gene names or dataset name"
                />
                <IconButton type="submit" aria-label="search">
                    <SearchIcon style={{ fill: "blue" }} />
                </IconButton>
            </div>

            <div className='search-result'>
                <ul className='search-result'>
                    <Slider />
                    <SampleList kword={search}/>
                </ul>
            </div>

            <div className='search-result'>
                <ul className='search-result'>
                    <Button href="/upload" variant="contained" size='large' sx={ { borderRadius: 28 } }>Upload</Button>
                </ul>
            </div>

        </div>



  );
}

export default Home