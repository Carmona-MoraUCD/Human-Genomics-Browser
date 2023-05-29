import React from "react";
import "./Dataset.css";

import { useEffect, useState } from "react";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";

import LimitedText from '../../filters/LimitedText'

import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../../bootstrap_gene_page/css/sb-admin-2.min.css"

function Dataset(props) {

  return (
    <div> 
      <div class="card" style={{minWidth: `${parseInt( ((0.7 * props.curOuterWindowWidth) - 60) / 3)}px`, maxWidth: `${parseInt( ((0.7 * props.curOuterWindowWidth) - 60) / 3)}px`, minHeight: '175px', maxHeight: '175px', overflow:'hidden'}}>
        <div class="card-body">
          <h5 class="card-title"><a href={props.dataset ? "/dataset/" + props.dataset.id : "#"} onClick={() => {
            
          }} > {props.dataset ? props.dataset.name : ""} </a></h5>
          <p id="dataset_card_bookmark_display">Dataset ID: {props.dataset && props.dataset.id ? props.dataset.id : '-'}</p>
          <LimitedText numLines='2' text={`Description: ${props.dataset ? props.dataset.description : ""}`} />
          
          {/*<p >{props.dataset.description}</p>*/}
          {/*<br />
          <a href={props.dataset ? "/dataset/" + props.dataset.id : "#"} class="btn btn-primary btn-sm" id="button_dataset_card" onClick={() => {
            
          }} > Learn more </a>*/}
        </div>
      </div>

            <script src="../../bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
            <script src="../../bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
            <script src="../../bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>
            <script src="../../bootstrap_gene_page/js/sb-admin-2.min.js"></script>
            <script src="../../bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>
            <script src="../../bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
            <script src="../../bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
        </div>
    );
}

export default Dataset;

{/*
<div class="card shadow mb-4">
    <div class="card-body">
        <h5 class="card-title">{props.dataset.name}</h5>
        <p class="card-text">{props.dataset.description}</p>
        <br />
        <a
            href={"/dataset/" + props.dataset.id}
            class="btn btn-primary btn-sm"
        >
            {" "}
            Learn more{" "}
        </a>
    </div>
*/}