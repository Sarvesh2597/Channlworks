import React from "react";
import { Modal } from "react-bootstrap";
import { Button } from "@material-ui/core";

import { Switch } from "@material-ui/core";


import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";


const DeleteConfirmationModal = (props) => {

    const deleteAssociation = async () => {
        const objToSend = {
          associationId: props.program.associationId,
        };
        const res = await fetchJSON(
          BASE_URL + "/dashboard/myorg/associations/program",
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
        <Modal size="md" show={true} centered onHide={() => props.onClose()}>
        <Modal.Body>
          <div className="d-flex justify-content-center mb-4">
            <h1>Are you sure?</h1>
          </div>
          <div className="d-flex justify-content-center mt-2">
            <span className="font-size-25">
              You are about to delete <b> {props.program.programName}</b>!
            </span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => props.onClose()}
            className="btn btn-light-warning font-weight-bolder mr-5"
          >
            Cancel
          </Button>
          <Button
            className="btn btn-light-danger font-weight-bolder"
            onClick={() => deleteAssociation()}
          >
            Yes, delete it!
          </Button>
        </Modal.Footer>
      </Modal>
    );
}


export default DeleteConfirmationModal;