import React, { useEffect, useState } from "react";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import "../../../_metronic/_assets/sass/pages/error/error-3.scss";
import { Table, Form, Button } from "react-bootstrap";
// import { fetchJSON } from "../../../_metronic/_helpers/api";
// import { BASE_URL } from "../../../_metronic/_constants/endpoints";
// import { useLocation } from "react-router";
import {useLocation} from "react-router-dom";

export function ErrorPage3 ({authed}) {
  // const getCaseStudyList = async () => {
  //   setCaseStudy([]);
  //   const user = localStorage.getItem("user-details");
  //   const partnerId = JSON.parse(user).partnerId;

  //   const res = await fetchJSON(
  //     BASE_URL + "/dashboard/cases/partner/" + partnerId + "/all"
  //   );
  //   if (res) {
  //     console.log(res);
  //     setCaseStudy(res);
  //   }
  // };
  // const location = useLocation()
// useEffect(() => {
//   const {caseStudy} = props.location.state;
// })
// let data = useLocation();
  console.log(authed)
  
  return (

    
    <>
    
      <div className={`d-flex flex-column flex-root container-box1`}>
        <div className="d-flex flex-row-fluid flex-column bgi-size-cover bgi-position-center bgi-no-repeat p-10 p-sm-30 ">
          <div className="ml-auto btn-box">
            <button className="btn btn-primary">Print</button>
          </div>
          <Table>
                <tr>
                <h4 className="text-primary">CASE STUDY</h4>
                {/* <h3>{props.caseTitle}</h3> */}
              </tr>
           
          
          </Table>
          {/* <div className="d-flex justify-content-between page-title mb-15">
            <div>
              <h4 className="text-primary">CASE STUDY</h4>
              <h3 className="text-dark"> {console.log(caseStudy.length && caseStudy.caseTitle)}</h3>
            </div>
            <div>
              <h4 className="text-primary">ADDED ON</h4>
              <h3>March 10, 2021</h3>
            </div>
          </div> */}
          <div className="table-width">
            <Table>
              <tbody>
                <tr>
                  <td>Client Name</td>
                  <td>MarkerChecker.com</td>
                </tr>
                <tr>
                  <td>Employee(s)</td>
                  <td>Vendy-Russell</td>
                </tr>
                <tr>
                  <td>Technology Tags</td>
                  <td>AWS-Aurora</td>
                </tr>
                <tr>
                  <td>Refernce Type</td>
                  <td>Public</td>
                </tr>
                <tr>
                  <td>Refernce Type</td>
                  <td>Public</td>
                </tr>
                <tr>
                  <td>Technical Summary</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Architecture</td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
