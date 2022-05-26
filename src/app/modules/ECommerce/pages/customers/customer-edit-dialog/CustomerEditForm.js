// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Input,
  Select,
  DatePickerField,
} from "../../../../../../_metronic/_partials/controls";

// Validation schema
const CustomerEditSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Firstname is required"),
  lastName: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Lastname is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  userName: Yup.string().required("Username is required"),
  dateOfBbirth: Yup.mixed()
    .nullable(false)
    .required("Date of Birth is required"),
  ipAddress: Yup.string().required("IP Address is required"),
});

export function CustomerEditForm({
  saveCustomer,
  customer,
  actionsLoading,
  onHide,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={customer}
        validationSchema={CustomerEditSchema}
        onSubmit={(values) => {
          saveCustomer(values);
        }}
      >
        {({ handleSubmit }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <p className="mb-4">
                <b>
                  Please provide the declarations required for this program
                  below.
                </b>
              </p>
              <div className="form-group d-flex row align-items-center mt-4">
                <label className="col-xl-6 col-lg-6 col-form-label font-weight-bold">
                  Current Business Profile
                </label>
                <div className="col-lg-9 col-xl-6 d-flex justify-content-end">
                  <span className="switch switch-sm">
                    <label>
                      <input type="checkbox" name="emailNotification" />
                      <span></span>
                    </label>
                  </span>
                </div>
              </div>
              <div className="form-group row align-items-center mt-4">
                <label className="col-xl-6 col-lg-6 col-form-label font-weight-bold">
                  Annual/Joint Business Plan
                </label>
                <div className="col-lg-9 col-xl-6 d-flex justify-content-end">
                  <span className="switch switch-sm">
                    <label>
                      <input type="checkbox" name="emailNotification" />
                      <span></span>
                    </label>
                  </span>
                </div>
              </div>
              <div className="form-group row align-items-center mt-4">
                <label className="col-xl-6 col-lg-6 col-form-label font-weight-bold">
                  Regional Authorization for any/all of the thirteen Google
                  Region(s)
                </label>
                <div className="col-lg-9 col-xl-6 d-flex justify-content-end">
                  <span className="switch switch-sm">
                    <label>
                      <input type="checkbox" name="emailNotification" />
                      <span></span>
                    </label>
                  </span>
                </div>
              </div>
              <div className="form-group row align-items-center mt-4">
                <label className="col-xl-6 col-lg-6 col-form-label font-weight-bold">
                  Atleast two Approved Products Integrations
                </label>
                <div className="col-lg-9 col-xl-6 d-flex justify-content-end">
                  <span className="switch switch-sm">
                    <label>
                      <input type="checkbox" name="emailNotification" />
                      <span></span>
                    </label>
                  </span>
                </div>
              </div>
              <div className="form-group row align-items-center mt-4">
                <label className="col-xl-6 col-lg-6 col-form-label font-weight-bold">
                  Billings of $1,00,000 exclusively in Developed Markets
                </label>
                <div className="col-lg-9 col-xl-6 d-flex justify-content-end">
                  <span className="switch switch-sm">
                    <label>
                      <input type="checkbox" name="emailNotification" />
                      <span></span>
                    </label>
                  </span>
                </div>
              </div>
              <div className="form-group row align-items-center mt-4">
                <label className="col-xl-6 col-lg-6 col-form-label font-weight-bold">
                  Billings of $500,000 exclusively in Growth Markets
                </label>
                <div className="col-lg-9 col-xl-6 d-flex justify-content-end">
                  <span className="switch switch-sm">
                    <label>
                      <input type="checkbox" name="emailNotification" />
                      <span></span>
                    </label>
                  </span>
                </div>
              </div>
              <div className="form-group row align-items-center mt-4">
                <label className="col-xl-6 col-lg-6 col-form-label font-weight-bold">
                  1,000,000 Monthly Active US
                </label>
                <div className="col-lg-9 col-xl-6 d-flex justify-content-end">
                  <span className="switch switch-sm">
                    <label>
                      <input type="checkbox"  name="emailNotification" />
                      <span></span>
                    </label>
                  </span>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
              <> </>
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Submit
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
