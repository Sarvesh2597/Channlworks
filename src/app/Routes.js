/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React, { useState, useEffect } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";
import index from "./modules/AuthOnboarding/index";
import { ProgramDefinition } from "./pages/Programs/ProgramDefinition";

export function Routes() {
  // const [sessionEx, setSessionEx] = useState(true);
  // useEffect(() => {
  //   sessionExp();
  // });
  const { isAuthorized } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user != null,
    }),
    shallowEqual
  );

  // const sessionExp = () => {
  //   const userToken = window.localStorage.getItem('token');
  //   const decoded = jwtDecode(userToken);
  //   const currentTime = Date.now() / 1000;
  //   if (decoded.exp < currentTime) {
  //       console.warn('access token expired');
  //       localStorage.clear();
  //       setSessionEx(false);
  //   } else {
  //       setSessionEx(true);
  //   }
  // }

  return (
    <Switch>
      {!isAuthorized ? (
        /*Render auth page when user at `/auth` and not authorized.*/
        <Route>
          <AuthPage />
        </Route>
      ) : (
        /*Otherwise redirect to root page (`/`)*/
        <Redirect from="/auth" to="/" />
      )}

      <Route path="/error" component={ErrorsPage} />
      <Route path="/logout" component={Logout} />
      <Route path="/program-definiton/:accociationId/:programId/:programName" component={ProgramDefinition} />
      <Route path="/authentication" component={index} />

      {!isAuthorized ? (
        /*Redirect to `/auth` when user is not authorized*/
        <Redirect to="/auth/login" />
      ) : (
        <Layout>
          <BasePage />
        </Layout>
      )}
    </Switch>
  );
}
