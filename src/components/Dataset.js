import React from 'react';
import "./Dataset.css";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";

import LimitedText from './LimitedText.js'

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

function Dataset(props) {
  return (
    <div> 
      <div class="card shadow" style={{minWidth: `${parseInt((0.7 * props.curOuterWindowWidth) / 3)}`, maxWidth: `${parseInt((0.7 * props.curOuterWindowWidth) / 3)}`, minHeight: '175px', maxHeight: '175px'}}>
        <div class="card-body">
          <h5 class="card-title">{props.dataset.name}</h5>
          <LimitedText text={props.dataset.description} />
          
          {/*<p class="card-text">{props.dataset.description}</p>*/}
          {/* href={"/dataset/" + props.dataset.id} */}
          <br />
          <a  class="btn btn-primary btn-sm" id="button_dataset_card" onClick={() => {
            console.log("line 22 : DatasetList: width smaller size");
            console.log((0.7 * props.curOuterWindowWidth) / 3);
          }}> Learn more </a>
        </div>
      </div>

      <script src="./bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
      <script src="./bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="./bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>
      <script src="./bootstrap_gene_page/js/sb-admin-2.min.js"></script>
      <script src="./bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>
      <script src="./bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
      <script src="./bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
    </div>
  );
}

export default Dataset;
