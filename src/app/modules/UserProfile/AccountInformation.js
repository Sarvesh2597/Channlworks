/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import * as auth from "../Auth";
import {
	Table,
	Modal,
	Form,
	Button,
	OverlayTrigger,
	Tooltip,
	Popover,
	Spinner,
} from "react-bootstrap";
import { CSVLink } from "react-csv";

import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";
import SkeletonComp from "../../Components/SkeletonComp";
import Skeleton from "@material-ui/lab/Skeleton";
import { Status } from "../../../utils/helpers";
import SnackbarComp from "../../Components/SnackbarComp";

function AccountInformation() {
	const [employees, setEmployees] = useState([]);
	const [profile, setProfile] = useState([]);
	const [modal, setModal] = useState(false);
	const [title, setTitle] = useState("");
	const [formData, setFormData] = useState([]);
	const [selectedEmployee, setSelectedEmployee] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [loader, setLoader] = useState(false);
	const [show, setShow] = useState(false);
	const [isPopover, setPopOver] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	//csv
	//csv handle
	const [status, setStatus] = useState(Status.idle);
	const [uploadCSVFile, setUploadCSVFile] = useState();
	const [csvError, setCSVError] = useState("");

	const [isSuccess, setSuccess] = useState(false);
	const [message, setMessage] = useState(false);
	const [variant, setVariant] = useState("success");

	const csvSampleData = [
		[
			"employeeName",
			"employeeJoinedOn",
			"employeeLeftOn",
			"employeeEmail",
			"employeeComments",
		],
		["john", "23-12-2020", "30-11-2020", "john@test.com", "loremipsome"],
	];

	const clickHandle = () => {
		this.handleRequestClose();
	};

	const handleRequestClose = () => {
		setPopOver(false);
	};

	const handleTouchTap = event => {
		// This prevents ghost click.
		event.preventDefault();
		setPopOver(true);
		setAnchorEl(event.currentTarget);
	};

	const popover = (
		<Popover id="popover-basic" show={isPopover}>
			<Popover.Content>
				<Form>
					<Form.Group controlId="exampleForm.ControlInput1">
						<Form.Control
							type="number"
							defaultValue={setTitle}
							onChange={event => setTitle(event.target.value)}
						/>
					</Form.Group>
				</Form>
				<div className="d-flex justify-content-center">
					<Button
						size="sm"
						className="btn btn-light-danger mr-2"
						onClick={e => document.body.click()}
					>
						Cancel
					</Button>
					<Button
						size="sm"
						className="btn btn-light-primary"
						onClick={e => updateTotalEmployee()}
					>
						Save
					</Button>
				</div>
			</Popover.Content>
		</Popover>
	);

	const showModal = () => {
		setModal(!modal);
	};

	const handleShow = () => {
		setShow(!show);
	};

	const getEmployeesList = async () => {
		setLoader(true);
		setEmployees([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		console.log("hi");
		const res = await fetchJSON(
			BASE_URL + "/dashboard/uploaded-employees/partner/" + partnerId
		);
		if (res) {
			//console.log(res);
			setEmployees(res);
			setTableData(res);
			setLoader(false);
		}
	};

	useEffect(() => {
		getEmployeesList();
		getProfileList();
	}, []);

	const getProfileList = async () => {
		setProfile([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(BASE_URL + "/dashboard/profile");
		if (res) {
			setProfile(res);
		}
	};

	const searchUnassigned = e => {
		if (e === "") {
			setTableData(employees);
		} else {
			//This needs to more accurate
			let filteredData = employees.filter(ele =>
				JSON.stringify(ele)
					.toLowerCase()
					.includes(e.toLowerCase())
			);
			setTableData(filteredData);
		}
	};

	const addEmployees = async () => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;

		const objToSend = [
			...selectedEmployee.map(item => {
				return {
					...employees.find(ele => ele.id === item),
					principalIds: formData.join(","),
					selected: true,
				};
			}),
		];

		const res = await fetchJSON(
			BASE_URL + "/dashboard/myorg/bulk-employee-principal-associations",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(objToSend),
			}
		);
		if (res) {
			setSelectedEmployee([]);
			setFormData([]);
			getEmployeesList();
			setModal(!modal);
		}
	};

	const updateTotalEmployee = async () => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(
			BASE_URL + "/dashboard/" + partnerId + "/total-employees",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					totalEmployees: title,
				}),
			}
		);
		if (res) {
			document.body.click();
			// getEmployeesList();
			getProfileList();
		}
	};

	const onChangeFile = event => {
		setUploadCSVFile(event.target.files[0]);
		setCSVError("");
	};

	const uploadCSV = async () => {
		if (!uploadCSVFile) {
			setCSVError("Please select file");
			return;
		}

		setStatus(Status.pending);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const formData = new FormData();

		formData.append("file", uploadCSVFile);

		try {
			const res = await fetchJSON(
				BASE_URL + "/dashboard/bulk/employees" + "/" + partnerId,
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
				setStatus(Status.resolved);
				getEmployeesList();
				handleShow();
				setUploadCSVFile("");
			}
		} catch (error) {
			setStatus(Status.rejected);
		}
	};

	return (
		<div className="card-box2">
			<form className="card card-custom">
				<div className="card-header py-3">
					<div className="card-title align-items-start flex-column">
						<h3 className="card-label font-weight-bolder text-dark mt-3">
							Employees
						</h3>
					</div>
					<div className="card-toolbar">
						<Button
							className="btn btn-primary mr-2"
							onClick={e => handleShow()}
						>
							Upload CSV
						</Button>
					</div>
				</div>

				<div className="card-spacer mt-4 bg-white">
					<div className="row">
						<div
							className="col-lg-3 bg-light-primary px-6 rounded-xl mr-7 mb-7"
							style={{ height: "100px" }}
						>
							<div className="mt-8 text-center">
								<OverlayTrigger
									trigger="click"
									placement="top"
									overlay={popover}
									show={isPopover}
									rootClose
								>
									<h3
										className="text-primary font-size-15"
										style={{ cursor: "pointer" }}
										onClick={e => handleTouchTap(e)}
									>
										{loader ? 0 : profile.partnerTotalEmployees}
									</h3>
								</OverlayTrigger>

								<label className="text-primary">Declared Employees</label>
							</div>
						</div>

						<div
							className="col-lg-3 bg-light-success px-6 rounded-xl mr-7 mb-7"
							style={{ height: "100px" }}
						>
							<div className="mt-8 text-center">
								<h3 className="text-success font-size-15">
									{loader
										? 0
										: employees.filter(
												ele => ele.employeeAssignStatus === false
										  ).length}
								</h3>
								<label className="text-success ">Unassigned Employees</label>
							</div>
						</div>
						<div
							className="col-lg-3 bg-light-warning px-6 rounded-xl mr-7 mb-7"
							style={{ height: "100px" }}
						>
							<div className="mt-8 text-center">
								<h3 className="text-warning  font-size-15">
									{loader
										? 0
										: employees.filter(ele => ele.employeeAssignStatus === true)
												.length}
								</h3>
								<label className=" text-warning ">Assigned Employees</label>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12">
							<input
								type="text"
								className="form-control"
								name="searchText"
								placeholder="Search..."
								onChange={e => searchUnassigned(e.target.value)}
							/>
						</div>
					</div>

					<div className="row">
						<div className="col-lg-12">
							<div className="my-7"></div>
							<h4>Unassigned Employees</h4>
							<Button
								className="btn btn-info mr-2 mb-2 text-right"
								onClick={showModal}
								disabled={
									tableData.filter(
										ele =>
											ele.employeeAssignStatus === false ||
											ele.employeeAssignStatus === null
									).length <= 0 || selectedEmployee.length <= 0
								}
							>
								Assign Vendor
							</Button>
							<div className="table-container">
								<Table bordered>
									<div className="table-body" style={{ maxWidth: "53vw" }}>
										<thead>
											<tr>
												<th style={{ minWidth: 30 }}>Assign</th>
												<th>Name</th>
												<th>Certifications</th>
												<th width="90">Joined On</th>
												{/* <th width="90">Left On</th> */}
												<th>Email</th>
												<th
													style={{
														textAlign: "center",
													}}
												>
													Status
												</th>
												{/* <th>Comments</th> */}
											</tr>
										</thead>
										<tbody>
											{loader ? (
												<SkeletonComp rows={8} columns={8}></SkeletonComp>
											) : (
												<React.Fragment>
													{tableData
														.filter(
															ele =>
																ele.employeeAssignStatus === false ||
																ele.employeeAssignStatus === null
														)
														.map(item => (
															<tr>
																<td className="text-center">
																	<Form.Check
																		type="checkbox"
																		name="select"
																		onChange={e => {
																			if (e.target.checked) {
																				setSelectedEmployee([
																					...selectedEmployee,
																					item.id,
																				]);
																			} else {
																				if (
																					selectedEmployee.includes(item.id)
																				) {
																					let selectedEmployees = [
																						...selectedEmployee,
																					];
																					selectedEmployees.splice(
																						selectedEmployee.indexOf(item.id),
																						1
																					);
																					setSelectedEmployee(
																						selectedEmployees
																					);
																				}
																			}
																		}}
																	/>
																</td>

																<td>{item.employeeName}</td>
																<td>
																	{item.employeeCertifications &&
																		item.employeeCertifications[0]?.name &&
																		item.employeeCertifications[0]?.name
																			.certificationName}
																</td>
																<td>{item.employeeJoinedOn}</td>
																{/* <td>{item.employeeLeftOn}</td> */}
																<td>{item.employeeEmail}</td>
																<td
																	style={{
																		textAlign: "center",
																	}}
																>
																	<span
																		className={`label label-md label-light-${
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
																{/* <td>{item.employeeComments}</td> */}
															</tr>
														))}
												</React.Fragment>
											)}
										</tbody>
									</div>
								</Table>
							</div>
						</div>
					</div>

					<div className="row mt-4">
						<div className="col-lg-12">
							<div className="my-7"></div>
							<h4>Assigned Employees</h4>
							<div className="table-container">
								<Table bordered>
									<div className="table-body" style={{ maxWidth: "53vw" }}>
										<thead>
											<tr>
												<th>Name</th>
												<th>Certifications</th>
												<th
													style={{
														textAlign: "center",
													}}
												>
													Vendors
												</th>
												<th>Joined On</th>
												{/* <th>Left On</th> */}
												<th>Email</th>
												<th
													style={{
														textAlign: "center",
													}}
												>
													Status
												</th>
												{/* <th>Comments</th> */}
											</tr>
										</thead>
										<tbody>
											{loader ? (
												<SkeletonComp rows={8} columns={8}></SkeletonComp>
											) : (
												<React.Fragment>
													{tableData
														.filter(ele => ele.employeeAssignStatus === true)
														.map(item => (
															<tr>
																<td>{item.employeeName}</td>
																<td>
																	{item?.employeeCertifications
																		? item.employeeCertifications[0]?.name &&
																		  item.employeeCertifications[0]?.name
																				.certificationName
																		: null}
																</td>
																<td
																	style={{
																		textAlign: "center",
																	}}
																>
																	{item.tags &&
																		item.tags.map(ele => {
																			return (
																				<span
																					className={`label label-md label-light-${
																						ele === "AWS"
																							? "warning"
																							: ele === "Microsoft Azure"
																							? "info"
																							: "primary"
																					} label-inline ml-3 mb-3`}
																				>
																					{ele === "AWS"
																						? "AWS"
																						: ele === "Microsoft Azure"
																						? "Azure"
																						: "GCP"}
																				</span>
																			);
																		})}
																</td>
																<td>{item.employeeJoinedOn}</td>
																{/* <td>{item.employeeLeftOn}</td> */}
																<td>{item.employeeEmail}</td>
																<td
																	style={{
																		textAlign: "center",
																	}}
																>
																	<span
																		className={`label label-md label-light-${
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
																{/* <td>{item.employeeComments}</td> */}
															</tr>
														))}
												</React.Fragment>
											)}
										</tbody>
									</div>
								</Table>
							</div>
						</div>
					</div>
				</div>
			</form>
			<Modal size="md" centered show={modal} onHide={showModal}>
				<Modal.Header closeButton>
					<Modal.Title>Associate Vendor</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Table>
						<tr>
							<td>
								<b>Vendor Name</b>
							</td>
							<td>
								<b>Assign To</b>
							</td>
						</tr>
						<tr>
							<td>Google Cloud</td>
							<td>
								<Form.Check
									type="checkbox"
									id="1"
									name="googleCloud"
									// checked={formData.gcp}
									onChange={e => {
										if (e.target.checked) {
											setFormData([...formData, 12]);
										} else {
											if (formData.includes(12)) {
												let formDatas = [...formData];
												formDatas.splice(formData.indexOf(12), 1);
												setFormData(formDatas);
											}
										}
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>AWS</td>
							<td>
								<Form.Check
									type="checkbox"
									name="aws"
									id="2"
									// checked={formData.aws}
									onChange={e => {
										if (e.target.checked) {
											setFormData([...formData, 11]);
										} else {
											if (formData.includes(11)) {
												let formDatas = [...formData];
												formDatas.splice(formData.indexOf(11), 1);
												setFormData(formDatas);
											}
										}
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>Microsoft Azure</td>
							<td>
								<Form.Check
									type="checkbox"
									name="azure"
									id="3"
									// checked={formData.azure}
									onChange={e => {
										if (e.target.checked) {
											setFormData([...formData, 13]);
										} else {
											if (formData.includes(13)) {
												let formDatas = [...formData];
												formDatas.splice(formData.indexOf(13), 1);
												setFormData(formDatas);
											}
										}
									}}
								/>
							</td>
						</tr>
					</Table>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="danger"
						onClick={showModal}
						className="btn btn-light-danger font-weight-bolder"
					>
						Close
					</Button>
					<Button
						onClick={addEmployees}
						className="btn btn-light-info font-weight-bolder"
					>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal size="lg" show={show} onHide={handleShow}>
				<Modal.Header closeButton>
					<Modal.Title>Employees Details</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Upload File *</Form.Label>
							<Form.Control
								type="file"
								name="fileUpload"
								onChange={e => onChangeFile(e)}
							></Form.Control>
							{csvError ? (
								<Form.Label className="text-danger text-sm-left mt-2">
									{csvError}
								</Form.Label>
							) : null}
						</Form.Group>
					</Form>
					<p>
						Note: Marked * are the required fields.Please fill the required
						fields before Proceeding
					</p>
					<ul className="text-muted">
						<li>Upload a csv file only</li>
						<li>
							Employee Name, Employee Join Date, Employee Email are the required
							columns
						</li>
					</ul>
				</Modal.Body>
				<Modal.Footer>
					<div className="mr-auto">
						<CSVLink
							className="btn btn-light-warning ml-3 csv-btn font-weight-bolder"
							filename={"bulk-employee-sample.csv"}
							data={csvSampleData}
						>
							Sample CSV
						</CSVLink>
					</div>
					<Button
						variant="danger"
						onClick={handleShow}
						className="btn btn-light-danger font-weight-bolder mr-5"
					>
						Close
					</Button>

					<Button
						variant="primary"
						onClick={uploadCSV}
						className="btn btn-light-primary font-weight-bolder"
					>
						{status === Status.pending ? (
							<Spinner animation="border" />
						) : (
							"Upload"
						)}
					</Button>
				</Modal.Footer>
			</Modal>
			{/* {MODAL 3 ENDS HERE} */}
			{isSuccess && (
				<SnackbarComp
					open={isSuccess}
					message={message}
					variant={variant}
					onClose={e => setSuccess(false)}
				></SnackbarComp>
			)}
		</div>
	);
}

export default connect(null, auth.actions)(AccountInformation);
