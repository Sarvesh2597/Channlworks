import React, { useState, useEffect, useRef } from "react";
import { Table, Form, Modal, Popover, OverlayTrigger } from "react-bootstrap";
import { Button } from "@material-ui/core";
import { fetchJSON } from "../../_metronic/_helpers/api";
import { BASE_URL, UPLOADS_URL } from "../../_metronic/_constants/endpoints";
import _, { isArray } from "lodash";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import SnackbarComp from "../Components/SnackbarComp";
import { datePipe } from "../../_metronic/_helpers/date-pipe";
import SkeletonComp from "../Components/SkeletonComp";
import { useReactToPrint } from "react-to-print";
import { useSnapshot } from "valtio";
import { valtioState } from "../App";
import { toAbsoluteUrl } from "../../_metronic/_helpers";
import SVG from "react-inlinesvg";

function CaseStudies(props) {
	const componentRef = useRef();
	const [show, setShow] = useState(false);
	const [caseStudy, setCaseStudy] = useState([]);
	const [clients, setClients] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [builtFor, setBuiltFor] = useState([]);
	const [formData, setFormData] = useState({});
	const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

	const [principalFilters, setPrincipalFilters] = useState("all");
	const [tableData, setTableData] = useState([]);
	const [principals, setPrincipals] = useState([]);
	const [searchFilter, setSearchFilter] = useState("");
	const [technology, setTechnology] = useState([]);
	const [files, setFiles] = useState(null);
	const [isEdit, setEdit] = useState(false);
	const [isSuccess, setSuccess] = useState(false);
	const [message, setMessage] = useState(false);

	const [modal, setModal] = useState(false);
	const [modalBody, setModalBody] = useState({});

	const [caseTitleMessage, setCaseTitleMessage] = useState("");
	const [principalMsg, setPrincipalMsg] = useState("");
	const [clientMsg, setClientMsg] = useState("");
	const [technologyMsg, setTechnologyMsg] = useState("");
	const [buildForMsg, setBuildForMsg] = useState("");
	const [technicalSummaryMsg, setTechnicalSummaryMsg] = useState("");
	const [loader, setLoader] = useState(false);

	const showModal = (e, item = {}) => {
		setModalBody(item);
		setModal(!modal);
	};

	useEffect(() => {
		getPrincipals();
		getClientsList("all");
		getCaseStudyList();
		getTechnologyList();
		getEmployeesList();
	}, []);

	useEffect(() => {
		if (builtFor.length && selectedCaseStudy && isEdit) {
			const programsTagList = [];
			selectedCaseStudy.programIds &&
				selectedCaseStudy.programIds.split(",").map(item => {
					if (builtFor.find(ele => ele.programId === parseInt(item, 10))) {
						programsTagList.push(
							builtFor.find(ele => ele.programId === parseInt(item, 10))
								.programName
						);
					}
				});
			setFormData({
				architecture: selectedCaseStudy.architecture,
				createdAt: selectedCaseStudy.createdAt,
				id: selectedCaseStudy.id,
				partnerId: selectedCaseStudy.partnerId,
				caseIsPublic: selectedCaseStudy.caseIsPublic,
				caseTitle: selectedCaseStudy.caseTitle,
				technicalSummary: selectedCaseStudy.technicalSummary,
				updatedAt: selectedCaseStudy.updatedAt,
				principalId: parseInt(selectedCaseStudy.principalId, 10),
				clientId: selectedCaseStudy.clientId,
				employeesTags: selectedCaseStudy.employeesTags
					? [
							...selectedCaseStudy.employeesTags.map(item => {
								return item.text;
							}),
					  ]
					: [],
				technologyTags: selectedCaseStudy.technologyTags
					? [
							...selectedCaseStudy.technologyTags.map(item => {
								return item.text;
							}),
					  ]
					: [],
				programsTags: programsTagList,
			});
			setSelectedCaseStudy(null);
			setShow(true);
		}
	}, [builtFor, isEdit, selectedCaseStudy]);

	const getCaseStudyList = async () => {
		setLoader(true);
		setCaseStudy([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		let params = principalFilters ? "/" + principalFilters : "";
		try {
			const res = await fetchJSON(
				BASE_URL + "/dashboard/cases/partner/" + partnerId + params
			);
			if (res !== "Error!") {
				setCaseStudy(res);
				setTableData(res);

				setLoader(false);
			}
		} catch (error) {}
	};

	const getTechnologyList = async () => {
		setTechnology([]);
		try {
			const res = await fetchJSON(BASE_URL + "/technologies");
			if (res) {
				setTechnology(res);
			}
		} catch (error) {}
	};

	const getPrincipals = async () => {
		setPrincipals([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		try {
			const res = await fetchJSON(
				BASE_URL + "/dashboard/myorg/associations/principals/" + partnerId
			);
			if (res) {
				const uniquePrincipals = _.uniqBy(res, "principalId");
				setPrincipals(uniquePrincipals);
			}
		} catch (error) {}
	};

	const getClientsList = async principalId => {
		setClients([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;

		try {
			const res = await fetchJSON(
				BASE_URL + "/dashboard/clients/partner/" + partnerId + "/" + principalId
			);
			if (res !== "Error!") {
				setClients(res);
			}
		} catch (error) {}
	};

	const getBuiltFor = async principalId => {
		setBuiltFor([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;

		try {
			const res = await fetchJSON(
				BASE_URL +
					"/dashboard/myorg/associations/programs/" +
					partnerId +
					"?principal=" +
					principalId
			);
			if (res !== "Error!") {
				setBuiltFor(res);
			}
		} catch (error) {}
	};

	const getEmployeesList = async () => {
		setEmployees([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;

		try {
			const res = await fetchJSON(
				BASE_URL + "/dashboard/employees/partner/" + partnerId + "/all"
			);
			if (res) {
				setEmployees(res);
			}
		} catch (error) {}
	};

	const handleShow = async () => {
		clearErrors();
		setShow(!show);
		setEdit(false);
		console.log(principals);
		await getClientsList("all");
		await getEmployeesList();
		await getBuiltFor(principals[0].principalId);
		setSelectedCaseStudy({});
		// setBuiltFor([]);
		setFormData({});
		setFiles(null);
	};

	useEffect(() => {
		if (searchFilter || principalFilters) {
			getCaseStudyList();
		}
	}, [searchFilter, principalFilters]);

	const setSearch = e => {
		setSearchFilter();
		if (e === "") {
			setTableData(caseStudy);
		} else {
			//This needs to more accurate
			let filteredData = caseStudy.filter(ele =>
				JSON.stringify(ele)
					.toLowerCase()
					.includes(e.toLowerCase())
			);
			setTableData(filteredData);
		}
	};

	const setUpFiles = async e => {
		setFiles([]);
		const formData = new FormData();
		for (let i = 0; i < e.target.files.length; i++) {
			formData.append("documents", e.target.files[i]);
		}
		setFiles(formData);
	};

	const updateCaseStudy = async e => {
		e.preventDefault();
		let filesResponse = null;
		if (files) {
			const resp = await fetchJSON(BASE_URL + "/multipleFiles", {
				headers: {},
				method: "POST",
				body: files,
			});

			if (resp) {
				filesResponse = resp;
			}
		}

		const user = JSON.parse(localStorage.getItem("user-details"));
		const programIds = [];

		const errorOccurs = checkFormError();

		if (!errorOccurs) {
			formData.programsTags &&
				formData.programsTags.map(item => {
					programIds.push(
						builtFor.find(ele => ele.programName === item).programId
					);
				});
			const emp = employees;
			formData.employeesTags &&
				formData.employeesTags.map(item => {
					return {
						id: emp.find(ele => ele.employeeName === item.split("-").join(" "))
							.id,
						text: item,
					};
				});
			const objToSend = {
				architecture: filesResponse
					? [
							...formData.architecture,
							...filesResponse.data.map(data => UPLOADS_URL + data.name),
					  ]
					: formData.architecture,
				createdAt: formData.createdAt,
				id: formData.id,
				partnerId: formData.partnerId,
				technicalSummary: formData.technicalSummary,
				updatedAt: formData.updatedAt,
				caseIsPublic: formData.caseIsPublic,
				caseTitle: formData.caseTitle,
				principalId: parseInt(formData.principalId, 10),
				employeesTags: formData.employeesTags
					? [
							...formData.employeesTags.map(item => {
								return {
									id: emp.find(
										ele => ele.employeeName === item.split("-").join(" ")
									).id,
									text: item,
								};
							}),
					  ]
					: [],
				programsTags: formData.programsTags
					? [
							...formData.programsTags.map(item => {
								return {
									id: builtFor.find(ele => ele.programName === item).programId,
									text: item,
								};
							}),
					  ]
					: [],
				technologyTags: formData.technologyTags
					? [
							...formData.technologyTags.map(item => {
								return {
									id: technology[0].technologyName.indexOf(item),
									text: item,
								};
							}),
					  ]
					: [],
				clientId: parseInt(formData.clientId, 10),
				technicalSummary: formData.technicalSummary,
				partnerId: user.partnerId,
				associationId: user.associationId,
				programIds: programIds.toString(),
			};
			const res = await fetchJSON(BASE_URL + "/dashboard/cases", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(objToSend),
			});
			if (res) {
				getClientsList("all");
				handleShow();
				setSuccess(true);
				setMessage("Case Updated Successfully");
				getCaseStudyList();
			}
		}
	};

	const addCaseStudy = async e => {
		e.preventDefault();
		let filesResponse = null;
		const token = localStorage.getItem("token");
		if (files) {
			const resp = await fetch(BASE_URL + "/multipleFiles", {
				method: "POST",
				Authorization: `Bearer ${token}`,
				body: files,
			});

			if (resp) {
				filesResponse = await resp.json();
			}
		}

		const user = JSON.parse(localStorage.getItem("user-details"));
		const programIds = [];

		const errorOccurs = await checkFormError();

		if (!errorOccurs) {
			formData.programsTags.map(item => {
				programIds.push(
					builtFor.find(ele => ele.programName === item).programId
				);
			});
			const objToSend = {
				caseIsPublic: formData.caseIsPublic,
				caseTitle: formData.caseTitle,
				principalId: parseInt(formData.principalId, 10),
				employeesTags: [
					...formData.employeesTags.map(item => {
						return {
							id: employees.find(ele => ele.employeeName === item).id,
							text: item,
						};
					}),
				],
				programsTags: [
					...formData.programsTags.map(item => {
						return {
							id: builtFor.find(ele => ele.programName === item).programId,
							text: item,
						};
					}),
				],
				technologyTags: [
					...formData.technologyTags.map(item => {
						return {
							id: technology[0].technologyName.indexOf(item),
							text: item,
						};
					}),
				],
				clientId: formData.clientId,
				technicalSummary: formData.technicalSummary,
				partnerId: user.partnerId,
				associationId: user.associationId,
				programIds: programIds.toString(),
				architecture: filesResponse
					? filesResponse.data.map(data => UPLOADS_URL + data.name)
					: [],
			};
			const token = localStorage.getItem("token");
			const res = await fetchJSON(BASE_URL + "/dashboard/cases", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(objToSend),
			});
			if (res) {
				getClientsList("all");
				handleShow();
				setSuccess(true);
				setMessage("Case Added Successfully");
				getCaseStudyList();
			}
		}
	};

	const checkFormError = () => {
		let errorOccurs = false;
		if (formData) {
			if (!formData.caseTitle) {
				setCaseTitleMessage("*Case Title is Required");
				errorOccurs = true;
			}

			if (!formData.principalId) {
				setPrincipalMsg("*Principal is required");
				errorOccurs = true;
			}

			if (!formData.clientId) {
				setClientMsg("*Client is Required");
				errorOccurs = true;
			}

			if (!formData.technologyTags || formData.technologyTags.length === 0) {
				setTechnologyMsg("*Technology Tags are Required");
				errorOccurs = true;
			}

			if (!formData.programsTags || formData.programsTags.length === 0) {
				setBuildForMsg("*Built for is Required");
				errorOccurs = true;
			}

			if (!formData.technicalSummary || formData.technicalSummary === "") {
				setTechnicalSummaryMsg("*Technical Summary is Required");
				errorOccurs = true;
			}
		} else {
			setCaseTitleMessage("*Case Title is Required");
			setPrincipalMsg("*Principal is required");
			setClientMsg("*Client is Required");
			setTechnologyMsg("*Technology Tags are Required");
			setBuildForMsg("*Built for is Required");
			setTechnicalSummaryMsg("*Technical Summary is Required");
		}

		return errorOccurs;
	};

	const clearErrors = () => {
		setCaseTitleMessage("");
		setPrincipalMsg("");
		setClientMsg("");
		setTechnologyMsg("");
		setBuildForMsg("");
		setTechnicalSummaryMsg("");
	};

	const handleRowClick = async item => {
		clearErrors();
		setFormData({});
		setEdit(true);
		setSelectedCaseStudy(item);
		//await getEmployeesList();
		await getBuiltFor(item.principalId);
		await getClientsList(item.principalId);
		setShow(true);
	};

	// const handlePrint = useReactToPrint({
	//   content: () => componentRef.current,
	// });

	const handlePrint = () => {
		var elem = document.getElementByID("printThis");
		var domClone = elem.cloneNode(true);

		var $printSection = document.getElementById("printSection");

		if (!$printSection) {
			var $printSection = document.createElement("div");
			$printSection.id = "printSection";
			document.body.appendChild($printSection);
		}

		$printSection.innerHTML = "";
		$printSection.appendChild(domClone);
		window.print();
	};

	const snap = useSnapshot(valtioState);

	return (
		<>
			<div className="card-box expand-card">
				<div className="card">
					<div className="card-body">
						<div className="row">
							<div className="col-lg-12">
								<div className="d-flex justify-content-between">
									<h4>CASE STUDIES</h4>
									{snap.navRoles?.clientCaseStudy?.add ? (
										<Button
											type="submit"
											className="btn btn-light-primary font-weight-bolder"
											onClick={handleShow}
										>
											ADD +
										</Button>
									) : null}
								</div>

								<div className="row">
									<div className="col-lg-3">
										<Form>
											<Form.Group controlId="exampleForm.ControlSelect1">
												<Form.Control
													as="select"
													value={principalFilters}
													onChange={e => {
														setPrincipalFilters(e.target.value);
														setSearchFilter("");
													}}
												>
													<option selected="true" value="" disabled="disabled">
														Select Vendor
													</option>
													<option value="all">All</option>
													{principals.map(item => {
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
												placeholder="Search..."
												value={searchFilter}
												onChange={e => setSearch(e.target.value)}
											/>
										</Form.Group>
									</div>
								</div>
								<div className="table-container">
									<Table>
										<div className="table-body">
											<thead>
												<tr>
													<th className="table-text">Title</th>
													<th className="table-text">Client Name</th>
													<th className="table-text" width="180">
														Technology Tags
													</th>
													<th className="table-text" width="180">
														Employees
													</th>
													<th className="table-text">Reference Type</th>
													<th className="table-text">Added On</th>
													{/* <th className="table-text text-center">Architecture</th> */}
													<th className="table-text  text-center">Summary</th>
													<th className="table-text  text-center">Actions</th>
												</tr>
											</thead>
											<tbody>
												{loader ? (
													<SkeletonComp rows={8} columns={8}></SkeletonComp>
												) : (
													<React.Fragment>
														{tableData &&
															tableData.map(item => {
																return (
																	<tr>
																		<td>{item.caseTitle}</td>
																		<td>
																			{clients &&
																				clients.map(ele => {
																					if (ele.id == item.clientId) {
																						return ele.clientName;
																					}
																				})}
																		</td>
																		<td>
																			{item.technologyTags &&
																				item.technologyTags.map(ele => {
																					return (
																						<span className="label label-md label-light-success label-inline ml-2 mt-2">
																							{ele.text}
																						</span>
																					);
																				})}
																		</td>
																		<td
																			style={{
																				minWidth: 200,
																			}}
																		>
																			{item.employeesTags &&
																				item.employeesTags.map(ele => {
																					return (
																						<React.Fragment>
																							<span className="label label-md label-light-info label-inline mt-2 ml-1">
																								{ele.text}
																							</span>
																							<OverlayTrigger
																								trigger="hover"
																								placement="right"
																								overlay={
																									<Popover
																										style={{ padding: 16 }}
																										id="popover-basic"
																										title="Popover right"
																									>
																										<strong>
																											Certifications
																										</strong>
																										<hr></hr>
																										{employees.find(
																											item => item.id === ele.id
																										)?.employeeCertifications
																											.length > 0
																											? employees
																													.find(
																														item =>
																															item.id === ele.id
																													)
																													?.employeeCertifications.map(
																														ele => {
																															return (
																																<span>
																																	<span>
																																		{
																																			ele?.name
																																				?.certificationName
																																		}
																																	</span>
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
																									className="fa fa-question-circle"
																									style={{
																										fontSize: 12,
																										paddingLeft: 8,
																									}}
																								></i>
																							</OverlayTrigger>
																							<br></br>
																						</React.Fragment>
																					);
																				})}
																		</td>
																		<td className="text-center">
																			<span
																				className={`label label-lg label-light-${
																					item.caseIsPublic
																						? "primary"
																						: "warning"
																				} label-inline`}
																			>
																				{item.caseIsPublic
																					? "Public"
																					: "Private"}
																			</span>
																		</td>
																		<td>{datePipe(item.createdAt)}</td>
																		{/* <td className="text-center">
                                      {
                                        item.architecture.length > 0 &&
                                        item.architecture.map(architecture => (
                                          <a href={architecture} target="_blank">
                                            <div>View</div>
                                          </a>
                                        ))
                                      }																		

                                    </td> */}
																		{/* <td>{item.architecture}</td> */}
																		<td
																			className="text-center text-primary"
																			style={{ cursor: "pointer" }}
																			onClick={e => showModal(e, item)}
																			// onClick={() =>
																			//   window.open{`error/error-v3`, "_blank"}
																			// }
																		>
																			{" "}
																			View
																			{/* <Link to={`error/error-v3/${item.id}`} onClick={item} target="_blank"> */}
																			{/* <Link
                                  to={{
                                    pathname: `error/error-v3/${item.id}`,
                                    state: {
                                      fromNotifications: true,
                                    },
                                  }}
                                  target="_blank"
                                >
                                  View
                                </Link> */}
																		</td>
																		<td>
																			<a
																				title="Edit"
																				className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
																			>
																				<span className="svg-icon svg-icon-md svg-icon-primary">
																					<SVG
																						title="Edit"
																						src={toAbsoluteUrl(
																							"/media/svg/icons/Communication/Write.svg"
																						)}
																						onClick={() => handleRowClick(item)}
																					/>
																				</span>
																			</a>
																		</td>
																	</tr>
																);
															})}
													</React.Fragment>
												)}
											</tbody>
										</div>
									</Table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* MODAL STARTS HERE*/}

			<Modal size="lg" show={show} onHide={handleShow}>
				<Form onSubmit={e => (isEdit ? updateCaseStudy(e) : addCaseStudy(e))}>
					<Modal.Header closeButton>
						<Modal.Title>Case Study</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Case Title *</Form.Label>
							<Form.Control
								type="name"
								placeholder="Case Title"
								value={formData.caseTitle}
								onChange={e =>
									setFormData({ ...formData, caseTitle: e.target.value })
								}
								required
							/>
							{caseTitleMessage ? (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">{caseTitleMessage}</div>
								</div>
							) : null}
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Vendor *</Form.Label>
							<Form.Control
								as="select"
								defaultValue={parseInt(formData.principalId, 10)}
								required
								onChange={e => {
									setFormData({
										...formData,
										principalId: parseInt(e.target.value, 10),
										programsTags: [],
										clientId: "",
									});
									getClientsList(e.target.value);
									getBuiltFor(e.target.value);
								}}
							>
								<option selected="true" disabled="disabled" value={0}>
									Select Vendor
								</option>
								{principals &&
									principals.map(item => {
										return (
											<option value={item.principalId}>
												{item.principalName}
											</option>
										);
									})}
							</Form.Control>
							{principalMsg ? (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">{principalMsg}</div>
								</div>
							) : null}
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Client Name *</Form.Label>
							<Form.Control
								as="select"
								value={formData.clientId}
								onChange={e => {
									setFormData({ ...formData, clientId: e.target.value });
									setClientMsg("");
								}}
							>
								<option selected="true" disabled="disabled" value="">
									Please add client name
								</option>
								{clients &&
									clients.map(client => {
										return (
											<option value={client.id}>{client.clientName}</option>
										);
									})}
							</Form.Control>
							{clientMsg ? (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">{clientMsg}</div>
								</div>
							) : null}
						</Form.Group>

						<Form.Group>
							<Form.Label>Employees</Form.Label>
							<Autocomplete
								multiple
								name="employees"
								options={[
									...employees.map(ele => {
										return ele.employeeName;
									}),
								]}
								getOptionLabel={option => option}
								defaultValue={formData.employeesTags}
								onChange={(e, value) =>
									setFormData({ ...formData, employeesTags: value })
								}
								renderInput={params => (
									<TextField
										{...params}
										InputLabelProps={{ required: true }}
										variant="outlined"
										placeholder="Start Typing...."
									/>
								)}
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Built For *</Form.Label>
							<Autocomplete
								multiple
								name="builtfor"
								options={
									builtFor.length
										? [
												...builtFor.map(ele => {
													return ele.programName;
												}),
										  ]
										: []
								}
								value={
									formData && formData.programsTags ? formData.programsTags : []
								}
								getOptionLabel={option => option}
								onChange={(e, value) => {
									setFormData({ ...formData, programsTags: value });
									setBuildForMsg("");
								}}
								renderInput={params => (
									<TextField
										{...params}
										variant="outlined"
										placeholder="Type Program Name"
									/>
								)}
							/>
							{buildForMsg ? (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">{buildForMsg}</div>
								</div>
							) : null}
						</Form.Group>

						<Form.Group>
							<Form.Label>Technology Tags *</Form.Label>
							<Autocomplete
								multiple
								name="technology"
								options={technology[0]?.technologyName}
								getOptionLabel={option => option}
								defaultValue={formData.technologyTags}
								onChange={(e, value) =>
									setFormData({ ...formData, technologyTags: value })
								}
								renderInput={params => (
									<TextField
										{...params}
										variant="outlined"
										placeholder="Start Typing...."
									/>
								)}
							/>
							{technologyMsg ? (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">{technologyMsg}</div>
								</div>
							) : null}
						</Form.Group>
						<Form.Group controlId="exampleForm.ControlTextarea1">
							<Form.Label>Technical Summary *</Form.Label>
							<Form.Control
								as="textarea"
								rows="3"
								required
								value={formData.technicalSummary}
								onChange={e =>
									setFormData({ ...formData, technicalSummary: e.target.value })
								}
								value={formData.technicalSummary}
							/>
							{technicalSummaryMsg ? (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">{technicalSummaryMsg}</div>
								</div>
							) : null}
						</Form.Group>
						{isEdit &&
							formData.architecture &&
							formData.architecture.map(architecture => (
								<div
									className="image-input image-input-outline mr-8"
									id="kt_profile_avatar"
								>
									<img src={architecture} width="150" height="100"></img>
									<label
										className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
										data-action="change"
										data-toggle="tooltip"
										title=""
										data-original-title="Change avatar"
									>
										<div
											onClick={() =>
												setFormData({
													...formData,
													architecture: formData.architecture.filter(
														item => item !== architecture
													),
												})
											}
										>
											<i className="fa fa-times icon-sm text-muted"></i>
										</div>
									</label>
								</div>
							))}

						<Form.Group controlId="exampleForm.ControlTextarea1">
							<Form.Label>Upload Architecture Diagrams</Form.Label>
							<br></br>
							<span>Please upload 2 or more pictures!</span>
							<Form.Control
								type="file"
								rows="3"
								multiple="multiple"
								onChange={e => setUpFiles(e)}
							/>
						</Form.Group>

						{/* RADIO BUTTON STARTS */}
						<Form.Label>Reference Type</Form.Label>
						{/* 1 */}
						<div key={`default-1`} className="mb-3">
							<Form.Group controlId="exampleForm.ControlInput1">
								<Form.Check
									inline
									type={"radio"}
									name="refType"
									// id={`default-${type}`}
									label={`Public`}
									onChange={e =>
										setFormData({ ...formData, caseIsPublic: true })
									}
									checked={formData.caseIsPublic === true}
								/>

								<Form.Check
									inline
									// disabled
									name="refType"
									type={"radio"}
									label={`Private`}
									// id={`disabled-default-${type}`}
									onChange={e =>
										setFormData({ ...formData, caseIsPublic: false })
									}
									checked={formData.caseIsPublic === false}
								/>
							</Form.Group>
						</div>

						{/* RADIO BUTTON ENDS */}
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="danger"
							onClick={() => setShow(false)}
							className="btn btn-light-danger font-weight-bolder mr-5"
						>
							Close
						</Button>

						{snap.navRoles?.clientCaseStudy?.edit && isEdit ? (
							<Button
								variant="primary"
								type="submit"
								className="btn btn-light-primary font-weight-bolder"
							>
								Update
							</Button>
						) : snap.navRoles?.clientCaseStudy?.add ? (
							<Button
								variant="primary"
								type="submit"
								disabled={(isEdit && !formData.active) || formData.isConvert}
								className="btn btn-light-primary font-weight-bolder"
							>
								Add
							</Button>
						) : null}
					</Modal.Footer>
				</Form>
			</Modal>

			{/* MODAL ENDS HERE*/}
			<div id="printThis">
				<Modal size="lg" show={modal} onHide={showModal}>
					<Modal.Header closeButton>
						<div>
							<Modal.Title>Case Study</Modal.Title>
							<p>{modalBody.caseTitle}</p>
						</div>
						<div className="ml-auto">
							<Modal.Title>Added On</Modal.Title>
							<p className="text-center">
								{new Date(modalBody.createdAt).toLocaleDateString()}
							</p>
						</div>
					</Modal.Header>
					<Modal.Body>
						<Table className="mt-2">
							<tr>
								<td>Client Name</td>
								<td>
									{clients &&
										clients.map(ele => {
											if (ele.id == modalBody.clientId) {
												return <h6>{ele.clientName}</h6>;
											}
										})}
								</td>
							</tr>
							<tr>
								<td>Employee (s)</td>
								<td>
									{modalBody.employeesTags &&
										modalBody.employeesTags.map(item => {
											return (
												<span className="label label-inline label-lg label-light-primary mt-2 mr-2">
													{item.text}
												</span>
											);
										})}
								</td>
							</tr>
							<tr>
								<td>Technology Tags</td>
								<td>
									{modalBody.technologyTags &&
										modalBody.technologyTags.map(item => {
											return (
												<span className="label label-inline label-lg label-light-success mt-2 mr-2">
													{item.text}
												</span>
											);
										})}
								</td>
							</tr>
							<tr>
								<td>Reference Type</td>
								<td>
									<span
										className={`label label-inline label-lg label-light-${
											modalBody.caseIsPublic ? "info" : "warning"
										}`}
									>
										{modalBody.caseIsPublic ? "Public" : "Private"}
									</span>
								</td>
							</tr>
							<tr>
								<td>Technical Summary</td>
								<td>{modalBody.technicalSummary}</td>
							</tr>
							<tr>
								<td>Architecture</td>
								<td>
									{modalBody?.architecture?.length > 0 &&
										modalBody?.architecture.map(architecture => (
											<a href={architecture} target="_blank">
												<div>View</div>
											</a>
										))}
								</td>
							</tr>
						</Table>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="danger"
							onClick={showModal}
							className="btn btn-light-danger font-weight-bolder mr-5"
						>
							Close
						</Button>

						<Button
							variant="primary"
							onClick={handlePrint}
							className="btn btn-light-success font-weight-bolder"
						>
							Print
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
			<SnackbarComp
				open={isSuccess}
				onClose={e => setSuccess(false)}
				message={message}
			></SnackbarComp>
		</>
	);
}

export default CaseStudies;
