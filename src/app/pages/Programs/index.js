import React, { useState, useEffect } from "react";
import { Table, Form, ProgressBar } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Button } from "@material-ui/core";

import _ from "lodash";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";
import { fetchJSON } from "../../../_metronic/_helpers/api";
import SelectPrincipalModal from "./select-principal-modal";
import SelectAssociationModal from "./select-association-modal";
import DeclarationModal from "./declaration-modal";
import DeleteConfirmationModal from "./deleteModal";
import SnackbarComp from "../../Components/SnackbarComp";
import { useSnapshot } from "valtio";
import { valtioState } from "../../App";
import { Status } from "../../../utils/helpers";

const progressInstance = (completed, total) => {
	const now = (completed / total) * 100;
	const label = `${completed}/${total}`;
	return (
		<ProgressBar
			now={completed === 0 ? 100 : now}
			variant={completed === 0 ? "warning" : "info"}
			label={`${label}`}
		/>
	);
};

const completed1 = 2;
const total1 = 5;
const now1 = (completed1 / total1) * 100;
const label1 = `${completed1}/${total1}`;
const progressInstance1 = (
	<ProgressBar now={now1} variant="info" label={`${label1}`} />
);

const completed2 = 6;
const total2 = 10;
const now2 = (completed2 / total2) * 100;
const label2 = `${completed2}/${total2}`;
const progressInstance2 = (
	<ProgressBar now={now2} variant="info" label={`${label2}`} />
);

