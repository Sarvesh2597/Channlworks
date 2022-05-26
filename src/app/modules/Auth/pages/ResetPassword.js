import React, { useEffect, useState } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import { BASE_URL } from "../../../../_metronic/_constants/endpoints";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { fetchJSON } from "../../../../_metronic/_helpers/api";

function ResetPassword(props) {
  const [password, setPassword] = useState("");
  let params = useQuery();
  const [email, setEmail] = useState(params['email']);
  // const [email, setEmail] = useState(params['email']);
  const [confPassword, setConfPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const [isRedirect, setRedirectToLogin] = useState(false);
  function useQuery() {
    const search = props.location.search.replace("?", "");
    const query = search.split("&");
    const queryParams = {};
    query.map((ele) => {
      const param = ele.split("=");
      queryParams[param[0]] = param[1];
    });
    return queryParams;
  }

  useEffect(() => {
    setErrorMessage("");
    setErrorStatus(false);
    if (confPassword && password) {
      if (confPassword !== password) {
        setErrorMessage("Password does not match.");
        setErrorStatus(true);
      }
    }
  }, [confPassword, password]);

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const onSubmitForm = async () => {
    if (!errorStatus) {
        const payload = {
          userEmail: email,
          userPassword: password,
          cipher: params['cipher']
        };
        const response = await fetchJSON(
          BASE_URL + "/users/reset/password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (response === "Updat success..!") {
          setRedirectToLogin(true); // need to add toaster
        } else {
          setErrorMessage(response);
        }
          
    }
  };
  return (
    <div className="login-form login-signin" style={{ display: "block" }}>
      {(isRedirect || !validateEmail(params['email'])) && <Redirect to="/auth/login" />}
      <div className="text-center mb-10 mb-lg-20">
        <Link to="/" className="flex-column-auto mt-5 pb-lg-0 pb-10">
          <img
            alt="Logo"
            className="max-h-200px mb-10"
            src={toAbsoluteUrl("/media/logos/logo-company.jpg")}
          />
        </Link>
        {/* <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.LOGIN.TITLE" />
        </h3> */}
        <div>
          <h3 className="text-muted font-weight-bold">Reset your Password</h3>
        </div>
      </div>

      <div
        // onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Email"
            type="email"
            className={`form-control form-control-solid h-auto py-5 px-6`}
            name="email"
            value={params["email"]}
            disabled={true}
          />
        </div>
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="New Password"
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6`}
            name="newPassword"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Confirm New Password"
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6`}
            name="confirmPassword"
            onChange={(event) => {
              setConfPassword(event.target.value);
            }}
          />
        </div>
        {errorMessage ? (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">{errorMessage}</div>
          </div>
        ) : null}
        <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
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
          <button
            type="submit"
            disabled={errorMessage || !password}
            onClick={() => onSubmitForm()}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span>Reset</span>
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

export default ResetPassword;
