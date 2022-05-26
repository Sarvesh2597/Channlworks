import React, { useState, useEffect } from "react";
import moment from "moment";
import {
	Table,
	Form,
	Modal,
	InputGroup,
	FormControl,
	Spinner,
} from "react-bootstrap";
import { toAbsoluteUrl } from "../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Button } from "@material-ui/core";
import { fetchJSON } from "../../_metronic/_helpers/api";
import { BASE_URL, UPLOADS_URL } from "../../_metronic/_constants/endpoints";
import _ from "lodash";
import { CSVLink } from "react-csv";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import SnackbarComp from "../Components/SnackbarComp";
import { datePipe } from "../../_metronic/_helpers/date-pipe";
import SkeletonComp from "../Components/SkeletonComp";
import { Status } from "../../utils/helpers";
import { useSnapshot } from "valtio";
import { valtioState } from "../App";
const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const csvSampleData = [
	[
		"employeeName",
		"employeeJoinedOn",
		"employeeComments",
		"employeeEmail",
		"file",
		"certificateName",
		"validity",
	],
	[
		"john Taub",
		"2018-12-23",
		"",
		"atult@test.com",
		"",
		"AWS certified Database- Speciality",
		"2021-10-22T10:22:47.256Z",
	],
	[
		"ricky test",
		"2018-12-23",
		"",
		"ashishtsd@test.com",
		"",
		"AWS certified Database - Speciality",
		"2021-10-22T10:22:47.256Z",
	],
	[
		"ricky test",
		"2018-12-23",
		"",
		"ashishtsd@test.com",
		"",
		"AWS certified Database - Speciality",
		"2021-10-22T10:22:47.256Z",
	],
	["", "", "", "", "", "", ""],
	["", "", "", "", "", "", ""],
	["", "", "", "", "", "", ""],

	[
		`INSTRUCTIONS (PLEASE DELETE THIS DURING UPLOAD)- If you want to add data for employees with multiple entries, please create duplicate records with all the fields same, except for the Certificate Name and Certificate Validity.
Example - For employee John Doe, to add 3 certificates, create 3 rows with same Name, Email, Joining Date information but with unique Certificate Name and Expiry Date for that specific certificate.
Please do NOT add dates in DD-MM-YYYY / YY format. All the entries with those records will be automatically discarded.
To update any specific employee details, please edit using the edit button on the platform. Re-uploading CSV with edited details of existing employee will NOT edit the record.
To add new employees, please upload CSV with all the records and not just the new entries. We will only add the new entries and discard the older entries.`,
	],
];

