import React, { useState } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { register } from "../_redux/authCrud";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
const initialValues = {
  fullname: "",
  email: "",
  username: "",
  password: "",
  changepassword: "",
  acceptTerms: false,
};

function ConfirmEmail(props) {
  return (
    <div className="login-form login-signin" style={{ display: "block" }}>
      <div className="text-center">
        <img
          alt="Logo"
          className="max-h-200px mb-10"
          src={toAbsoluteUrl("/media/logos/logo-company.jpg")}
        />
      </div>

      <form
        id="kt_login_signin_form"
        className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
      >
         <div className="text-center">
         <label>Email confirmation has been sent to your mail. Click on this link to activate your account!!</label>
         </div>
        {/* begin: Terms and Conditions */}
        <div className="form-group"></div>
        {/* end: Terms and Conditions */}
        <div className="form-group d-flex flex-wrap flex-center">
          <Link to="/auth/verify-registration">
            <button
              type="submit"
              className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
            >
              <span>Proceed</span>
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ConfirmEmail;
