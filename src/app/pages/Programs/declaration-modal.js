import React from "react";
import { Modal } from "react-bootstrap";
import { Button } from "@material-ui/core";

import { Switch } from "@material-ui/core";


import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";


const DeclarationModal = (props) => {
    const onSubmitEdit = async () => {
        const objToSend = {
          createdAt: "",
          declarations: props.declarationTemplate,
          programAssociationId: props.program.associationId,
          updatedAt: "",
        };
        const res = await fetchJSON(
          BASE_URL + "/dashboard/myorg/associations/update-declaration",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(objToSend),
          }
        );
        if (res) {
            props.onSubmit();        
        }
    };

    return (
        <Modal size="lg" show={true} onHide={() => props.onClose()}>
        <Modal.Header closeButton>
          <div>
            <Modal.Title>{props.program.programName}</Modal.Title>

            <p className="mt-1">Declarations</p>
          </div>
        </Modal.Header>
        <Modal.Body>
          {/* FORM STARTS */}
          <h6>
            Please provide the Declaration required for this program below
          </h6>
          {props.declarationTemplate &&
            props.declarationTemplate.map((prog, i) => {
              return (
                <div className="d-flex justify-content-between mt-6">
                  <p>{prog.name}</p>
                  <div>
                    <Switch
                      checked={prog.userValue}
                      onChange={(e) => props.onDeclarationChange(e, i, prog.uuid)}
                      inputProps={{ "aria-label": "info checkbox" }}
                    />
                  </div>
                </div>
              );
            })}

          {/* FORM ENDS */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={(e) => props.onClose()}
            className="btn btn-light-danger font-weight-bolder mr-5"
          >
            Close
          </Button>
          <Button
            className="btn btn-light-primary font-weight-bolder"
            onClick={(e) => onSubmitEdit(e)}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
}


export default DeclarationModal;