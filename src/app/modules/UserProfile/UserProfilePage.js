import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
// CUSTOM ADDED
import { Table, Form, Modal, InputGroup, FormControl } from "react-bootstrap";
import { Button } from "@material-ui/core";
// CUSTOM ADDED
import { useSubheader } from "../../../_metronic/layout";
import AccountInformation from "./AccountInformation";
import { ProfileOverview } from "./ProfileOverview";
import ChangePassword from "./ChangePassword";
import PersonaInformation from "./PersonaInformation";
import EmailSettings from "./EmailSettings";
import { ProfileCard } from "./components/ProfileCard";

export default function UserProfilePage() {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  const suhbeader = useSubheader();
  suhbeader.setTitle("User profile");
  return (
    <div className="d-flex flex-row">
      <ProfileCard></ProfileCard>
      <div className="flex-row-fluid ml-lg-8">
        <Switch>
          <Redirect
            from="/user-profile"
            exact={true}
            to="/user-profile/profile-overview"
          />
          <Route
            path="/user-profile/profile-overview"
            component={ProfileOverview}
          />
          <Route
            path="/user-profile/account-information"
            component={AccountInformation}
          />
          <Route
            path="/user-profile/change-password"
            component={ChangePassword}
          />
          <Route
            path="/user-profile/email-settings"
            component={EmailSettings}
          />
          <Route
            path="/user-profile/personal-information"
            component={PersonaInformation}
          />
        </Switch>
        
      </div>
       {/* MODAL STARTS HERE*/}

       <Modal size="lg" show={show} onHide={handleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Employee Name *</Form.Label>
              <Form.Control type="name" placeholder="" />
            </Form.Group>

            <Form.Group controlId="validationCustom02">
              <Form.Label>Joined On *</Form.Label>

              <Form.Control required type="date" placeholder="Lead Date" />
            </Form.Group>

            <Form.Group controlId="validationCustom02">
              <Form.Label>Left On *</Form.Label>

              <Form.Control
                required
                type="date"
                disabled
                placeholder="Lead Date"
              />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Email Name *</Form.Label>
              <Form.Control type="email" placeholder="" />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Principal(s)</Form.Label>
              <Form.Control type="text" placeholder="" />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Comment</Form.Label>
              <Form.Control as="textarea" rows="3" />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Button
                variant="primary"
                onClick={handleShow}
                className="btn btn-light-primary font-weight-bolder"
              >
                Add Certifications
              </Button>
            </Form.Group>
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleShow}
            className="btn btn-light-primary font-weight-bolder"
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL ENDS HERE*/}
    </div>
  );
}
