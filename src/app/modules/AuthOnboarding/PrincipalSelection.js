import React, { useState, useEffect } from "react";

import { Tab, Tabs, Form, Button, Table, Card } from "react-bootstrap";

import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";
import _ from "lodash";

function PrincipalSelection(props) {
	const [principalList, setPrincipalList] = useState([]);
	const [principals, setPrincipals] = useState([]);

	const [selectedPrincipalId, setSelectedPrincipalId] = useState(null);

	const [showValue, setShowValue] = useState([]);
	const [searchFilter, setSearchFilter] = useState("");

	const [tableData, setTableData] = useState([]);

	const getPrincipalsList = async e => {
		setPrincipalList([]);
		setSelectedPrincipalId(e);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(
			BASE_URL + "/dashboard/programs/principal/" + e
		);
		if (res) {
			console.log(res);
			setPrincipalList(res);
			setTableData(res);
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
		}
	};

	useEffect(() => {
		getPrincipals();
	}, []);

	const handleClick = (value, item = {}) => {
		console.log(value);
		setShowValue(value);
	};

	const setSearch = e => {
		setSearchFilter();
		if (e === "") {
			setTableData(principalList);
		} else {
			//This needs to more accurate
			let filteredData = principalList.filter(ele =>
				JSON.stringify(ele)
					.toLowerCase()
					.includes(e.toLowerCase())
			);
			setTableData(filteredData);
		}
	};

	return (
		<div className="boarding-form">
			<div className="card card-box-container card-custom gutter-b">
				<div className="card-body">
					<h3>Vendor Selection</h3>
					<label className="mt-3">Please select a vendor to continue.</label>
					<div className="mt-8">
						<Tabs
							activeKey="home"
							id="noanim-tab-example"
							className="nav nav-pills nav-fill nav-justified"
						>
							<Tab
								eventKey="home"
								title="To get started please create an Association"
							>
								<Form className="mt-8">
									<div className="row">
										<div className="col-lg-4">
											<h6 className="mb-3">SELECTED ASSOCIATIONS - </h6>
											<Card border="info">
												<Card.Header
													style={{ background: "#6f42c1", color: "white" }}
												>
													<h6>
														{showValue.programPrincipalId === 11
															? "AWS"
															: showValue.programPrincipalId === 12
															? "Google Cloud"
															: showValue.programPrincipalId === 13
															? "Microsoft Azure"
															: ""}
													</h6>
												</Card.Header>

												<Card.Body>{showValue.programName}</Card.Body>
											</Card>
											<div className="text-center mt-11">
												<Button className="btn btn-block btn-info">
													Create Association
												</Button>
											</div>
										</div>
										<div className="col-lg-8">
											<Card border="info">
												<Card.Header>
													<Form.Control
														as="select"
														name="vendor"
														onChange={e => getPrincipalsList(e.target.value)}
														value={selectedPrincipalId}
													>
														<option selected="true" disabled="disabled">
															Select Vendor
														</option>
														{principals.map(e => (
															<option value={e.principalId}>
																{e.principalName}
															</option>
														))}
													</Form.Control>

													<Form.Control
														className="mt-4"
														type="text"
														value={searchFilter}
														onChange={e => setSearch(e.target.value)}
														placeholder="Search Programs..."
													></Form.Control>
												</Card.Header>
												<Card.Body>
													<Table>
														<div className="table-container">
															{tableData &&
																tableData.map(item => {
																	return (
																		<tr>
																			<td>
																				<div className="row">
																					<div className="col-lg-1 mt-3">
																						<i className="fa text-info fa-info-circle mr-3"></i>
																					</div>
																					<div className="col-lg-9 mb-4">
																						{item.programName}
																					</div>
																					<div className="col-lg-2">
																						<Button
																							size="sm"
																							className="btn btn-light-info"
																							onClick={() => handleClick(item)}
																						>
																							Select
																						</Button>
																					</div>
																				</div>
																			</td>
																		</tr>
																	);
																})}
														</div>
													</Table>
												</Card.Body>
											</Card>
										</div>
									</div>
								</Form>
							</Tab>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PrincipalSelection;