function Programs() {
	const [showSelectPrincipalModal, setShowSelectPrincipalModal] = useState(
		false
	);
	const [showAssociationModal, setShowAssociationModal] = useState(false);

	const [showDeclarationModal, setShowDeclarationModal] = useState(false);

	const [programs, setPrograms] = useState([]);
	const [programList, setProgramList] = useState([]);
	const [associationAdded, setAssociationAdded] = useState(false);
	const [message, setMessage] = useState(false);
	const [isSuccess, setSuccess] = useState(false);

	const [principals, setPrincipals] = useState([]);

	const [selectedPrincipalId, setSelectedPrincipalId] = useState(null);

	const [deleteModal, setDeleteModal] = useState(false);

	const [program, setProgram] = useState({});

	const [tableData, setTableData] = useState([]);

	const [principalFilters, setPrincipalFilters] = useState("all");

	const [searchFilter, setSearchFilter] = useState("");

	const [declarationTemplate, setDeclarationTemplate] = useState([]);

	const [state, setState] = React.useState({
		checkedA: true,
		checkedB: true,
	});
	const [resStatus, setResStatus] = useState(Status.idle);

	const getProgramsList = async () => {
		setPrograms([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		let params = principalFilters ? "?principal=" + principalFilters : "";
		params += searchFilter ? "&programName=" + searchFilter : "";
		try {
			setResStatus(Status.pending);
			const res = await fetchJSON(
				BASE_URL +
					"/dashboard/myorg/associations/programs/" +
					partnerId +
					params
			);
			if (res !== "Error!") {
				setResStatus(Status.resolved);

				let newresponse = [];
				res.map(async item => {
					if (item !== null) {
						let declaration = 0;
						if (
							item.declarationTemplate !== null &&
							item.declarationTemplate !== undefined
						) {
							if (
								item.declarations !== null &&
								item.declarations !== undefined
							) {
								item.declarations.template.map(template => {
									if (template.userValue) declaration++;
								});
							}
							item[`declarationCount`] = declaration;
							item[`declarationMaxCount`] = item.declarationTemplate.length;
						} else {
							item[`declarationCount`] = 0;
							item[`declarationMaxCount`] = 1;
						}
						newresponse.push(item);
					}
				});
				if (principalFilters === "all" && searchFilter === "") {
					setProgramList(newresponse);
				}
				setPrograms(newresponse);
				setTableData(newresponse);
			}
		} catch (error) {
			console.log("errrrrrtor", error);
			setResStatus(Status.rejected);
		}
	};

	console.log("sttttatus", resStatus, tableData);

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
		} catch (error) {
			console.log(error);
		}
	};

	const showDeclaration = (e, item = {}) => {
		setProgram(item);
		if (item.declarations !== null && item.declarations !== undefined) {
			setDeclarationTemplate(item.declarations.template);
		} else if (
			item.declarationTemplate !== null &&
			item.declarationTemplate !== undefined
		) {
			setDeclarationTemplate(item.declarationTemplate);
		} else {
			setDeclarationTemplate([]);
		}
		setShowDeclarationModal(!showDeclarationModal);
	};

	const onDeclarationChange = (event, index, id) => {
		let arr = declarationTemplate.map(a => {
			return { ...a };
		});
		arr.find(a => a.uuid == id).userValue = event.target.checked;
		setDeclarationTemplate(arr);
	};

	const showDeleteModal = (value, item = {}) => {
		setProgram(item);
		setDeleteModal(value);
	};

	const handleShowAssociationModal = value => {
		setShowAssociationModal(value);
	};

	const handleShowSelectPrincipalModal = value => {
		setShowSelectPrincipalModal(value);
	};

	const setSearch = e => {
		setSearchFilter();
		if (e === "") {
			setTableData(programs);
		} else {
			//This needs to more accurate
			let filteredData = programs.filter(ele =>
				JSON.stringify(ele)
					.toLowerCase()
					.includes(e.toLowerCase())
			);
			setTableData(filteredData);
		}
	};

	useEffect(() => {
		getPrincipals();
		getProgramsList();
	}, []);

	useEffect(() => {
		if (searchFilter || principalFilters) {
			getProgramsList();
		}
	}, [searchFilter, principalFilters]);

	useEffect(() => {
		if (associationAdded) {
			getProgramsList();
			setSuccess(true);
			setMessage("Added Successfully");
		}
		setAssociationAdded(false);
	}, [associationAdded]);

	const snap = useSnapshot(valtioState);

	return (
		<div className="card-box">
			<div className="card">
				<div className="card-body">
					<div className="row">
						<div className="col-lg-12">
							<div className="d-flex justify-content-between">
								<h4>Programs</h4>
								<Button
									className="btn btn-light-primary font-weight-bolder"
									onClick={() => handleShowSelectPrincipalModal(true)}
								>
									ADD +
								</Button>
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
											// value={searchFilter}
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
												<th className="table-text" style={{ minWidth: 400 }}>
													Program{" "}
												</th>
												<th className="table-text" width="200">
													Declaration (s){" "}
												</th>

												<th className="table-text" style={{ minWidth: 130 }}>
													Compliance{" "}
												</th>
												<th className="table-text text-center">Actions </th>
											</tr>
										</thead>
										<tbody>
											{tableData.length > 0 && resStatus === Status.resolved
												? tableData.map(item => {
														return (
															<tr>
																<td
																	style={{ cursor: "pointer", minWidth: 400 }}
																	onClick={() =>
																		window.open(
																			"/program-definiton/" +
																				item.associationId +
																				"/" +
																				item.programId +
																				"/" +
																				item.programName,
																			"_blank"
																		)
																	}
																>
																	{item.programName}
																</td>

																<td>
																	<div className="row">
																		<div className="col-lg-3 p-0">
																			{snap.navRoles?.partnerInformation
																				?.edit ? (
																				<a
																					title="Edit Declaration"
																					className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
																				>
																					<span
																						className="svg-icon svg-icon-md svg-icon-primary"
																						onClick={e =>
																							showDeclaration(e, item)
																						}
																					>
																						<SVG
																							title="Edit Declaration"
																							src={toAbsoluteUrl(
																								"/media/svg/icons/Communication/Write.svg"
																							)}
																						/>
																					</span>
																				</a>
																			) : null}
																		</div>
																		<div className="col-lg-8 mt-3 p-0">
																			{progressInstance(
																				item.declarationCount,
																				item.declarationMaxCount
																			)}
																		</div>
																	</div>
																</td>

																<td style={{ cursor: "pointer" }}>
																	{item.is_compliant ? (
																		<span
																			className="label label-lg label-light-success label-inline"
																			onClick={() =>
																				window.open(
																					"/program-definiton/" +
																						item.associationId +
																						"/" +
																						item.programId +
																						"/" +
																						item.programName,
																					"_blank"
																				)
																			}
																		>
																			Compliant
																		</span>
																	) : (
																		<span
																			className="label label-lg label-light-danger label-inline"
																			onClick={() =>
																				window.open(
																					"/program-definiton/" +
																						item.associationId +
																						"/" +
																						item.programId +
																						"/" +
																						item.programName,
																					"_blank"
																				)
																			}
																		>
																			Not Compliant
																		</span>
																	)}
																</td>
																<td className="text-center">
																	<a
																		title="Delete Program"
																		className="btn btn-icon btn-light btn-hover-danger btn-sm"
																	>
																		<span className="svg-icon svg-icon-md svg-icon-danger">
																			<SVG
																				title="Delete Program"
																				src={toAbsoluteUrl(
																					"/media/svg/icons/General/Trash.svg"
																				)}
																				onClick={e =>
																					showDeleteModal(true, item)
																				}
																			/>
																		</span>
																	</a>
																</td>
															</tr>
														);
												  })
												: resStatus === Status.resolved
												? "no results found"
												: null}
										</tbody>
									</div>
								</Table>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Select Principal Modal */}
			{showSelectPrincipalModal ? (
				<SelectPrincipalModal
					principals={principals}
					setSelectedPrincipal={e => setSelectedPrincipalId(e)}
					onClose={() => {
						handleShowSelectPrincipalModal(false);
					}}
					onNext={() => {
						handleShowSelectPrincipalModal(false);
						handleShowAssociationModal(true);
					}}
				/>
			) : null}

			{/* Association Modal */}
			{showAssociationModal ? (
				<SelectAssociationModal
					principalId={selectedPrincipalId}
					programs={programList}
					onClose={() => {
						handleShowAssociationModal(false);
					}}
					associationAdded={() => {
						handleShowAssociationModal(false);
						setAssociationAdded(true);
					}}
				/>
			) : null}

			{/* Show declaration Modal */}
			{showDeclarationModal ? (
				<DeclarationModal
					program={program}
					declarationTemplate={declarationTemplate}
					onClose={() => {
						showDeclaration();
					}}
					onDeclarationChange={(event, index, id) => {
						onDeclarationChange(event, index, id);
					}}
					onSubmit={() => {
						setSuccess(true);
						setMessage("Updated Successfully");
						getProgramsList();
						showDeclaration();
					}}
				/>
			) : null}

			{/* Delete confirmation Modal */}

			{deleteModal ? (
				<DeleteConfirmationModal
					program={program}
					onClose={() => {
						showDeleteModal(false);
					}}
					onSubmit={() => {
						getProgramsList();
						showDeleteModal(false);
						setSuccess(true);
						setMessage("Deleted Successfully");
					}}
				/>
			) : null}

			{/* Toaster message */}
			<SnackbarComp
				open={isSuccess}
				message={message}
				onClose={e => setSuccess(false)}
			></SnackbarComp>
		</div>
	);
}

export default Programs;
