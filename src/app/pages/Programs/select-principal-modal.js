import React, { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { Button } from "@material-ui/core";

import _ from "lodash";

const SelectPrincipalModal = props => {
	const [selectedPrincipalId, setSelectedPrincipalId] = useState(null);

	return (
		<Modal size="lg" show={true} onHide={() => props.onClose()}>
			<Modal.Header closeButton>
				<Modal.Title>Vendor Contact</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{/* FORM STARTS */}
				<Form>
					<Form.Group controlId="exampleForm.ControlInput1">
						<Form.Label>Vendor *</Form.Label>
						<Form.Control
							as="select"
							name="principal"
							onChange={e => {
								setSelectedPrincipalId(e.target.value);
								props.setSelectedPrincipal(e.target.value);
							}}
							value={selectedPrincipalId}
						>
							<option selected="true" disabled="disabled">
								Select Vendor
							</option>
							{props.principals.map(e => (
								<option value={e.principalId}>{e.principalName}</option>
							))}
						</Form.Control>
					</Form.Group>
				</Form>
				{/* FORM ENDS */}
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="danger"
					onClick={() => props.onClose()}
					className="btn btn-light-danger font-weight-bolder mr-5"
				>
					Close
				</Button>
				<Button
					className="btn btn-light-primary font-weight-bolder"
					onClick={() => props.onNext()}
					disabled={!selectedPrincipalId}
				>
					Next
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default SelectPrincipalModal;
