import React, { useState, useEffect } from "react";
import { Table, Form, Modal } from "react-bootstrap";
import {
	Card,
	CardBody,
	CardHeader,
	CardHeaderToolbar,
} from "./../../_metronic/_partials/controls";
import {Button} from "@material-ui/core";
import { fetchJSON } from "../../_metronic/_helpers/api";
import { BASE_URL } from "../../_metronic/_constants/endpoints";
import _ from "lodash";
import { CSVLink } from "react-csv";
import SnackbarComp from "../Components/SnackbarComp";
import AutoCompleteInput from "../Components/AutoCompleteInput";
import { datePipe } from "../../_metronic/_helpers/date-pipe";
import SkeletonComp from "../Components/SkeletonComp";
import ArChart from "./AR/ArChart";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

function AR() {
	const tableCurrency =
		JSON.parse(localStorage.getItem("user-details"))?.Partner?.Currency
			?.currencyCode === "USD"
			? "$"
			: "₹";

	const [show, setShow] = useState(false);

	const [list, setList] = useState([]);

	const [purpose, setPurpose] = useState();

	const [formData, setFormData] = useState({});

	const [principals, setPrincipals] = useState([]);

	const [isEdit, setIsEdit] = useState(false);

	const [tableData, setTableData] = useState([]);

	const [principalFilters, setPrincipalFilters] = useState("all");
	const [receivableFilter, setReceivableFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [purposeFilter, setPurposeFilter] = useState("");
	const [resetFilter, setResetFilter] = useState("");

	const [csvData, setCSVData] = useState([]);

	const [payables, setPayables] = useState(0);
	const [receivables, setReceivables] = useState(0);

	const [isSuccess, setSuccess] = useState(false);
	const [message, setMessage] = useState(false);

	const [loader, setLoader] = useState(false);

	const [reference, setReference] = useState([]);

	const handleShow = () => {
		setShow(!show);
	};

	const getReferenceList = async id => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const programFilter = "2021";
		let params = id ? "/" + id : "";
		params += programFilter ? "?expenseYear=" + programFilter : "";
		console.log("hi");
		try {
			const res = await fetchJSON(
				BASE_URL + "/dashboard/marketing/partner/" + partnerId + params
			);
			if (res) {
				setReference(res);
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
				console.log(res);
				const uniquePrincipals = _.uniqBy(res, "principalId");
				setPrincipals(uniquePrincipals);
			}
		} catch (error) {}
	};

	const getARList = async () => {
		setLoader(true);
		setList([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		let params = principalFilters ? "?principal=" + principalFilters : "";
		params += receivableFilter
			? "&registerIsReceivable=" + receivableFilter
			: "";
		params += statusFilter ? "&registerStatus=" + statusFilter : "";
		params += purposeFilter ? "&registerPurpose=" + purposeFilter : "";
		try {
			const res = await fetchJSON(
				BASE_URL +
					"/dashboard/register/partner/" +
					partnerId +
					"/" +
					principalFilters +
					params
			);
			if (res !== "Error!") {
				console.log(res);
				setList(res);
				setTableData([
					...res.map(ele => {
						switch (ele.registerPurpose) {
							case 1:
								ele.purposeName = "Consumption Credits";
								break;
							case 2:
								ele.purposeName = "Professional Services";
								break;
							case 3:
								ele.purposeName = "Coupons/Vouchers";
								break;
							case 4:
								ele.purposeName = "Miscellaneous";
								break;
							case 5:
								ele.purposeName = "Program Fee";
								break;
							case 6:
								ele.purposeName = "Third Party Services";
								break;
							case 7:
								ele.purposeName = "Internal use Software Licenses";
								break;
							case "default":
								ele.purposeName = "";
						}

						return ele;
					}),
				]);
				let newPaybles = 0;
				let newReceivables = 0;
				res.map(item => {
					if (item.registerIsReceivable) {
						console.log("Item From Recievable>>", item);
						newReceivables = newReceivables + item.registerAmount;
					} else {
						// if (item.registerStatus !== 2) {
						newPaybles = newPaybles + item.registerAmount;
						// }
					}
				});
				setPayables(newPaybles);
				setReceivables(newReceivables);
				const csvData = [];
				res.map((item, i) => {
					csvData.push({
						"SL.No": i + 1,
						Purpose:
							item.registerPurpose === 1
								? "Consumption Credits"
								: item.registerPurpose === 2
								? "Professional Services"
								: item.registerPurpose === 3
								? "Coupons/Vouchers"
								: item.registerPurpose === 4
								? "Miscellaneous"
								: item.registerPurpose === 5
								? "Program Fee"
								: item.registerPurpose === 6
								? "Third Party Services"
								: item.registerPurpose === 7
								? "Internal use Software Licenses"
								: "",
						Type: item.registerIsReceivable ? "Receivables" : "Payables",
						["Amount (" + tableCurrency + ")"]: item.registerAmount,
						Status: item.registerStatus == 1 ? "Open" : "Completed",
						Comment: item.registerComment,
						"Payment Reference": item.registerPaymentReference,
						"Added By": item.User.userName,
						"Added On": datePipe(item.createdAt),
					});
				});
				setCSVData(csvData);
				setLoader(false);
			}
		} catch (error) {}
	};

	const addReceivables = async () => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;

		const userId = JSON.parse(user).id;

		const objToSend = {
			registerAmount: formData.amount,
			registerComment: formData.comment,
			registerPaymentReference: formData.reference,
			registerPurpose: formData.purpose,
			registerStatus: formData.status,
			registerPurposeValue: formData.purposeValue,
			registerIsReceivable: formData.receivable,
			registerPartnerId: partnerId,
			registerPrincipalId: Number(formData.principal),
			registerAddedBy: userId,
		};
		const res = await fetchJSON(BASE_URL + "/dashboard/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(objToSend),
		});
		if (res) {
			getARList();
			setShow(!show);
			setSuccess(true);
			setMessage("Added Successfully");
		}
	};

	const updateReceivables = async () => {
		const user = localStorage.getItem("user-details");
		const userId = JSON.parse(user).id;

		const objToSend = {
			id: formData.id,
			registerAmount: formData.amount,
			registerComment: formData.comment,
			registerPaymentReference: formData.reference,
			registerPurpose: formData.purpose,
			registerStatus: formData.status,
			registerPurposeValue: formData.purposeValue,
			registerIsReceivable: formData.receivable,
			registerPartnerId: formData.partnerId,
			registerPrincipalId: Number(formData.principal),
			registerAddedBy: userId,
			User: {
				id: userId,
			},
		};

		const res = await fetchJSON(BASE_URL + "/dashboard/register", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(objToSend),
		});
		if (res) {
			getARList();
			setShow(!show);
			setSuccess(true);
			setMessage("Updated Successfully");
		}
	};

	const handleRowClick = item => {
		setIsEdit(true);
		console.log(item);
		// setPurpose(item.registerPurpose)
		setFormData({
			id: item.id,
			amount: item.registerAmount,
			comment: item.registerComment,
			reference: item.registerPaymentReference,
			purpose: item.registerPurpose,
			status: item.registerStatus,
			purposeValue: item.registerPurposeValue,
			receivable: item.registerIsReceivable,
			partnerId: item.registerPartnerId,
			principal: item.registerPrincipalId,
		});
		setShow(true);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (isEdit) {
			updateReceivables();
		} else {
			addReceivables();
		}
	};

	useEffect(() => {
		getARList();
		getPrincipals();
		// getReferenceList();
	}, []);

	useEffect(() => {
		if (resetFilter === "true") {
			getARList();
			setResetFilter("false");
		}
	}, [resetFilter]);

	const setSearch = e => {
		if (e === "") {
			setTableData(list);
		} else {
			//This needs to more accurate
			let filteredData = list.filter(ele =>
				JSON.stringify(ele)
					.toLowerCase()
					.includes(e.toLowerCase())
			);
			setTableData(filteredData);
		}
	};

	const applyFilter = () => {
		getARList();
	};

	const resetButtonClick = () => {
		setPrincipalFilters("all");
		setPurposeFilter("");
		setStatusFilter("");
		setReceivableFilter("");
		setResetFilter("true");
	};

	return (
		<>
			<Card className="card-box expand-card">
				<CardHeader title="Marketing Receivables/Payables">
					<CardHeaderToolbar>
						<Button
							type="submit"
							className="btn btn-light-primary font-weight-bolder"
							onClick={() => {
								setIsEdit(false);
								setFormData({});
								handleShow();
							}}
						>
							Add +
						</Button>
						<CSVLink
							className="btn btn-light-warning csv-btn ml-3 font-weight-bolder"
							filename={"marketing_ar_ap.csv"}
							data={csvData}
						>
							Export to CSV
						</CSVLink>
					</CardHeaderToolbar>
				</CardHeader>
				<div className="card-spacer bg-white">
					<div className="row">
						<div className="col-lg-6 mt-5">
							<div className="row mt-5">
								<div className="col-lg-6">
									<Form>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Control
												as="select"
												value={principalFilters}
												onChange={e => setPrincipalFilters(e.target.value)}
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
								<div className="col-lg-6">
									<Form>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Control
												as="select"
												value={receivableFilter}
												onChange={e => setReceivableFilter(e.target.value)}
											>
												<option selected="true" value="" disabled="disabled">
													Select Type
												</option>
												<option value="">All</option>

												<option value={"true"}>Receivables</option>
												<option value={"false"}>Payables</option>
											</Form.Control>
										</Form.Group>
									</Form>
								</div>
								<div className="col-lg-6">
									<Form>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Control
												as="select"
												value={statusFilter}
												onChange={e => setStatusFilter(e.target.value)}
											>
												<option selected="true" value="" disabled="disabled">
													Select Status
												</option>
												<option value="">All</option>
												<option value={1}>Open</option>
												<option value={2}>Completed</option>
											</Form.Control>
										</Form.Group>
									</Form>
								</div>
								<div className="col-lg-6">
									<Form>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Control
												as="select"
												value={purposeFilter}
												onChange={e => setPurposeFilter(e.target.value)}
											>
												<option selected="true" value="" disabled="disabled">
													Select Purpose
												</option>
												<option value="">All</option>
												<option value={1}>Consumption Credits</option>
												<option value={2}>Professional Services</option>
												<option value={3}>Coupons/Vouchers</option>
												<option value={4}>Miscellaneous</option>
												<option value={5}>Program Fee</option>
												<option value={6}>Third Party Services</option>
												<option value={7}>
													Internal use Software Licences
												</option>
											</Form.Control>
										</Form.Group>
									</Form>
								</div>
								<div className="col-lg-6">
									<Form.Control
										required
										type="text"
										placeholder="Search..."
										onChange={e => setSearch(e.target.value)}
									/>
								</div>
								<div className="col-lg-6 d-flex justify-content-end mb-3">
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
						</div>
						<div className="col-lg-6 d-flex justify-content-center">
							<ArChart
								data={[
									{ label: "Receivables", value: receivables },
									{ label: "Payables", value: payables },
								]}
							></ArChart>
							{/* <div className="row">
            <div className="col-lg-2 bg-light-primary px-6 rounded-xl mr-7 mb-7">
              <div className="mt-8">
                <h3 className="text-primary text-center font-size-15">
                  {JSON.parse(localStorage.getItem('user-details'))?.Partner?.Currency?.currencyCode === 'USD' ?  '$' : <span className="rupee-symbol">₹</span>}{loader ? 0 :payables.toLocaleString()}
                </h3>
                <div className="text-center mb-5">
                  <label className="text-primary">Total Payables</label>
                </div>
              </div>
            </div>
            <div
              className="col-lg-2 bg-light-info px-6 rounded-xl mr-7 mb-7"
            // style={{ height: "100px" }}
            >
              <div className="mt-8">
                <h3 className="text-info text-center font-size-15">
                  {JSON.parse(localStorage.getItem('user-details'))?.Partner?.Currency?.currencyCode === 'USD' ? '$' : <span className="rupee-symbol">₹</span>}{loader ? 0 :receivables.toLocaleString()}
                </h3>
                <div className="text-center">
                  <label className="text-info">Total Receivables</label>
                </div>
              </div>
            </div>
          </div> */}
						</div>
					</div>

					{/* <div className="mt-3 row">
              <div className="col-lg-10">
                <Form.Control
                  required
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div> */}
				</div>

				<CardBody>
					<div className="table-container">
						<Table>
							<div className="table-body">
								<thead>
									<tr>
										<th className="table-text">Purpose </th>
										<th className="table-text">Type</th>
										<th className="table-text" style={{ minWidth: 120 }}>
											Amount ({" "}
											{JSON.parse(localStorage.getItem("user-details"))?.Partner
												?.Currency?.currencyCode === "USD" ? (
												"$"
											) : (
												<span className="rupee-symbol">₹</span>
											)}
											)
										</th>
										<th className="table-text">Status</th>
										<th className="table-text">Comment</th>
										<th className="table-text" style={{ minWidth: 180 }}>
											Payment Reference
										</th>
										<th className="table-text">Added By</th>
										<th className="table-text" width="100">
											Added On
										</th>
									</tr>
								</thead>
								<tbody>
									{loader ? (
										<SkeletonComp rows={8} columns={8}></SkeletonComp>
									) : (
										<React.Fragment>
											{tableData.length > 0 ? (
												tableData.map(item => {
													return (
														<tr
															style={{ cursor: "pointer" }}
															onClick={e => handleRowClick(item)}
														>
															<td>
																{item.registerPurpose === 1
																	? "Consumption Credits"
																	: item.registerPurpose === 2
																	? "Professional Services"
																	: item.registerPurpose === 3
																	? "Coupons/Vouchers"
																	: item.registerPurpose === 4
																	? "Miscellaneous"
																	: item.registerPurpose === 5
																	? "Program Fee"
																	: item.registerPurpose === 6
																	? "Third Party Services"
																	: item.registerPurpose === 7
																	? "Internal use Software Licenses"
																	: ""}
															</td>
															<td>
																<span
																	className={`label label-lg label-light-${
																		item.registerIsReceivable
																			? "success"
																			: "danger"
																	} label-inline`}
																>
																	{item.registerIsReceivable
																		? "Receivables"
																		: "Payables"}
																</span>
															</td>
															<td>
																{item.registerAmount &&
																	item.registerAmount.toLocaleString()}
															</td>
															<td>
																{item.registerStatus === 2
																	? "Completed"
																	: "Open"}
															</td>
															<td>{item.registerComment}</td>
															<td>{item.registerPaymentReference}</td>
															<td>{item.User.userName}</td>

															<td>{datePipe(item.createdAt)}</td>
														</tr>
													);
												})
											) : (
												<div>No record found</div>
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
						<Modal.Title>Marketing Receivables / Payables</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Vendor *</Form.Label>
							<Form.Control
								as="select"
								name="principal"
								required
								onChange={e => {
									setFormData({ ...formData, principal: e.target.value });
									getReferenceList(e.target.value);
								}}
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
							<Form.Label>
								Amount (
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
								placeholder=""
								name="amount"
								required
								onChange={e =>
									setFormData({ ...formData, amount: e.target.value })
								}
								value={formData.amount}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlTextarea1">
							<Form.Label>Comment</Form.Label>
							<Form.Control
								as="textarea"
								rows="3"
								name="comment"
								onChange={e =>
									setFormData({ ...formData, comment: e.target.value })
								}
								value={formData.comment}
							/>
						</Form.Group>

						{/* <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Reference *</Form.Label>
              <Form.Control
                type="text"
                name="reference"
                required
                onChange={(e) =>
                  setFormData({ ...formData, reference: e.target.value })
                }
                value={formData.reference}
              />
            </Form.Group> */}

						<Form.Group>
							<Form.Label>Reference *</Form.Label>
							{/* <Autocomplete
                multiple
                name="reference"
                options={[
                  ...reference.map((ele) => {
                    return ele.activityName;
                  }),
                ]}
                getOptionLabel={(option) => option}
                onChange={(e, value) =>
                  setFormData({ ...formData, reference: value })
                }
                defaultValue={formData.reference}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    // placeholder="Reference"
                  />
                )}
              /> */}

							<AutoCompleteInput
								defaultValue={formData.reference}
								setValue={e => setFormData({ ...formData, reference: e })}
								suggestions={[
									...reference.map(ele => {
										return ele.activityName;
									}),
								]}
							></AutoCompleteInput>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlSelect2">
							<Form.Label>Purpose *</Form.Label>
							<Form.Control
								as="select"
								name="purpose"
								required
								onChange={e => {
									setPurpose(e.target.value);
									{
										setFormData({ ...formData, purpose: e.target.value });
									}
								}}
								value={formData.purpose}
							>
								<option selected="true" disabled="disabled"></option>
								<option value={1}>Consumption Credit</option>
								<option value={2}>Professional Services</option>
								<option value={3}>Coupons/ Vouchers</option>
								<option value={4}>Miscellaneous</option>
								<option value={5}>Program Fee</option>
								<option value={6}>Third Party Services</option>
								<option value={7}>Internal Use Software Licenses</option>
							</Form.Control>
						</Form.Group>

						{formData.purpose && (
							<Form.Group controlId="exampleForm.ControlSelect2">
								<Form.Control
									as="select"
									name="purposeValue"
									style={
										formData.purpose === "1" ||
										formData.purpose == 1 ||
										formData.purpose === 3 ||
										formData.purpose === "3" ||
										formData.purpose === 7 ||
										formData.purpose === "7"
											? { cursor: "not-allowed" }
											: { cursor: "default" }
									}
									onChange={e =>
										setFormData({ ...formData, purposeValue: e.target.value })
									}
									value={formData.purposeValue}
									disabled={
										formData.purpose === 1 ||
										formData.purpose === "1" ||
										formData.purpose === 3 ||
										formData.purpose === "3" ||
										formData.purpose === 7 ||
										formData.purpose === "7"
									}
								>
									<option selected="true"></option>
									<option>Cash</option>
									<option
										selected={
											formData.purpose === 1 ||
											formData.purpose === "1" ||
											formData.purpose === "1" ||
											formData.purpose === 3 ||
											formData.purpose === "3" ||
											formData.purpose === 7 ||
											formData.purpose === "7"
										}
									>
										Non Cash
									</option>
								</Form.Control>
							</Form.Group>
						)}

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Status *</Form.Label>
							<Form.Control
								as="select"
								name="status"
								required
								onChange={e =>
									setFormData({ ...formData, status: e.target.value })
								}
								value={formData.status}
							>
								<option selected="true" disabled="disabled"></option>
								<option value="1">Open</option>
								<option value="2">Completed</option>
							</Form.Control>
						</Form.Group>

						{/* RADIO BUTTON STARTS */}
						<Form.Label>Type</Form.Label>
						<div key={`default-1`} className="mb-3">
							<Form.Group controlId="exampleForm.ControlInput1">
								<Form.Check
									inline
									type={"radio"}
									name="receivable"
									onChange={e => setFormData({ ...formData, receivable: true })}
									checked={formData.receivable}
									label={`Recievables`}
								/>

								<Form.Check
									inline
									name="receivable"
									onChange={e =>
										setFormData({ ...formData, receivable: false })
									}
									checked={
										(formData.receivable === null) |
										(formData.receivable === false)
									}
									type={"radio"}
									label={`Payables`}
								/>
							</Form.Group>
						</div>
						{/* RADIO BUTTON ENDS */}
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

export default AR;
