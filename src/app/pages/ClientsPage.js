import React, { useEffect, useState } from "react";
import { Table, Form, Modal, Popover, OverlayTrigger } from "react-bootstrap";
import {
	Card,
	CardBody,
	CardHeader,
	CardHeaderToolbar,
} from "./../../_metronic/_partials/controls";
import { Button } from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";

import { fetchJSON } from "../../_metronic/_helpers/api";
import { BASE_URL } from "../../_metronic/_constants/endpoints";
import _, { isArray } from "lodash";
import { CSVLink } from "react-csv";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import SnackbarComp from "../Components/SnackbarComp";
import { datePipe } from "../../_metronic/_helpers/date-pipe";
import SkeletonComp from "../Components/SkeletonComp";
import Skeleton from "@material-ui/lab/Skeleton";
import { useSnapshot } from "valtio";
import { valtioState } from "../App";

export function ClientsPage(props) {
	const [type, setType] = useState("text");

	const [show, setShow] = useState(false);
	const [isEdit, setIsEdit] = useState(false);

	const [cardData, setCardData] = useState([]);

	const [vertical, setVertical] = useState([]);

	const [regions, setRegions] = useState([]);

	const [formData, setFormData] = useState({});

	const [technology, setTechnology] = useState([]);

	const [principals, setPrincipals] = useState([]);

	const [productValue, setProductValue] = useState();

	const [serviceValue, setServiceValue] = useState();

	const [otherValue, setOtherValue] = useState();

	const [activeClient, setActiveClient] = useState();

	const [isSuccess, setSuccess] = useState(false);
	const [message, setMessage] = useState(false);

	// STATES FOR FILTERS

	const [verticalsFilter, setVerticalsFilter] = useState("");

	const [regionsFilter, setRegionsFilters] = useState("");

	const [principalFilters, setPrincipalFilters] = useState("all");

	const [statusFilter, setStatusFilter] = useState("");

	const [dateFilter, setDateFilter] = useState("");

	const [searchFilter, setSearchFilter] = useState("");

	const [resetFilter, setResetFilter] = useState("");

	const [csvData, setCSVData] = useState([]);
	const [loader, setLoader] = useState(false);

	useEffect(() => {
		setLoader(true);
		getRegionsList();
		getVerticalList();
		getTechnologyList();
		getPrincipals();
		getClientsCards();
	}, []);

	useEffect(() => {
		if (resetFilter === "true") {
			getClientsCards();
			setResetFilter("false");
		}
	}, [resetFilter]);

	useEffect(() => {
		if (vertical.length && regions.length) {
			getClientsCards();
		}
	}, [vertical, regions]);

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

	const getVerticalList = async () => {
		setVertical([]);
		console.log("hi");
		const res = await fetchJSON(BASE_URL + "/verticals");
		if (res) {
			console.log(res);
			setVertical(res);
		}
	};

	const getRegionsList = async () => {
		setRegions([]);
		console.log("hi");
		const res = await fetchJSON(BASE_URL + "/dashboard/regions");
		if (res) {
			setRegions(res);
		}
	};

	const getTechnologyList = async () => {
		setTechnology([]);
		console.log("hi");
		const res = await fetchJSON(BASE_URL + "/technologies");
		if (res) {
			console.log(res);
			setTechnology(res);
		}
	};

	const getClientsCards = async () => {
		setLoader(true);
		setCardData([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		let params =
			principalFilters !== "" ? "?principal=" + principalFilters : "";
		params +=
			verticalsFilter !== "" ? "&industryVertical=" + verticalsFilter : "";
		params += regionsFilter !== "" ? "&region=" + regionsFilter : "";
		params += statusFilter !== "" ? "&isOngoing=" + statusFilter : "";
		params += dateFilter ? "&startDate=" + dateFilter : "";
		params += searchFilter ? "&clientName=" + searchFilter : "";
		const res = await fetchJSON(
			BASE_URL +
				"/dashboard/clients/partner/" +
				partnerId +
				"/" +
				principalFilters +
				params
		);
		if (res !== "Error!") {
			setCardData(res);
			const csvData = [];
			res.map((item, i) => {
				let serviceDeployed = "";
				item.servicesDeployedManaged &&
					item.servicesDeployedManaged.length &&
					item.servicesDeployedManaged.map((ele, i) => {
						serviceDeployed += ele.text
							? ele.text +
							  (item.servicesDeployedManaged.length != i + 1 ? "-" : "")
							: "";
					});
				csvData.push({
					"SL No.": i + 1,
					Name: item.clientName,
					Vertical: findVerticalName(item.industryVertical),
					"Revenue From Product": item.revenuePrincipal,
					"Revenue From Service": item.revenueServices,
					"Other Revenues": item.monthlyRevenueOthers,
					"Start Date": item.startDate,
					Region: findRegionName(item.region),
					Pincode: item.clientPincode,
					"Service Deployed": serviceDeployed,
					Status: item.isOngoing ? "Active" : "Inactive",
				});
			});

			setCSVData(csvData);

			let tempProduct = 0;
			let tempService = 0;
			let tempOther = 0;
			let tempClients = 0;

			for (let i = 0; i < res.length; i++) {
				tempProduct = tempProduct + res[i].revenuePrincipal;
				tempService = tempService + res[i].revenueServices;
				tempOther = tempOther + res[i].monthlyRevenueOthers;
				tempClients = tempClients + res[i].isOngoing;
			}

			setProductValue(tempProduct);
			setServiceValue(tempService);
			setOtherValue(tempOther);
			setActiveClient(tempClients);
			setLoader(false);
		}
	};

	const findVerticalName = item => {
		const data = vertical.find(ele => ele.id === item);
		return data ? data.verticalName : "-";
	};

	const findRegionName = item => {
		const region = regions.find(ele => ele.id === item);
		return region ? region.regionName : "-";
	};

	const handleShow = () => {
		setShow(!show);
	};

	const addClients = async () => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;

		const objToSend = {
			isOngoing: formData.active,
			clientName: formData.name,
			industryVertical: {
				id: formData.verticalId,
				verticalName: formData.vertical,
			},
			region: formData.nameRegion,
			revenuePrincipal: formData.monthlyProduct,
			revenueServices: formData.monthlyService,
			monthlyRevenueOthers: formData.otherRevenues,
			startDate: formData.Date,
			clientAddress: formData.address,
			clientPincode: formData.pincode,
			servicesDeployedManaged: formData.technology
				? [
						...formData.technology.map(item => {
							return {
								id: technology[0].technologyName.indexOf(item),
								text: item,
							};
						}),
				  ]
				: [],
			partnerId: partnerId,
			principalId: Number(formData.principal),
		};
		const res = await fetchJSON(BASE_URL + "/dashboard/clients", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(objToSend),
		});
		if (res) {
			getClientsCards();
			setShow(!show);
			setSuccess(true);
			setMessage("Added Successfully");
		}
	};

	const updateClients = async () => {
		const user = localStorage.getItem("user-details");
		const userId = JSON.parse(user).id;
		console.log(formData.verticalId);
		console.log(vertical);
		console.log(vertical.find(ele => ele.id == formData.verticalId));
		const objToSend = {
			id: formData.id,
			isOngoing: formData.active,
			clientName: formData.name,
			industryVertical: vertical.find(ele => ele.id == formData.verticalId),
			region: formData.nameRegion,
			startDate: formData.Date,
			revenuePrincipal: formData.monthlyProduct,
			revenueServices: formData.monthlyService,
			monthlyRevenueOthers: formData.otherRevenues,
			servicesDeployedManaged: formData.technology
				? [
						...formData.technology.map(item => {
							return {
								id: technology[0].technologyName.indexOf(item),
								text: item,
							};
						}),
				  ]
				: [],
			clientAddress: formData.address,
			clientPincode: formData.pincode,
			salesRef: formData.ref,
			partnerId: formData.partnerId,
			principalId: Number(formData.principal),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		const res = await fetchJSON(BASE_URL + "/dashboard/clients", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(objToSend),
		});
		if (res) {
			getClientsCards();
			setShow(!show);
			setSuccess(true);
			setMessage("Updated Successfully");
		}
	};

	const handleRowClick = item => {
		console.log(item);
		setIsEdit(true);
		setFormData({
			id: item.id,
			active: item.isOngoing,
			name: item.clientName,
			industryVertical: {
				vertical: item.verticalName,
			},
			verticalId: item.industryVertical,
			nameRegion: item.region,
			monthlyProduct: item.revenuePrincipal,
			monthlyService: item.revenueServices,
			otherRevenues: item.monthlyRevenueOthers,
			Date: item.startDate,
			address: item.clientAddress,
			technology: item.servicesDeployedManaged
				? [
						...item.servicesDeployedManaged.map(ele => {
							return ele.text;
						}),
				  ]
				: [],
			pincode: item.clientPincode,
			partnerId: item.partnerId,
			principal: item.principalId,
			ref: item.salesRef,
		});
		setShow(true);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (isEdit) {
			updateClients();
		} else {
			addClients();
		}
	};

	const applyFilter = () => {
		getClientsCards();
	};

	const resetButtonClick = () => {
		setVerticalsFilter("");
		setRegionsFilters("");
		setPrincipalFilters("all");
		setStatusFilter("");
		setDateFilter("");
		setSearchFilter("");
		setResetFilter("true");
	};

	const snap = useSnapshot(valtioState);

	return (
		<>
			<Card className="card-box expand-card">
				<CardHeader title="Clients">
					<CardHeaderToolbar>
						{snap.navRoles?.clients?.add ? (
							<Button
								type="submit"
								className="btn btn-light-primary font-weight-bolder"
								disabled={loader}
								onClick={e => {
									setIsEdit(false);
									setFormData({});
									handleShow(e);
								}}
							>
								Add +
							</Button>
						) : null}
						<CSVLink
							className="btn btn-light-warning csv-btn ml-3 font-weight-bolder"
							filename={"clients.csv"}
							data={csvData}
						>
							Export to CSV
						</CSVLink>
					</CardHeaderToolbar>
				</CardHeader>
				<div className="card-spacer bg-white">
					<div className="row">
						<div className="col-lg-3">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Control
										as="select"
										value={principalFilters}
										onChange={e => setPrincipalFilters(e.target.value)}
									>
										<option selected="true" value="" className="default-option">
											Select Vendor
										</option>
										<option value="all">All</option>
										{principals &&
											principals.map(item => {
												return (
													<option value={item.principalId}>
														{item.principalName}
													</option>
												);
											})}
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-3">
							<Form.Group controlId="validationCustom02">
								<Form.Control
									required
									type="text"
									value={searchFilter}
									placeholder="Name"
									onChange={e => setSearchFilter(e.target.value)}
								/>
							</Form.Group>
						</div>
						<div className="col-lg-3">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Control
										as="select"
										value={verticalsFilter}
										onChange={e => setVerticalsFilter(e.target.value)}
									>
										<option selected="true" value="" className="default-option">
											Select a Vertical
										</option>
										{vertical &&
											vertical.map(item => {
												return (
													<option value={item.id}>{item.verticalName}</option>
												);
											})}
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-3">
							<Form>
								<Form.Group controlId="validationCustom02">
									<Form.Control
										required
										type={type}
										onFocus={() => setType("date")}
										onBlur={() => setType("text")}
										placeholder="Start Date"
										value={dateFilter}
										onChange={e => {
											setDateFilter(e.target.value);
										}}
									/>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-3">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Control
										as="select"
										value={statusFilter}
										onChange={e => setStatusFilter(e.target.value)}
									>
										<option selected="true" value="" className="default-option">
											Select Status
										</option>
										<option value={"true"}>Active</option>
										<option value={"false"}>Inactive</option>
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-3">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Control
										as="select"
										value={regionsFilter}
										onChange={e => setRegionsFilters(e.target.value)}
									>
										<option selected="true" value="" className="default-option">
											Select a Region
										</option>
										{regions &&
											regions.map(region => {
												return (
													<option value={region.id}>{region.regionName}</option>
												);
											})}
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
						{/* <div className="col-lg-4"></div> */}
						<div className="mt-1">
							<Button
								type="submit"
								className="btn btn-light-info font-weight-bolder"
								onClick={applyFilter}
							>
								Apply
							</Button>
							<Button
								type="submit"
								className="btn btn-light-danger font-weight-bolder ml-2"
								onClick={resetButtonClick}
							>
								Reset
							</Button>
						</div>
					</div>
					<div className="row mt-2">
						{/* <div className="row"> */}
						<div
							className="col-lg-2 bg-light-primary px-6 rounded-xl mr-7 mb-7"
							// style={{ height: "100px" }}
						>
							<div className="mt-8">
								<h5 className="text-primary text-center font-size-5">
									{loader ? 0 : activeClient}
								</h5>
								<div className="text-center mt-3">
									<label className="text-primary">Active Clients</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-success px-6 rounded-xl mr-7 mb-7"
							// style={{ height: "100px" }}
						>
							<div className="mt-8">
								<h5 className="text-success text-center font-size-5">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{loader ? 0 : productValue && productValue.toLocaleString()}
								</h5>
								<label className="text-center text-success ml-2 mb-5">
									Projected Monthly Revenue - Product
								</label>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-info px-6 rounded-xl mr-7 mb-7"
							// style={{ height: "100px" }}
						>
							<div className="mt-8">
								<h5 className="text-info text-center font-size-5">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{loader ? 0 : serviceValue && serviceValue.toLocaleString()}
								</h5>
								<div className="text-center">
									<label className="text-info ml-2">
										Projected Monthly Revenue - Service
									</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-warning px-6 rounded-xl mr-7 mb-7"
							// style={{ height: "100px" }}
						>
							<div className="mt-8">
								<h5 className="text-warning text-center font-size-">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{loader ? 0 : otherValue && otherValue.toLocaleString()}
								</h5>
								<div className="text-center">
									<label className="text-warning ml-2">
										Projected Monthly Revenue - Others
									</label>
								</div>
							</div>
						</div>
					</div>
					{/* </div> */}
				</div>

				<CardBody>
					<div className="table-container">
						<Table>
							<div className="table-body">
								<thead>
									<tr>
										<th className="table-text" style={{ minWidth: 120 }}>
											Name{" "}
										</th>
										<th className="table-text" width="200">
											Vertical
										</th>
										<th
											className="table-text"
											data-toggle="tooltip"
											data-placement="top"
											title="Revenue From Product"
											style={{ minWidth: 130 }}
										>
											Vendors (
											{JSON.parse(localStorage.getItem("user-details"))?.Partner
												?.Currency?.currencyCode === "USD" ? (
												"$"
											) : (
												<span className="rupee-symbol">₹</span>
											)}
											)
										</th>
										<th
											className="table-text"
											data-toggle="tooltip"
											data-placement="top"
											title="Revenue From Services"
											style={{ minWidth: 130 }}
										>
											Services ({" "}
											{JSON.parse(localStorage.getItem("user-details"))?.Partner
												?.Currency?.currencyCode === "USD" ? (
												"$"
											) : (
												<span className="rupee-symbol">₹</span>
											)}
											)
										</th>
										<th
											className="table-text"
											data-toggle="tooltip"
											data-placement="top"
											title="Other Revenues"
										>
											Others ({" "}
											{JSON.parse(localStorage.getItem("user-details"))?.Partner
												?.Currency?.currencyCode === "USD" ? (
												"$"
											) : (
												<span className="rupee-symbol">₹</span>
											)}
											)
										</th>
										<th className="table-text">Start Date</th>
										<th className="table-text" style={{ minWidth: 50 }}>
											Region
										</th>
									</tr>
								</thead>
								<tbody>
									{loader ? (
										<SkeletonComp rows={8} columns={7}></SkeletonComp>
									) : (
										<React.Fragment>
											{cardData.length > 0 ? (
												cardData.map(item => {
													return (
														<tr
															style={{
																cursor: "pointer",
																background: item.active ? "#fff" : "#f2f2f2",
															}}
															onClick={e => handleRowClick(item)}
														>
															<td style={{ paddingRight: 16 }}>
																<span
																	style={{
																		display: "inline-block",
																		width: "90%",
																	}}
																>
																	{item.clientName}
																</span>
																<span
																	style={{
																		display: "inline-block",
																		width: "10%",
																		verticalAlign: "inherit",
																	}}
																>
																	<OverlayTrigger
																		trigger="hover"
																		placement="right"
																		overlay={
																			<Popover
																				style={{ padding: 16 }}
																				id="popover-basic"
																				title="Popover right"
																			>
																				<strong>Services Deployed</strong>
																				<hr></hr>
																				{item.servicesDeployedManaged !==
																					null &&
																				isArray(item.servicesDeployedManaged)
																					? item.servicesDeployedManaged.map(
																							ele => {
																								return (
																									<span>
																										<span>{ele.text}</span>
																										<br></br>
																									</span>
																								);
																							}
																					  )
																					: "NA"}
																			</Popover>
																		}
																	>
																		<i
																			className="fa fa-question-circle mr-5"
																			style={{ fontSize: 12, paddingLeft: 8 }}
																		></i>
																	</OverlayTrigger>
																</span>
															</td>
															<td>
																{vertical &&
																	vertical.map(ele => {
																		if (ele.id == item.industryVertical) {
																			return ele.verticalName;
																		}
																	})}{" "}
															</td>
															<td>
																{item.revenuePrincipal &&
																	item.revenuePrincipal.toLocaleString()}
															</td>
															<td>
																{item.revenueServices &&
																	item.revenueServices.toLocaleString()}
															</td>
															<td>
																{item.monthlyRevenueOthers &&
																	item.monthlyRevenueOthers.toLocaleString()}
															</td>
															<td>{datePipe(item.startDate)}</td>
															<td>
																{regions &&
																	regions.map(ele => {
																		if (ele.id == item.region) {
																			return ele.regionName;
																		}
																	})}{" "}
															</td>
														</tr>
													);
												})
											) : (
												<td className="text-center mt-3">No Records found</td>
											)}
										</React.Fragment>
									)}
								</tbody>
							</div>
						</Table>
					</div>
				</CardBody>
			</Card>

			{/* MODAL STARTS HERE*/}

			<Modal size="lg" show={show} onHide={handleShow}>
				<Form onSubmit={e => handleSubmit(e)}>
					<Modal.Header closeButton>
						<Modal.Title>Client</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Client Name *</Form.Label>
							<Form.Control
								name="name"
								type="text"
								required
								onChange={e =>
									setFormData({ ...formData, name: e.target.value })
								}
								value={formData.name}
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Vendor *</Form.Label>
							<Form.Control
								as="select"
								name="principal"
								required
								onChange={e =>
									setFormData({ ...formData, principal: e.target.value })
								}
								value={formData.principal}
							>
								<option selected="true" disabled="disabled">
									Select Vendor
								</option>
								{principals.map(e => (
									<option value={e.principalId}>{e.principalName}</option>
								))}
							</Form.Control>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Select Vertical *</Form.Label>
							<Form.Control
								as="select"
								name="vertical"
								required
								value={formData.verticalId}
								onChange={e =>
									setFormData({
										...formData,
										verticalId: e.target.value,
									})
								}
							>
								<option selected="true" disabled="disabled">
									Select Vertical
								</option>
								{vertical &&
									vertical.map(item => {
										return <option value={item.id}>{item.verticalName}</option>;
									})}
							</Form.Control>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Country / Region(s) *</Form.Label>
							<Form.Control
								as="select"
								required
								value={formData.nameRegion}
								name="nameRegion"
								onChange={e =>
									setFormData({ ...formData, nameRegion: e.target.value })
								}
							>
								<option selected="true" disabled="disabled">
									Select Region
								</option>
								{regions &&
									regions.map(region => {
										return (
											<option value={region.id}>{region.regionName}</option>
										);
									})}
							</Form.Control>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>
								Revenue From Product (Monthly, in{" "}
								{JSON.parse(localStorage.getItem("user-details"))?.Partner
									?.Currency?.currencyCode === "USD" ? (
									"$"
								) : (
									<span className="rupee-symbol">₹</span>
								)}
								) *
							</Form.Label>

							<Form.Control
								type="number"
								required
								onChange={e =>
									setFormData({ ...formData, monthlyProduct: e.target.value })
								}
								value={formData.monthlyProduct}
								name="monthlyProduct"
								placeholder=""
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>
								Revenue From Service (Monthly, in{" "}
								{JSON.parse(localStorage.getItem("user-details"))?.Partner
									?.Currency?.currencyCode === "USD" ? (
									"$"
								) : (
									<span className="rupee-symbol">₹</span>
								)}
								) *
							</Form.Label>

							<Form.Control
								type="number"
								required
								onChange={e =>
									setFormData({ ...formData, monthlyService: e.target.value })
								}
								value={formData.monthlyService}
								name="monthlyService"
								placeholder=""
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>
								Other Revenues (Monthly, in{" "}
								{JSON.parse(localStorage.getItem("user-details"))?.Partner
									?.Currency?.currencyCode === "USD" ? (
									"$"
								) : (
									<span className="rupee-symbol">₹</span>
								)}
								) *
							</Form.Label>

							<Form.Control
								type="number"
								required
								value={formData.otherRevenues}
								name="otherRevenues"
								onChange={e =>
									setFormData({ ...formData, otherRevenues: e.target.value })
								}
							/>
						</Form.Group>

						<Form.Group controlId="validationCustom02">
							<Form.Label>Start Date *</Form.Label>

							<Form.Control
								required
								value={formData.Date}
								onChange={e =>
									setFormData({ ...formData, Date: e.target.value })
								}
								type="date"
								name="Date"
								placeholder="Start Date"
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlTextarea1">
							<Form.Label>Address</Form.Label>
							<Form.Control
								as="textarea"
								onChange={e =>
									setFormData({ ...formData, address: e.target.value })
								}
								value={formData.address}
								name="address"
								rows="3"
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlTextarea1">
							<Form.Label>PIN/Zip Code</Form.Label>
							<Form.Control
								type="number"
								onChange={e =>
									setFormData({ ...formData, pincode: e.target.value })
								}
								value={formData.pincode}
								name="pincode"
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Service Deployed *</Form.Label>
							<Autocomplete
								multiple
								name="technology"
								options={technology[0]?.technologyName}
								getOptionLabel={option => option}
								onChange={(e, value) =>
									setFormData({ ...formData, technology: value })
								}
								defaultValue={formData.technology}
								renderInput={params => (
									<TextField
										{...params}
										variant="outlined"
										placeholder="Sectoral Focus"
									/>
								)}
							/>
						</Form.Group>

						{/* RADIO BUTTON STARTS */}
						<Form.Label className="mt-8">Active</Form.Label>
						{/* 1 */}
						<div key={`default-1`} className="mb-3">
							<Form.Group controlId="exampleForm.ControlInput1">
								<Form.Check
									inline
									type={"radio"}
									label={`Yes`}
									name="active"
									onChange={e => setFormData({ ...formData, active: true })}
									checked={formData.active}
								/>

								<Form.Check
									inline
									// disabled
									type={"radio"}
									label={`No`}
									name="active"
									onChange={e => setFormData({ ...formData, active: false })}
									checked={formData.active === false}
								/>
							</Form.Group>
						</div>

						{/* RADIO BUTTON ENDS */}
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="danger"
							onClick={e => handleShow()}
							className="btn btn-light-danger font-weight-bolder mr-3"
						>
							Close
						</Button>

						<Button
							variant="primary"
							type="submit"
							className="btn btn-light-primary font-weight-bolder"
						>
							{isEdit ? "Update" : "Add"}
						</Button>
					</Modal.Footer>
				</Form>
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
