import React from "react";
import { Route, Switch } from "react-router-dom";
import OnBoarding from "./OnBoarding";
import PrincipalSelection from "./PrincipalSelection";

export default function ErrorsPage() {
  return (
    <Switch>
      <Route path="/authentication/on-boarding" component={OnBoarding} />
      {/* <Route path="/authentication/principal-selection" component={PrincipalSelection} /> */}
    </Switch>
  );
}