function CertifiedEmployees() {
	const emailDomain = JSON.parse(localStorage.getItem("user-details")).Partner
		?.partnerDomains;
	const [show, setShow] = useState(false);
	const [principals, setPrincipals] = useState([]);
	const [certification, setCertification] = useState([]);

	const [principalFilters, setPrincipalFilters] = useState("all");
	const [tableData, setTableData] = useState([]);
	const [searchFilter, setSearchFilter] = useState("");
	const [employees, setEmployees] = useState([]);
	const [csvData, setCSVData] = useState([]);

	const [modal, setModal] = useState(false);

	const [modalBody, setModalBody] = useState({});

	const [formData, setFormData] = useState({});

	const [isEdit, setIsEdit] = useState(false);

	const [addCertifications, setAddCertifications] = useState([]);

	const [certificationSelect, setCertificationSelect] = useState([]);

	const [selectedPrincipal, setSelectedPrincipal] = useState([]);

	const [statusUpdated, setStatusUpdated] = useState();

	const [loader, setLoader] = useState(false);

	const [isSuccess, setSuccess] = useState(false);
	const [message, setMessage] = useState(false);
	const [variant, setVariant] = useState("success");

	const [empNameMessage, setEmpNameMessage] = useState("");
	const [joinedMsg, setJoinedMsg] = useState("");
	const [emailMsg, setEmailMsg] = useState("");
	const [principalMsg, setPrincipalMsg] = useState("");

	// csv
	const [csvModal, setCSVModal] = useState(false);
	const [uploadCSVFile, setUploadCSVFile] = useState();
	const [csvStatus, setCsvStatus] = useState(Status.idle);
	const [csvError, setCSVError] = useState("");

	const handleShow = () => {
		setShow(!show);
		setAddCertifications([]);
	};
	const handleClose = () => {
		setShow(!show);
		setEmailMsg("");
	};
	const showModal = (e, item = {}) => {
		console.log(item);
		setModalBody(item);
		setModal(!modal);
	};

	const getPrincipals = async () => {
		setPrincipals([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(
			BASE_URL + "/dashboard/myorg/associations/principals/" + partnerId
		);
		if (res) {
			const uniquePrincipals = _.uniqBy(res, "principalId");
			setPrincipals(uniquePrincipals);
		}
	};

	const getCertifiedEmployees = async () => {
		setLoader(true);
		setEmployees([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		let params = principalFilters ? "/" + principalFilters : "";
		const res = await fetchJSON(
			BASE_URL + "/dashboard/employees/partner/" + partnerId + params
		);
		if (res) {
			var copyArr = _.clone(res, true);
			copyArr &&
				copyArr.map(d => {
					if (d?.tags) {
						let gcpIndex = d?.tags.findIndex(tag => tag === "Google Cloud");
						if (gcpIndex > -1) d.tags[gcpIndex] = "gcp";

						let azureIndex = d?.tags.findIndex(
							tag => tag === "Microsoft Azure"
						);
						if (azureIndex > -1) d.tags[azureIndex] = "azure";
					}
				});
			setEmployees(copyArr);

			setTableData(res);
			setLoader(false);

			const csvArr = [];
			res.map((item, i) => {
				let tag = "";
				item.tags &&
					item.tags.map(ele => {
						tag += ele + ", ";
					});
				let certificates = "";
				item.employeeCertifications &&
					item.employeeCertifications.length &&
					item.employeeCertifications.map(ele => {
						certificates += ele.name ? ele.name.certificationName + ", " : "";
					});

				csvArr.push({
					"SL.No": i + 1,
					Name: item.employeeName,
					Principals: tag,
					Email: item.employeeEmail,
					Status: item.employeeIsActive ? "Active" : "Inactive",
					Certifications: certificates,
					"Total Certifications": item.certificationsCount,
				});
			});

			setCSVData(csvArr);
		}
	};

	const getCertificationsList = async () => {
		setCertification([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(
			BASE_URL + "/dashboard/employees-certs/21/" + partnerId + "?principal=12"
		);
		if (res) {
			setCertification(res);
			// const csvArr = [];
			// res.map((item, i) => {
			// 	let tag = "";
			// 	item.tags &&
			// 		item.tags.map(ele => {
			// 			tag += ele + ", ";
			// 		});
			// 	let certificates = "";
			// 	item.employeeCertifications &&
			// 		item.employeeCertifications.length &&
			// 		item.employeeCertifications.map(ele => {
			// 			certificates += ele.name ? ele.name.certificationName + ", " : "";
			// 		});

			// 	csvArr.push({
			// 		"SL.No": i + 1,
			// 		Name: item.employeeName,
			// 		Principals: tag,
			// 		Email: item.employeeEmail,
			// 		Status: item.employeeIsActive ? "Active" : "Inactive",
			// 		Certifications: certificates,
			// 		"Total Certifications": item.certificationsCount,
			// 	});
			// });

			// setCSVData(csvArr);
		}
	};

	const setSearch = (e, type = "principal") => {
		setSearchFilter();
		if (e === "") {
			setTableData(employees);
		} else {
			// if (type === "principal") {
			// 	let filteredData = employees.filter(ele =>
			// 		JSON.stringify(_.compact(ele.tags))
			// 			.toLowerCase()
			// 			.includes(e.toLowerCase())
			// 	);

			// 	setTableData(filteredData);
			// } else {
			let filteredData = employees.filter(ele =>
				JSON.stringify(ele)
					.toLowerCase()
					.includes(e.toLowerCase())
			);
			setTableData(filteredData);
			// }
		}
	};

	const updateCertifiedEmployees = async e => {
		e.preventDefault();
		const errorOccur = checkFormError();

		var email = formData?.email.match(mailformat)
			? formData?.email.split("@")[0]
			: formData?.email;

		if (!errorOccur) {
			const varDate = new Date(formData.leftOn);
			let today = new Date();
			today.setHours(0, 0, 0, 0);
			const user = localStorage.getItem("user-details");
			const partnerId = JSON.parse(user).partnerId;
			const objToSend = {
				certcount: addCertifications.length,
				certificationsCount: formData.certificationsCount,
				createdAt: formData.createdAt,
				employeesTags: [],
				employeeIsActive: !formData.leftOn
					? formData.employeeIsActive
					: varDate >= today,
				id: formData.id,
				no_of_expired_certificates: formData.no_of_expired_certificates,
				updatedAt: new Date(),
				employeeName: formData.name,
				employeeJoinedOn: formData.joinedOn,
				employeeLeftOn: formData.leftOn,
				employeeEmail: email + "@" + emailDomain,
				employeeComments: formData.comment,
				employeeAssignStatus: formData.status,
				employeePartnerId: partnerId,
				employeePrincipalId: [
					...formData.principalIds.map(item => {
						return item.principalId;
					}),
				].join(","),
				principalIds: formData.principalIds
					? [
							...formData.principalIds.map(item => {
								return item.principalId;
							}),
					  ].join(",")
					: "",
				tags: formData.principalIds
					? [
							...formData.principalIds.map(item => {
								return item.principalName;
							}),
					  ]
					: "",
				employeeCertifications: addCertifications,
			};
			const res = await fetchJSON(BASE_URL + "/dashboard/employees", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(objToSend),
			});
			if (res) {
				getCertifiedEmployees();
				setShow(!show);
				setIsEdit(false);
				setSuccess(true);
				setMessage("Updated Successfully");
			}
		}
	};
	const addCertifiedEmployees = async e => {
		e.preventDefault();
		const errorOccur = checkFormError();
		console.log(addCertifications);

		if (!errorOccur) {
			const varDate = new Date(formData.leftOn);
			let today = new Date();
			today.setHours(0, 0, 0, 0);
			const user = localStorage.getItem("user-details");
			const partnerId = JSON.parse(user).partnerId;
			const objToSend = {
				employeeName: formData.name,
				employeeJoinedOn: formData.joinedOn,
				employeeLeftOn: formData.leftOn,
				employeeEmail: formData.email + "@" + emailDomain,
				employeeComments: formData.comment,
				employeeAssignStatus: formData.status,
				employeePartnerId: partnerId,
				certcount: addCertifications.length,
				employeeIsActive: !formData.leftOn ? true : varDate >= today,
				certificationsCount: addCertifications.length,
				principalIds: formData.principalIds
					? [
							...formData.principalIds.map(item => {
								return item.principalId;
							}),
					  ].join(",")
					: "",
				principals: formData.principalIds
					? [
							...formData.principalIds.map(item => {
								return { id: item.principalId, text: item.principalName };
							}),
					  ]
					: "",
				employeeCertifications: addCertifications,
			};
			const res = await fetchJSON(BASE_URL + "/dashboard/employees", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(objToSend),
			});
			if (res) {
				getCertifiedEmployees();
				setShow(!show);
				setSuccess(true);
				setMessage("Added Successfully");
			}
		}
	};

	const handleRowClick = item => {
		// console.log([
		//   ...item.employeePrincipalId.split(",").map((item) => {
		//     return principals.find((ele) => ele.principalId == item).principalName;
		//   }),
		// ]);
		var tempEmail;
		if (item.employeeEmail !== "") {
			const cemail = item.employeeEmail.slice().split("@");
			if (cemail.length > 2 && cemail[cemail.length - 1] === emailDomain) {
				cemail.splice(cemail.length - 1, 1);
				tempEmail = cemail.join().replace(/,/g, "@");
			} else if (
				cemail.length === 2 &&
				cemail[cemail.length - 1] === emailDomain
			) {
				cemail.splice(cemail.length - 1, 1);
				tempEmail = cemail[0];
			} else tempEmail = item.employeeEmail;
		}

		setIsEdit(true);
		setAddCertifications([
			...item.employeeCertifications.filter(item =>
				moment(item.validity).isAfter(new Date())
			),
		]);
		setFormData({
			certificationsCount: item.certificationsCount,
			createdAt: item.createdAt,
			employeeIsActive: item.employeeIsActive,
			id: item.id,
			no_of_expired_certificates: item.no_of_expired_certificates,
			active: item.isOngoing,
			name: item.employeeName,
			joinedOn: item.employeeJoinedOn,
			leftOn: item.employeeLeftOn,
			email: tempEmail,
			principalIds: item.employeePrincipalId
				? [
						...item.employeePrincipalId.split(",").map(item => {
							return principals.find(ele => ele.principalId == item);
						}),
				  ]
				: [],
			comment: item.employeeComments,
		});
		onSelectPrinciple(
			item.employeePrincipalId
				? [
						...item.employeePrincipalId.split(",").map(item => {
							return principals.find(ele => ele.principalId == item);
						}),
				  ]
				: []
		);
		setShow(true);
	};

	const checkFormError = () => {
		let errorOccurs = false;
		console.log(formData, formData?.email);

		if (formData) {
			var domain =
				formData.email &&
				formData.email.includes("@") &&
				formData?.email.split("@");
			console.log("::::", formData?.email, domain);
			if (!formData.name) {
				setEmpNameMessage("*Employee Name is Required");
				errorOccurs = true;
			}

			if (!formData.joinedOn) {
				setJoinedMsg("*Employee Joining date is Required");
				errorOccurs = true;
			}

			if (!formData.email) {
				setEmailMsg("*Employee Email Required");
				errorOccurs = true;
			} else if (domain && domain.length > 2) {
				domain.splice(0, 1);
				domain.splice(domain.length - 1, 1);
				setEmailMsg(
					`*wrong email address, don't specify domain address 
					<del className="text-info">@${domain.join().replace(/,/g, "@")}</del>`
				);
				errorOccurs = true;
			} else if (domain && domain.length === 2) {
				setEmailMsg(
					`*wrong email address, don't specify domain address 
					<del className="text-info">@${domain[1]}</del>`
				);
				errorOccurs = true;
			}

			if (!formData.principalIds || formData.principalIds.length === 0) {
				setPrincipalMsg("*Atleast one principal is required.");
				errorOccurs = true;
			}
		} else {
			setEmpNameMessage("*Employee Name is Required");
			setJoinedMsg("*Employee Joining date is Required");
			setEmailMsg("*Employee Email Required");
			setPrincipalMsg("*Atleast one principal is required.");
		}

		return errorOccurs;
	};

	const onClickAddCertification = () => {
		if (!formData.principalIds || formData.principalIds.length === 0) {
			setPrincipalMsg("*Atleast one principal is required.");
		} else {
			const values = [...addCertifications];
			setFormData({ ...formData, status: true });
			const oneYearFromNow = new Date();
			oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
			values.push({ file: "", name: null, validity: oneYearFromNow });
			setAddCertifications(values);
		}
	};

	const handleOnChange = async (e, index, newValue) => {
		let newArray = addCertifications;
		if (e.target.name === "file") {
		} else if (newValue !== undefined && newValue !== null) {
			newArray[index][`name`] = newValue;
		} else {
			newArray[index][e.target.name] = e.target.value;
		}
		newArray = await addCertifications.map((res, i) => {
			let newRes = res;
			if (i == index) {
				if (e.target.name === "file") {
					let formData = new FormData();
					formData.append("document", e.target.files[0]);
					fetchJSON(BASE_URL + "/uploadfile", {
						method: "POST",
						headers: {},
						body: formData,
					}).then(res => {
						if (res.status) {
							newRes["file"] = `${UPLOADS_URL}${res.data.name}`;
						} else {
							// add toaseter message here
						}
					});
				} else if (newValue !== undefined && newValue !== null) {
					newRes[`name`] = newValue;
				} else {
					newRes[e.target.name] = e.target.value;
				}
			}
			return newRes;
		});
		setAddCertifications(newArray);
	};

	const onSelectPrinciple = async newValue => {
		let params = "all?";
		newValue.map((item, index) => {
			let addParam = `${index}=${item.principalId}&`;
			params = params.concat(addParam);
		});
		const res = await fetchJSON(
			BASE_URL + "/dashboard/certifications/principal/" + params
		);
		if (res) {
			setCertificationSelect(res);
		}
	};

	const handleDeleteCertificate = index => {
		let certifications = JSON.parse(JSON.stringify(addCertifications));
		certifications.splice(index, 1);
		setAddCertifications(certifications);
	};

	const disabledInput = () => {
		const varDate = new Date(formData.leftOn);
		let today = new Date();
		today.setHours(0, 0, 0, 0);
		console.log(!formData.leftOn ? false : varDate <= today);
		return !formData.leftOn ? false : varDate <= today;
	};

	useEffect(() => {
		getPrincipals();
		//getCertificationsList();
		getCertifiedEmployees();
	}, []);

	useEffect(() => {
		if (searchFilter || principalFilters) {
			getCertifiedEmployees();
		}
		setSearch("");
	}, [searchFilter, principalFilters]);

	const showCSVModal = () => {
		setCSVModal(!csvModal);
	};

	const onChangeFile = event => {
		setUploadCSVFile(event.target.files[0]);
		setCSVError("");
	};

	const uploadCSV = async () => {
		if (!uploadCSVFile) {
			setCSVError("Please Select file");
			return;
		}

		setCsvStatus(Status.pending);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;

		const formData = new FormData();

		formData.append("doc", uploadCSVFile);
		formData.append("partenerId", partnerId);

		try {
			const res = await fetchJSON(
				BASE_URL + "/dashboard/bulk/cert-employees" + "/" + partnerId,
				{
					method: "POST",
					headers: {
						// "Content-Type": "application/vnd.ms-excel",
					},
					body: formData,
				}
			);

			if (res) {
				if (res.successInsert !== undefined && res.successInsert.length) {
					setVariant("success");
					setUploadCSVFile("");
				} else setVariant("error");
				setSuccess(true);
				setMessage(
					res.successInsert !== undefined && res.successInsert.length
						? "File uploaded successfully"
						: "Some of the emails were skipped, as they were already in use"
				);
				setCsvStatus(Status.resolved);
				getCertifiedEmployees();
				showCSVModal(!csvModal);
			}
		} catch (error) {
			setCsvStatus(Status.rejected);
		}
	};

	const snap = useSnapshot(valtioState);

	return (
		<>
			<div className="card-box">
				<div className="card">
					<div className="card-body">
						<div className="row">
							<div className="col-lg-12">
								<div className="d-flex justify-content-between">
									<h4>Certified Employees</h4>
									<div className="mb-4">
										{snap.navRoles?.staffInformation?.add ? (
											<Button
												type="submit"
												className="btn btn-light-primary font-weight-bolder"
												onClick={() => {
													setIsEdit(false);
													setFormData({});
													handleShow();
												}}
											>
												ADD +
											</Button>
										) : null}
										<Button
											type="submit"
											className="btn btn-light-success font-weight-bolder ml-3"
											onClick={() => {
												showCSVModal();
											}}
										>
											Upload CSV
										</Button>
										<CSVLink
											className="btn btn-light-warning ml-3 font-weight-bolder csv-btn"
											filename={"certified_employees.csv"}
											data={csvData}
										>
											Export to CSV
										</CSVLink>
									</div>
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
												placeholder="Search..."
												value={searchFilter}
												onChange={e => setSearch(e.target.value)}
											/>
										</Form.Group>
									</div>
									<div className="col-lg-3">
										<InputGroup className="mb-3">
											<FormControl
												placeholder="Search by Certificate Name"
												aria-label="Search by Certificate Name"
												aria-describedby="basic-addon2"
												value={searchFilter}
												onChange={e => setSearch(e.target.value, "certificate")}
											/>
											<InputGroup.Append>
												<Button
													className="btn btn-light-success"
													onClick={() => setSearchFilter("")}
												>
													Clear
												</Button>
											</InputGroup.Append>
										</InputGroup>
									</div>
								</div>

								<div className="table-container">
									<Table>
										<thead>
											<tr>
												<th className="table-text">Name </th>
												<th className="table-text">Vendors </th>
												<th className="table-text">Email </th>
												<th className="table-text" style={{ minWidth: 50 }}>
													Status{" "}
												</th>
												<th
													className="table-text text-center"
													style={{ minWidth: 50 }}
												>
													Certifications{" "}
												</th>
												{snap.navRoles?.staffInformation?.edit ? (
													<th
														className="table-text text-center"
														style={{ minWidth: 50 }}
													>
														Actions
													</th>
												) : null}
											</tr>
										</thead>
										<tbody>
											{loader ? (
												<SkeletonComp rows={8} columns={6}></SkeletonComp>
											) : (
												<React.Fragment>
													{tableData.length ? (
														tableData.map(item => {
															return (
																<tr>
																	<td
																		onClick={e => showModal(e, item)}
																		style={{ cursor: "pointer" }}
																	>
																		{item.employeeName}
																	</td>
																	<td onClick={e => showModal(e, item)}>
																		{item.tags &&
																			item.tags.map(ele => {
																				return (
																					<span
																						className={`label label-md label-light-${
																							ele === "AWS"
																								? "warning"
																								: ele === "azure"
																								? "info"
																								: "primary"
																						} label-inline mt-2 ml-3 text-uppercase`}
																					>
																						{ele}
																					</span>
																				);
																			})}
																	</td>
																	<td
																		onClick={e => showModal(e, item)}
																		style={{ cursor: "pointer" }}
																	>
																		{item.employeeEmail}
																	</td>
																	<td>
																		<span
																			className={`label label-lg label-light-${
																				item.employeeIsActive
																					? "primary"
																					: "danger"
																			} label-inline`}
																		>
																			{item.employeeIsActive
																				? "Active"
																				: "Inactive"}
																		</span>
																	</td>
																	<td className="text-center">
																		{item.certificationsCount}
																	</td>
																	{snap.navRoles?.staffInformation?.edit ? (
																		<td className="text-center">
																			<a
																				style={{ cursor: "pointer" }}
																				onClick={e => handleRowClick(item)}
																				title="Edit Employee"
																				className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
																			>
																				<span className="svg-icon svg-icon-md svg-icon-primary">
																					<SVG
																						title="Edit Employee"
																						src={toAbsoluteUrl(
																							"/media/svg/icons/Communication/Write.svg"
																						)}
																					/>
																				</span>
																			</a>
																		</td>
																	) : null}
																</tr>
															);
														})
													) : (
														<div className="my-4">
															{!loader && "No records found"}
														</div>
													)}
												</React.Fragment>
											)}
										</tbody>
									</Table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* MODAL STARTS HERE*/}

			<Modal size="lg" show={show} onHide={handleClose}>
				<Form
					onSubmit={e =>
						isEdit ? updateCertifiedEmployees(e) : addCertifiedEmployees(e)
					}
				>
					<Modal.Header closeButton>
						<Modal.Title>Employee</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Employee Name *</Form.Label>
							<Form.Control
								type="name"
								name="name"
								value={formData.name}
								onChange={e => {
									setFormData({ ...formData, name: e.target.value });
									setEmpNameMessage("");
								}}
							/>
							{empNameMessage ? (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">{empNameMessage}</div>
								</div>
							) : null}
						</Form.Group>

						<Form.Group controlId="validationCustom02">
							<Form.Label>Joined On *</Form.Label>

							<Form.Control
								type="date"
								name="joinedOn"
								value={formData.joinedOn}
								onChange={e => {
									setFormData({ ...formData, joinedOn: e.target.value });
									setJoinedMsg("");
								}}
							/>
							{joinedMsg ? (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">{joinedMsg}</div>
								</div>
							) : null}
						</Form.Group>

						<Form.Group controlId="validationCustom02">
							<Form.Label>Left On </Form.Label>
							<Form.Control
								type="date"
								name="leftOn"
								value={formData.leftOn}
								onChange={e =>
									setFormData({ ...formData, leftOn: e.target.value })
								}
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Email *</Form.Label>
							<div className="d-flex align-items-center">
								<Form.Control
									type="text"
									name="email"
									value={formData.email}
									onChange={e => {
										setFormData({ ...formData, email: e.target.value });
										setEmailMsg("");
									}}
								/>
								<strong className="ml-2">@{emailDomain}</strong>
							</div>

							{emailMsg ? (
								<div className="fv-plugins-message-container">
									<div
										className="fv-help-block"
										dangerouslySetInnerHTML={{ __html: emailMsg }}
									/>
								</div>
							) : null}
						</Form.Group>
						{/* {principals.length && } */}
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Vendor(s) *</Form.Label>
							<Autocomplete
								multiple
								name="principals"
								options={principals}
								defaultValue={formData.principalIds}
								getOptionLabel={option => option.principalName}
								onChange={(e, newValue) => {
									setFormData({ ...formData, principalIds: newValue });
									onSelectPrinciple(newValue);
									setPrincipalMsg("");
								}}
								renderInput={params => (
									<TextField
										{...params}
										variant="outlined"
										placeholder="Vendors"
									/>
								)}
							/>
							{principalMsg ? (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">{principalMsg}</div>
								</div>
							) : null}
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlTextarea1">
							<Form.Label>Comment</Form.Label>
							<Form.Control
								as="textarea"
								rows="3"
								name="comment"
								value={formData.comment}
								onChange={e =>
									setFormData({ ...formData, comment: e.target.value })
								}
							/>
						</Form.Group>

						{isEdit ? (
							<div key={`default-1`} className="mb-3">
								<Form.Label>Status</Form.Label>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Check
										inline
										disabled={disabledInput()}
										type={"radio"}
										name="employeeIsActive"
										// id={`default-${type}`}
										label={`Active`}
										onChange={e =>
											setFormData({ ...formData, employeeIsActive: true })
										}
										checked={formData.employeeIsActive === true}
									/>

									<Form.Check
										inline
										// disabled
										name="employeeIsActive"
										type={"radio"}
										label={`Inactive`}
										disabled={disabledInput()}
										// id={`disabled-default-${type}`}
										onChange={e =>
											setFormData({ ...formData, employeeIsActive: false })
										}
										checked={formData.employeeIsActive === false}
									/>
								</Form.Group>
							</div>
						) : null}
						<Form.Group controlId="exampleForm.ControlTextarea1">
							<Button
								variant="primary"
								onClick={e => onClickAddCertification(e)}
								className="btn btn-light-primary font-weight-bolder"
								disabled={certificationSelect.length === 0}
							>
								Add Certifications
							</Button>
						</Form.Group>
						{addCertifications.map((item, index) => (
							<div
								className={
									moment(item.validity).isBefore(new Date())
										? "row disabled-certificate"
										: "row"
								}
							>
								{!item.file || item.file === "" ? (
									<div className="col-lg-4">
										<Form.Label>Upload File</Form.Label>
										<Form.Control
											type="file"
											name="file"
											onChange={e => handleOnChange(e, index)}
											// value={item.file}
										></Form.Control>
									</div>
								) : (
									<div className="col-lg-4 d-flex align-items-center">
										<a href={item.file} target="_blank">
											View Certificate
										</a>
									</div>
								)}

								<div className="col-lg-4">
									<Form.Group controlId="exampleForm.ControlInput1">
										<Form.Label>Certification Name</Form.Label>
										<Autocomplete
											id="combo-box-demo"
											name="name"
											required
											options={certificationSelect.filter(
												item =>
													!addCertifications.find(
														ele =>
															ele?.name?.certificationName ===
																item?.certificationName ||
															moment(item.validity).isBefore(new Date())
													)
											)}
											defaultValue={item.name}
											getOptionLabel={option => option.certificationName}
											size="small"
											onChange={(e, newValue) => {
												handleOnChange(e, index, newValue);
											}}
											renderInput={params => (
												<TextField
													{...params}
													variant="outlined"
													required={!moment(item.validity).isBefore(new Date())}
												/>
											)}
										/>
									</Form.Group>
								</div>
								<div className="col-lg-3">
									<Form.Group controlId="validationCustom02">
										<Form.Label>Certification Expires On</Form.Label>
										<Form.Control
											type="date"
											name="validity"
											min={
												moment(item.validity).isBefore(new Date())
													? null
													: moment(new Date())
															.add(1, "days")
															.format("YYYY-MM-DD")
											}
											onChange={e => handleOnChange(e, index)}
											defaultValue={moment(item.validity).format("YYYY-MM-DD")}
										/>
									</Form.Group>
								</div>
								<div className="col-lg-1 d-flex align-items-center">
									<i
										className="fa fa-trash"
										style={{ cursor: "pointer", color: "#F64E60" }}
										onClick={() => handleDeleteCertificate(index)}
									></i>
								</div>
							</div>
						))}
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="danger"
							onClick={handleClose}
							className="btn btn-light-danger font-weight-bolder mr-5"
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

			{/* Edit Model */}

			<Modal size="md" show={modal} onHide={showModal}>
				<Modal.Header closeButton>
					<Modal.Title>More Info</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Table borderd>
						<tbody>
							<tr>
								<td>
									<h6>Name</h6>
								</td>
								<td>
									<label>{modalBody.employeeName}</label>
								</td>
							</tr>
							<tr>
								<td>
									<h6>Email</h6>
								</td>
								<td>
									<label style={{ hyphens: "auto", wordBreak: "break-word" }}>
										{modalBody.employeeEmail}
									</label>
								</td>
							</tr>
							<tr>
								<td>
									<h6>Joined On</h6>
								</td>
								<td>
									<label>{datePipe(modalBody.employeeJoinedOn)}</label>
								</td>
							</tr>
							<tr>
								<td>
									<h6>Left On</h6>
								</td>
								<td>
									<label>
										{modalBody.employeeLeftOn
											? datePipe(modalBody.employeeLeftOn)
											: "-"}
									</label>
								</td>
							</tr>
							<tr>
								<td>
									<h6>Vendors</h6>
								</td>
								<td>
									<label>
										{modalBody.tags &&
											modalBody.tags.map(ele => {
												return (
													<span
														className={`label label-lg label-light-${
															ele === "AWS"
																? "warning"
																: ele === "azure"
																? "info"
																: "primary"
														} label-inline ml-3`}
													>
														{ele === "AWS"
															? "AWS"
															: ele === "azure"
															? "Azure"
															: "GCP"}
													</span>
												);
											})}
									</label>
								</td>
							</tr>
							<tr>
								<td>
									<h6 className="mt-4">Certifications</h6>
								</td>
								<td>
									<label>
										{modalBody?.employeeCertifications &&
											modalBody?.employeeCertifications.map(ele => {
												return (
													<div
														className={`mt-3 text-${
															moment(ele?.validity).isBefore(moment())
																? "danger"
																: ""
														}`}
													>
														{ele?.name?.certificationName}{" "}
														{moment(ele?.validity).isBefore(moment())
															? "(Expired)"
															: ""}
													</div>
												);
											})}
									</label>
								</td>
							</tr>
							<tr>
								<td>
									<h6>Comments</h6>
								</td>
								<td>
									<label>
										{modalBody.employeeComments
											? modalBody.employeeComments
											: "-"}
									</label>
								</td>
							</tr>
							<tr>
								<td>
									<h6>Active</h6>
								</td>
								<td>
									<span
										className={`label label-lg label-inline label-light-${
											modalBody.employeeIsActive ? "success" : "danger"
										}`}
									>
										{modalBody.employeeIsActive ? "Active" : "Inactive"}
									</span>
								</td>
							</tr>
						</tbody>
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
				</Modal.Footer>
			</Modal>
			{/* upload csv moal */}
			<Modal size="lg" show={csvModal} onHide={showCSVModal}>
				<Modal.Header closeButton>
					<Modal.Title>Certificates Details</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Upload File *</Form.Label>
							<Form.Control
								type="file"
								name="fileUpload"
								onChange={e => onChangeFile(e)}
								value={formData.fileUpload}
							></Form.Control>
							{csvError ? (
								<Form.Label className="text-danger text-sm-left mt-2">
									{csvError}
								</Form.Label>
							) : null}
						</Form.Group>
					</Form>
					{/* <p>
						Note: Marked * are the required fields. To import Leads into the
						system, please read the following instructions:
					</p> */}
					{/* <ul className="text-muted">
						<li>Download the Sample File for import</li>
						<li>
							You may open the file using Microsoft Excel or any other
							spreadhseet program
						</li>
						<li>
							In the sample file, ensure the entries you wish to import are
							entered from the second(2nd) row onwards
						</li>
						
					</ul> */}
				</Modal.Body>
				<Modal.Footer>
					<div className="mr-auto">
						<CSVLink
							className="btn btn-light-warning ml-3 csv-btn font-weight-bolder"
							filename={"bulk-cert-employee-sample.csv"}
							data={csvSampleData}
						>
							Sample CSV
						</CSVLink>
					</div>
					<Button
						variant="danger"
						onClick={showCSVModal}
						className="btn btn-light-danger font-weight-bolder mr-5"
					>
						Close
					</Button>

					<Button
						variant="primary"
						onClick={uploadCSV}
						className="btn btn-light-primary font-weight-bolder"
					>
						{csvStatus === Status.pending ? (
							<Spinner animation="border" />
						) : (
							"Upload"
						)}{" "}
					</Button>
				</Modal.Footer>
			</Modal>
			<SnackbarComp
				open={isSuccess}
				message={message}
				variant={variant}
				onClose={e => setSuccess(false)}
			></SnackbarComp>
		</>
	);
}

export default React.memo(CertifiedEmployees);
