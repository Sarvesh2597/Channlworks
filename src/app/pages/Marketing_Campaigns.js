import React, { useState, useEffect } from "react";
import { Table, Form, Modal } from "react-bootstrap";
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
import _ from "lodash";
import moment from "moment";
import { CSVLink } from "react-csv";
import SnackbarComp from "../Components/SnackbarComp";
import { datePipe } from "../../_metronic/_helpers/date-pipe";
import SkeletonComp from "../Components/SkeletonComp";
import DataTable from "../Components/DataTable";
import Skeleton from "@material-ui/lab/Skeleton";

export function Marketing_Campaigns() {
	const currency =
		JSON.parse(localStorage.getItem("user-details"))?.Partner?.Currency
			?.currencyCode === "USD" ? (
			"$"
		) : (
			<span className="rupee-symbol">₹</span>
		);
	const tableCurrency =
		JSON.parse(localStorage.getItem("user-details"))?.Partner?.Currency
			?.currencyCode === "USD"
			? "$"
			: "₹";

	const [show, setShow] = useState(false);

	const [isEdit, setIsEdit] = useState(false);

	const [budget, setBudget] = useState();

	const [principalFunding, setPrincipalFunding] = useState();

	const [selfValue, setSelfValue] = useState();

	const [list, setList] = useState([]);

	const [formData, setFormData] = useState({});

	const [principals, setPrincipals] = useState([]);

	// const [activeSort, setActiveSort] = useState('');
	// const [sortType, setSortType] = useState(true);

	const [tableData, setTableData] = useState([]);

	const [principalFilters, setPrincipalFilters] = useState("all");

	const [quarterFilter, setQuarterFilter] = useState("");

	const [programFilter, setProgramFilter] = useState(moment().year());
	const [csvData, setCSVData] = useState([]);

	const [isSuccess, setSuccess] = useState(false);
	const [message, setMessage] = useState(false);

	const [loader, setLoader] = useState(false);

	const handleShow = () => {
		setShow(!show);
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

	const getMarketingList = async () => {
		setLoader(true);
		setList([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		let params = principalFilters ? "/" + principalFilters : "";
		params += programFilter ? "?expenseYear=" + programFilter : "";

		try {
			const res = await fetchJSON(
				BASE_URL + "/dashboard/marketing/partner/" + partnerId + params
			);

			if (res !== "Error!") {
				const result = _.filter(
					res,
					({ marketingQuarter }) => marketingQuarter !== null
				);
				setList(result);
				setTableData(res);
				const csvData = [];
				res.map((item, i) => {
					csvData.push({
						"SL.No": i + 1,
						Name: item.activityName,
						Year: item.marketingYear,
						Qtr: item.marketingQuarter,
						"Start Date": datePipe(item.startDate),
						"End Date": datePipe(item.endDate),
						["Budget (" + tableCurrency + ")"]: item.marketingBudget,
						["Principal (" + tableCurrency + ")"]: item.marketingSpend,
						["Self (" + tableCurrency + ")"]: item.marketingAmountSelf,
						"Added On": datePipe(item.createdAt),
					});
				});

				setCSVData(csvData);

				let tempBudgetValue = 0;
				let tempPrincipalValue = 0;
				let tempSelfValue = 0;

				for (let i = 0; i < res.length; i++) {
					tempBudgetValue = tempBudgetValue + res[i].marketingBudget;
					tempPrincipalValue = tempPrincipalValue + res[i].marketingSpend;
					tempSelfValue = tempSelfValue + res[i].marketingAmountSelf;
				}

				setBudget(tempBudgetValue);
				setPrincipalFunding(tempPrincipalValue);
				setSelfValue(tempSelfValue);
				setLoader(false);
			}
		} catch (error) {
			console.log("$$$$$$$$$$$$$$$$$$$44", error);
		}
	};

	const addCampaign = async () => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;

		const userId = JSON.parse(user).id;

		const objToSend = {
			marketingBudget: formData.budget,
			marketingSpend: formData.principalAmount,
			marketingAmountSelf: formData.selfAmount,
			activityName: formData.campaignName,
			startDate: formData.startDate,
			endDate: formData.endDate,
			year: formData.year,
			quarter: formData.quarter,
			marketingComments: formData.comments,
			principalId: Number(formData.principal),
			marketingPartnerId: partnerId,
			marketingPrincipalId: Number(formData.principal),
			addByUser: userId,
		};
		try {
			const res = await fetchJSON(BASE_URL + "/dashboard/marketing", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(objToSend),
			});
			if (res) {
				getMarketingList();
				setShow(!show);
				setSuccess(true);
				setMessage("Added Successfully");
			}
		} catch (error) {}
	};

	const updateCampaign = async () => {
		const user = localStorage.getItem("user-details");
		const userId = JSON.parse(user).id;

		const objToSend = {
			id: formData.id,
			marketingBudget: formData.budget,
			marketingSpend: formData.principalAmount,
			marketingAmountSelf: formData.selfAmount,
			activityName: formData.campaignName,
			startDate: formData.startDate,
			endDate: formData.endDate,
			year: formData.year,
			quarter: formData.quarter,
			marketingComments: formData.comments,
			principalId: Number(formData.principal),
			marketingPartnerId: formData.partnerId,
			addByUser: userId,
		};
		try {
			const res = await fetchJSON(BASE_URL + "/dashboard/marketing", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(objToSend),
			});
			if (res) {
				getMarketingList();
				setShow(!show);
				setSuccess(true);
				setMessage("Updated Successfully");
			}
		} catch (error) {}
	};

	const handleRowClick = item => {
		setIsEdit(true);
		setFormData({
			id: item.id,
			campaignName: item.activityName,
			budget: item.marketingBudget,
			principalAmount: item.marketingSpend,
			selfAmount: item.marketingAmountSelf,
			startDate: item.startDate,
			endDate: item.endDate,
			year: item.marketingYear,
			quarter: item.marketingQuarter,
			comments: item.marketingComments,
			principal: item.principalId,
			partnerId: item.marketingPartnerId,
		});
		setShow(true);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (isEdit) {
			updateCampaign();
		} else {
			addCampaign();
		}
	};

	useEffect(() => {
		getMarketingList();
		getPrincipals();
	}, []);

	useEffect(() => {
		if (programFilter || principalFilters) {
			getMarketingList();
		}
	}, [programFilter, principalFilters]);

	useEffect(() => {
		if (quarterFilter !== "") {
			setTableData(
				list.filter(item => item.marketingQuarter === quarterFilter)
			);
		} else {
			setTableData(list);
		}
	}, [quarterFilter]);

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

	const Columns = [
		{
			label: "Name",
			key: "activityName",
			isSort: true,
		},
		// {
		//   label: "YEAR",
		//   key: "marketingYear",
		//   isSort:true
		// },
		// {
		//   label: "QTR",
		//   key: "marketingQuarter",
		//   isSort:true
		// },
		{
			label: "START DATE",
			key: "startDate",
			minWidth: 100,
			isDate: true,
		},
		{
			label: "END DATE",
			key: "endDate",
			minWidth: 100,
			isDate: true,
		},
		{
			label: "BUDGET",
			key: "marketingBudget",
			minWidth: 130,
			isSort: true,
			isLocaleValue: true,
			isCurrency: true,
		},
		{
			label: "VENDOR",
			key: "marketingSpend",
			isSort: true,
			minWidth: 130,
			isLocaleValue: true,
			isCurrency: true,
		},
		{
			label: "SELF",
			key: "marketingAmountSelf",
			isSort: true,
			minWidth: 80,
			isLocaleValue: true,
			isCurrency: true,
		},
		{
			label: "ADDED ON",
			key: "createdAt",
			isDate: true,
			isSort: true,
		},
	];
	return (
		<>
			<Card className="card-box expand-card">
				<CardHeader title="Marketing Campaigns">
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
							className="btn btn-light-warning ml-3 csv-btn font-weight-bolder"
							filename={"camapaigns.csv"}
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
									<Form.Label>Vendor</Form.Label>
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
						<div className="col-lg-3">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Label>Proposed Year</Form.Label>
									<Form.Control
										as="select"
										value={programFilter}
										onChange={e => setProgramFilter(e.target.value)}
									>
										<option value="all" disabled>
											Select Year
										</option>
										<option value="2022">2022</option>
										<option value="2021">2021</option>
										<option value="2020">2020</option>
										<option value="2019">2019</option>
										<option value="2018">2018</option>
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-3">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Label>Quarter</Form.Label>
									<Form.Control
										as="select"
										value={quarterFilter}
										onChange={e => setQuarterFilter(e.target.value)}
									>
										<option value="" className="default-option">
											Select Quarter
										</option>
										<option value="Quarter 1">Quarter 1</option>
										<option value="Quarter 2">Quarter 2</option>
										<option value="Quarter 3">Quarter 3</option>
										<option value="Quarter 4">Quarter 4</option>
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
					</div>

					<div className="row">
						<div
							className="col-lg-2 bg-light-danger px-6 rounded-xl mr-7 mb-7"
							// style={{ height: "100px" }}
						>
							<div className="mt-8">
								<h3 className="text-danger text-center font-size-15">
									{/* {console.log(
										list.map(
											res =>
												moment(res.endDate).isAfter(moment()) &&
												moment(res.startDate).isBefore(moment())
										)
									)} */}
									{loader
										? 0
										: list
												.map(
													res =>
														moment(res.endDate).isAfter(moment()) &&
														moment(res.startDate).isBefore(moment())
												)
												.filter(e => e === true).length}
								</h3>
								<div className="text-center">
									<label className="text-danger">Active Campaigns</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-primary px-6 rounded-xl mr-7 mb-7"
							// style={{ height: "100px" }}
						>
							<div className="mt-8">
								<h3 className="text-primary text-center font-size-15">
									{loader ? 0 : list.length}
								</h3>
								<div className="text-center">
									<label className="text-primary">Total Campaigns</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-success px-6 rounded-xl mr-7 mb-7"
							// style={{ height: "100px" }}
						>
							<div className="mt-8">
								<h3 className="text-success text-center font-size-15">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{loader ? 0 : budget && budget}
								</h3>
								<div className="text-center mb-5">
									<label className="text-success">Total Budgeted MDF</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-info px-6 rounded-xl mr-7 mb-7"
							// style={{ height: "100px" }}
						>
							<div className="mt-8">
								<h3 className="text-info text-center font-size-15">
									{currency}
									{loader ? 0 : principalFunding && principalFunding}
								</h3>
								<div className="text-center">
									<label className="text-info">Total Vendor Funding</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-warning px-6 rounded-xl mr-7 mb-7"
							// style={{ height: "100px" }}
						>
							<div className="mt-8">
								<h3 className="text-warning text-center font-size-15">
									{currency}
									{loader ? 0 : selfValue && selfValue}
								</h3>
								<div className="text-center">
									<label className="text-warning">Total Self Funding</label>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-3  row">
						<div className="col-lg-10">
							<Form.Control
								required
								type="text"
								placeholder="Search..."
								onChange={e => setSearch(e.target.value)}
							/>
						</div>
					</div>
				</div>
				<DataTable
					columns={Columns}
					data={tableData}
					loader={loader}
					func={handleRowClick}
				/>
			</Card>

			{/* MODAL STARTS HERE*/}

			<Modal size="lg" show={show} onHide={handleShow}>
				<Form onSubmit={handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Campaign</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Campaign Name *</Form.Label>
							<Form.Control
								type="text"
								required
								name="campaignName"
								onChange={e =>
									setFormData({ ...formData, campaignName: e.target.value })
								}
								value={formData.campaignName}
							/>
						</Form.Group>

						<Form.Group controlId="validationCustom02">
							<Form.Label>Start Date *</Form.Label>

							<Form.Control
								required
								type="date"
								max={
									formData.endDate
										? moment(formData.endDate).format("YYYY-MM-DD")
										: ""
								}
								placeholder="Start Date"
								name="startDate"
								onChange={e =>
									e.target.value && moment(e.target.value).isAfter(moment())
										? setFormData({
												...formData,
												selfAmount: 0,
												principalAmount: 0,
												startDate: e.target.value,
										  })
										: setFormData({ ...formData, startDate: e.target.value })
								}
								value={formData.startDate}
							/>
						</Form.Group>

						<Form.Group controlId="validationCustom02">
							<Form.Label>End Date *</Form.Label>

							<Form.Control
								required
								type="date"
								min={
									formData.startDate
										? moment(formData.startDate).format("YYYY-MM-DD")
										: ""
								}
								placeholder="End Date"
								name="endDate"
								disabled={formData.startDate ? false : true}
								onChange={e =>
									setFormData({ ...formData, endDate: e.target.value })
								}
								value={formData.endDate}
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlSelect2">
							<Form.Label>Year *</Form.Label>
							<Form.Control
								required
								as="select"
								name="year"
								onChange={e =>
									setFormData({ ...formData, year: e.target.value })
								}
								value={formData.year}
							>
								<option>Select Year</option>
								<option>2022</option>
								<option>2021</option>
								<option>2020</option>
								<option>2019</option>
								<option>2018</option>
							</Form.Control>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Quarter *</Form.Label>
							<Form.Control
								as="select"
								required
								name="quarter"
								onChange={e =>
									setFormData({ ...formData, quarter: e.target.value })
								}
								value={formData.quarter}
							>
								<option selected="true" disabled="disabled">
									Select Quarter
								</option>
								<option>Quarter 1</option>
								<option>Quarter 2</option>
								<option>Quarter 3</option>
								<option>Quarter 4</option>
							</Form.Control>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Vendor *</Form.Label>
							<Form.Control
								as="select"
								required
								name="principal"
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
							<Form.Label>Activity Budget ({currency}) *</Form.Label>

							<Form.Control
								type="number"
								placeholder=""
								required
								name="budget"
								onChange={e =>
									setFormData({ ...formData, budget: e.target.value })
								}
								value={formData.budget}
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Amount Vendor *</Form.Label>

							<Form.Control
								type="number"
								placeholder=""
								required
								name="principalAmount"
								onChange={e =>
									setFormData({ ...formData, principalAmount: e.target.value })
								}
								value={formData.principalAmount}
								disabled={
									formData.startDate
										? moment(formData.startDate).isAfter(moment())
										: false
								}
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Amount Self ({currency}) *</Form.Label>

							<Form.Control
								type="number"
								placeholder=""
								required
								name="selfAmount"
								onChange={e =>
									setFormData({ ...formData, selfAmount: e.target.value })
								}
								value={formData.selfAmount}
								disabled={
									formData.startDate
										? moment(formData.startDate).isAfter(moment())
										: false
								}
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlTextarea1">
							<Form.Label>Comment</Form.Label>
							<Form.Control
								as="textarea"
								rows="3"
								name="comments"
								onChange={e =>
									setFormData({ ...formData, comments: e.target.value })
								}
								value={formData.comments}
							/>
						</Form.Group>
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
