import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function CustomerEditDialogHeader({ id }) {
  // Customers Redux state
  const { customerForEdit, actionsLoading } = useSelector(
    (state) => ({
      customerForEdit: state.customers.customerForEdit,
      actionsLoading: state.customers.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Customer";
    if (customerForEdit && id) {
      _title = `${customerForEdit.firstName}`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [customerForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <div className="row">
          <div className="col-lg-12">
            <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
          </div>
          <div className="col-lg-12">
            <p>Declarations</p>
          </div>
        </div>
      </Modal.Header>
    </>
  );
}
