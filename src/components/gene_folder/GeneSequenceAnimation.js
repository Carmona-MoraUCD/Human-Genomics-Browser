
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { CircularProgress } from '@mui/material';

import { clone } from "ramda";

import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../bootstrap_gene_page/css/sb-admin-2.min.css"

import './GeneSequenceAnimation.css'

function breakUpCode(code_str) {
    let list_str_code = []
    for (var i = 0; code_str && i < code_str.length; i += 5) {
      let temp_str = "";
      if (i + 5 < code_str.length) {
        temp_str = code_str.substring(i, i + 5);
      } else {
        temp_str = code_str.substring(i, code_str.length);
      }
      list_str_code.push(temp_str);
    }
  
    return list_str_code;
  }
  
  function getColor(index_group) {
    if (index_group % 4 === 0) {
      // purple shade
      return '#f2a2f5'
    } else if (index_group % 4 === 1) {
      // red shade
      return '#f56464';
    } else if (index_group % 4 === 2) {
      // green shade
      return '#9ff595';
    } else {
      // blue shade
      return '#84a8f0';
    }
  }

function GeneSequenceAnimation(props){

    // { code: ["mrna"] }
    const [gene_code_info, set_gene_code_info] = useState(null);
    const [sequence_loaded, set_sequence_loaded] = useState(false);

    useEffect(() => {
        async function fetchSeqName() {

          let temp_gene_name = clone(String(props.gene_name))

          let dot_index = props.gene_name.indexOf(".")
          if(dot_index >= 0){
            temp_gene_name = temp_gene_name.substring(0, dot_index)
          }
    
          const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/seq/names/${temp_gene_name}`);
          console.log(resp);
          console.log("seq names");
          var data_code = resp.data;
          if (data_code && data_code.code && data_code.code.length > 1) {
            // remove 'mrna' initial
            data_code.code = data_code.code.slice(1, data_code.code.length);
            // remove blanks at end
            while (data_code.code.length > 1 && data_code.code[data_code.code.length - 1] === "") {
              data_code.code.pop();
            }
          }
          set_gene_code_info(data_code);
          console.log(data_code);
          
        }

        fetchSeqName().catch(() => {
          console.log("some problem and could not get sequence")
        })

        set_sequence_loaded(true);
        
      }, [props.gene_name]);

    return(
        <div class="col-xl" id="gene_animation">
          {sequence_loaded ? (
            <div class="card shadow" >
              <div
                class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary">Code</h6>
              </div>

              <div class="card-body" >
                {   gene_code_info ?
                    <TableContainer style={{ width: '100%', height: '500px', overflow: 'scroll' }}>

                      <Table style={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                          </TableHead>
                          <TableBody>
                          {
                              gene_code_info.code.map(function (item, row_i) {
                              return <TableRow key={row_i}>
                                  <TableCell>
                                  
                                  <div className="codeRow" >{breakUpCode(item).map(function (code_str, i) {
                                      return <div className="codeCard" style={{ backgroundColor: getColor(i) }}>
                                      {code_str}
                                      </div>
                                  })}</div>

                                  </TableCell>
                                  
                              </TableRow>

                              })
                          }
                          </TableBody>
                      </Table>

                      </TableContainer>
                      :
                      <>No code available</>
                  }
              </div>
            </div>

          )
          :

          (
            
            <div>
              <CircularProgress />
            </div>

          )}

        </div>
    )
}

export default GeneSequenceAnimation