import React, { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { MixedWidget2 } from "../../_metronic/_partials/widgets/mixed/MixedWidget2";
import { Button } from "@material-ui/core";
import { fetchJSON } from "../../_metronic/_helpers/api";
import { BASE_URL } from "../../_metronic/_constants/endpoints";
import _ from "lodash";
import SnackbarComp from "../Components/SnackbarComp";

function PrincipalPage() {
	const [show, setShow] = useState(false);
	const [dashboardPrincipals, setDashboardPrincipals] = useState([]);
	const [principals, setPrincipals] = useState([]);
	const [principalNames, setPrincipalNames] = useState([]);
	const [selectedPrincipalId, setSelectedPrincipalId] = useState(null);
	const [isSuccess, setSuccess] = useState(false);
	const [message, setMessage] = useState(false);

	useEffect(() => {
		getPrincipals();
	}, []);

	const handleShow = () => {
		setShow(!show);
		addPrincipal();
	};

	const addPrincipal = async () => {
		setDashboardPrincipals([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(BASE_URL + "/dashboard/principals");
		if (res) {
			setDashboardPrincipals(res);
		}
	};

	const getPrincipals = async () => {
		setPrincipals([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(
			BASE_URL + "/dashboard/myorg/associations/principals/" + partnerId
		);
		if (res) {
			console.log(res);
			const uniquePrincipals = _.uniqBy(res, "principalId");
			setPrincipals(uniquePrincipals);
			setPrincipalNames(uniquePrincipals.map(e => e.principalName));
		}
	};

	const addPrincipalCard = async () => {
		if (selectedPrincipalId) {
			const user = localStorage.getItem("user-details");
			const partnerId = JSON.parse(user).partnerId;
			const res = await fetchJSON(BASE_URL + "/dashboard/myorg/associations", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					associationPrincipalId: Number(selectedPrincipalId),
					associationPartnerId: partnerId,
				}),
			});
			if (res) {
				getPrincipals();
				setSelectedPrincipalId(null);
				setShow(!show);
				setSuccess(true);
				setMessage("Added Successfully");
			}
		}
	};

	return (
		<>
			<div className="row card-box">
				<div className="col-lg-5">
					<MixedWidget2
						className="card-stretch gutter-b"
						principals={principals}
					/>
				</div>
				<div className="col-lg-6"></div>
				<div className="col-lg-1">
					<Button
						type="submit"
						onClick={handleShow}
						className="btn btn-primary font-weight-bolder"
					>
						Add +
					</Button>
				</div>
			</div>

			{/* MODAL STARTS HERE*/}

			<Modal size="lg" show={show} onHide={handleShow}>
				<Modal.Header closeButton>
					<Modal.Title>Select Vendor</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Control
								as="select"
								onChange={e => setSelectedPrincipalId(e.target.value)}
								value={selectedPrincipalId}
							>
								<option selected="true" disabled="disabled" value={""}></option>
								{dashboardPrincipals &&
									dashboardPrincipals
										.filter(
											item => !principalNames.includes(item.principalName)
										)
										.map(item => {
											return (
												<option value={item.id}>{item.principalName}</option>
											);
										})}
							</Form.Control>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="danger"
						onClick={handleShow}
						className="btn btn-light-danger font-weight-bolder mr-5"
					>
						Close
					</Button>
					<Button
						variant="primary"
						onClick={addPrincipalCard}
						className="btn btn-light-primary font-weight-bolder"
					>
						Add
					</Button>
				</Modal.Footer>
			</Modal>

			{/* MODAL ENDS HERE*/}
			<SnackbarComp
				open={isSuccess}
				message={message}
				onClose={e => setSuccess(false)}
			></SnackbarComp>
		</>
	);
}

export default PrincipalPage;
