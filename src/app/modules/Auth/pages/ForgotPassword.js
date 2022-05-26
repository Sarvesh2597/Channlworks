import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { fetchJSON } from "../../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../../_metronic/_constants/endpoints";
import { DebounceInput } from "react-debounce-input";


function ForgotPassword(props) {
  const [loading, setLoading] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailClass, setEmailClass] = useState("");
  const [disabledButton, setButtonDisable] = useState(true);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    setButtonDisable(true);
  });
  
  useEffect(() => {
    setSendSuccess(false);
    if (emailValue && !validateEmail(emailValue)) {
      setEmailClass("is-invalid");
      setEmailError("*Please enter valid Email address.");
      setButtonDisable(true);
    } else {
      setEmailClass("");
      setEmailError("");
      setButtonDisable(false);
    }
  }, [emailValue]);

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const onSubmitForm  = async () => {
    if(emailValue) {
      enableLoading();
      const res = await fetchJSON(BASE_URL + "/users/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: emailValue,
        }),
      });
      disableLoading();
  
      if (res) {
        setSendSuccess(true);
        setEmailError("Please verify your email sent to you.");
      } else {
        // setLoginError(res);
        // props.loginUser("wrong", "wrong", props.history);
      }
    } else {
      setEmailClass("is-invalid");
      setEmailError("*Please enter valid Email address.");
      setButtonDisable(false);
    }
  };

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
        <Link to="/" className="flex-column-auto mt-5 pb-lg-0 pb-10">
          <img
            alt="Logo"
            className="max-h-200px mb-10"
            src={toAbsoluteUrl("/media/logos/logo-company.jpg")}
          />
        </Link>
        <h3 className="font-size-h1">Reset Password</h3>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <div
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        <div className="form-group fv-plugins-icon-container">
          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            placeholder="Email"
            className={`form-control form-control-solid h-auto py-5 px-6 ${emailClass}`}
            onChange={(event) => setEmailValue(event.target.value)}
          />
          {emailError && !sendSuccess ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{emailError}</div>
            </div>
          ) : null}
          {emailError && sendSuccess ? (
            <div className="fv-plugins-message-container ">
              <div className="fv-help-block">{emailError}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
          <div className="text-center">
            <span className="font-weight-bold text-dark-50">
              Already have an account ?
            </span>
            <Link
              to="/auth/login"
              className="font-weight-bold ml-2"
              id="kt_login_signup"
            >
              Sign In!
            </Link>
          </div>
          <button
            disabled={emailError || loading}
            onClick={() => onSubmitForm()}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span>Reset</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>
        <div className="text-center">
          <span className="font-weight-bold text-dark-50">
            Don't have an account yet?
          </span>
          <Link
            to="/auth/registration"
            className="font-weight-bold ml-2"
            id="kt_login_signup"
          >
            Sign Up!
          </Link>
        </div>
      </div>
      {/*end::Form*/}
    </div>
  );
}

export default ForgotPassword;
