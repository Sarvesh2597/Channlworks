import React,{useEffect,useState} from "react";
import { Modal } from "react-bootstrap";
import { Button } from "@material-ui/core";
import DataTable from "../../Components/DataTable";
import { datePipe } from "../../../_metronic/_helpers/date-pipe";
import moment from "moment";
const ExpiredCertificatesModal = ({show,onClose,data}) => {
    const Columns = [
        {
            label:"Employee Name",
            key:"employeeName"
        },
        {
          label:"Certifications",
          key:"certficationCount",
          isHoverData:true
      }
    ]
    return (
        <Modal size="lg" show={show} centered onHide={() =>onClose()}>
        <Modal.Body>
          <div className="d-flex flex-column">
            <h4>Expired Certificates</h4>
            <DataTable 
            columns={Columns}
            data={[...data.map((item)=>{
              item.hoverDataTitle = 'Expired Certifications';
              item.hoverData=[...item?.employeeCertifications.map((element=>{
                  return {text:element?.name?.certificationName,value: datePipe(element?.validity)}
              }))];              
              item.certficationCount = item?.hoverData.length;
              return item;
            })].filter(item=>item?.hoverData.length>0)}
            ></DataTable>
          </div>          
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => onClose()}
            className="btn btn-danger font-weight-bolder mr-5"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default ExpiredCertificatesModal;