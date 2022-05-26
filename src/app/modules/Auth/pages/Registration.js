import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { DebounceInput } from "react-debounce-input";
import { fetchJSON } from "../../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../../_metronic/_constants/endpoints";
const RestrictedDomainsList = ['@gmail.com','@yahoo.com','@outlook.com','@hotmail.com','@live.com','@mail.com'];
function Registration(props) {
  const [loading, setLoading] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailClass, setEmailClass] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    setRegisterSuccess(false);
    if (emailValue) {
      emailVerification(emailValue);
    } else {
      setEmailClass("");
      setEmailError("");
      setLoading(false);
    }
  }, [emailValue]);

  const emailVerification = async () => {
    if (validateEmail(emailValue)) {
      setEmailClass("is-valid");
      setEmailError("");
      const payload = {
        userEmail: emailValue,
      };
      fetchJSON(BASE_URL + "/onboarding/checkemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((res) => {
        console.log(res);
        if (res === "Email not found!") {
          setLoading(true);
        } else {
          setEmailClass("is-invalid");
          setEmailError("Email Id of this domain already exists.");
          setLoading(false);
        }
      });
    } else {
      setEmailClass("is-invalid");
      setEmailError("*Please enter valid Email address.");
      setLoading(false);
    }
  };

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePersonalEmail(email){
    if(RestrictedDomainsList.find(item=>email.includes(item))){
      return true;
    }else{
      return false;
    }
  }

  const onSubmitForm = () => {
    if (loading) {
      // http://dev01api.channlworks.com/onboarding/createadmin
      const payload = {
        userEmail: emailValue,
        userPassword: "test123",
      };
      fetchJSON(BASE_URL + "/onboarding/createadmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((res) => {
        if (res === "user added ...") {
          setRegisterSuccess(true);
          setEmailError("Please verify your email sent to you.");
        } else {
          setEmailClass("is-invalid");
          setEmailError("Email Id of this domain already exists.");
          setLoading(false);
          setRegisterSuccess(false);
        }
      });
    } else {
      // setLoading(false);
    }
  };

  return (
    <div className="login-form login-signin" style={{ display: "block" }}>
      <div className="text-center">
        <img
          alt="Logo"
          className="max-h-200px mb-10"
          src={toAbsoluteUrl("/media/logos/logo-company.jpg")}
        />
      </div>
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.REGISTER.TITLE" />
        </h3>
      </div>

      <div
        id="kt_login_signin_form"
        className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
      >
        {/* begin: Email */}
        <div className="form-group fv-plugins-icon-container">
          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            placeholder="Email"
            className={`form-control form-control-solid h-auto py-5 px-6 ${emailClass}`}
            onChange={(event) => validatePersonalEmail(event.target.value) ? setEmailError('Personal email IDs not allowed') : setEmailValue(event.target.value)}
          />
          {emailError && !registerSuccess ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{emailError}</div>
            </div>
          ) : null}
          {emailError && registerSuccess ? (
            <div className="fv-plugins-message-container ">
              <div className="fv-success-block">{emailError}</div>
            </div>
          ) : null}
        </div>
        {/* end: Email */}

        <div className="form-group d-flex flex-wrap flex-center">
          <button
            className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
            disabled={!loading}
            onClick={() => onSubmitForm()}
          >
            <span>SignUp</span>
          </button>
        </div>
      </div>
      <div className="text-center">
        <span className="font-weight-bold text-dark-50">
          Already have an account yet?
        </span>
        <Link
          to="/auth/login"
          className="font-weight-bold ml-2"
          id="kt_login_signup"
        >
          Sign In!
        </Link>
      </div>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Registration));
