import React, { useEffect, useState } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import { BASE_URL } from "../../../../_metronic/_constants/endpoints";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { fetchJSON } from "../../../../_metronic/_helpers/api";
function VerifyRegistration(props) {
  let params = useQuery();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(params['email'])
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
  }, [confPassword, password, username]);

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const onSubmitForm = async () => {
    if (!errorStatus) {
      if (username === '') {
        setErrorMessage("Enter username.");
      } else {
        const payloadVerifyUsername = {
          username: username,
        };
        const usernameAvail = await fetchJSON(
          BASE_URL + "/onboarding/checkusername",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadVerifyUsername),
          }
        );
        if (usernameAvail === "valid username!") {
          const payload = {
            userEmail: email,
            username: username,
            userPassword: password,
            invite: params["invite"] ? params["invite"] : false,
          };
          const createPass = await fetchJSON(
            BASE_URL + "/onboarding/createpassword",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
          if (createPass === 'Updat success..!') {
            setRedirectToLogin(true);
          }
        } else {
          setErrorMessage("*Error validating username.");
        }
      }
    }
  };

  return (
    <div className="login-form login-signin" style={{ display: "block" }}>
      {(isRedirect || !validateEmail(params['email'])) && <Redirect to="/auth/login" />}
      <div className="text-center">
        <img
          alt="Logo"
          className="max-h-100px mb-10"
          src={toAbsoluteUrl("/media/logos/logo-company.jpg")}
        />
      </div>

      <div
        id="kt_login_signin_form"
        className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
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
            placeholder="UserName"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6`}
            name="username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
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

        {/* begin: Terms and Conditions */}
        <div className="form-group"></div>
        {/* end: Terms and Conditions */}
        <div className="form-group d-flex flex-wrap flex-center">
          {/* <Link to="/authentication/on-boarding"> */}
          <button
            type="submit"
            className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
            onClick={() => onSubmitForm()}
          >
            <span>Create Password</span>
          </button>
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
}

export default VerifyRegistration;
