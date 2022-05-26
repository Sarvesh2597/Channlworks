import React, { useEffect, useState } from "react";
import { Table, Form, Button } from "react-bootstrap";
// import SVG from "react-inlinesvg";
import {
	Card,
	CardBody,
	CardHeader,
} from "./../../_metronic/_partials/controls";
import _ from "lodash";
import moment from "moment";

import { fetchJSON } from "../../_metronic/_helpers/api";
import Icon from "@material-ui/core/Icon";
import { BASE_URL } from "../../_metronic/_constants/endpoints";
import SkeletonComp from "../Components/SkeletonComp";
import DataTable from "../Components/DataTable";
import { Link } from "react-router-dom";
function DashboardTotalBudget(props) {
	const [budgetList, setBudgetList] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [principals, setPrincipals] = useState([]);

	const [payables, setPayables] = useState(0);
	const [receivables, setReceivables] = useState(0);

	const [avgSpendPerLead, setAvgSpendPerLead] = useState();
	const [principalFilters, setPrincipalFilters] = useState("all");
	const [yearFilter, setYearFilter] = useState(moment().year());
	const [loader, setLoader] = useState(false);
	//   const years = function(startYear) {
	//     const currentYear = new Date().getFullYear(), years = [];
	//     startYear = startYear || 1980;
	//     while ( startYear <= currentYear ) {
	//         years.push(startYear++);
	//     }
	//     years.push(currentYear + 1);
	//     return years;
	// }

	const getBudgetList = async () => {
		setLoader(true);
		setBudgetList([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		let params = principalFilters ? "?principal=" + principalFilters : "";
		params += yearFilter ? "&startDate=" + yearFilter : "";
		const res = await fetchJSON(
			BASE_URL + "/dashboard/marketing/dashboard/" + partnerId + params
		);
		if (res) {
			console.log(res);
			setBudgetList(res);
			let data = [];

			let params = principalFilters ? "/" + principalFilters : "";
			params += yearFilter ? "?expenseYear=" + yearFilter : "";
			const allCampaigns = await fetchJSON(
				BASE_URL + "/dashboard/marketing/partner/" + partnerId + params
			);

			if (allCampaigns) {
				data = [
					...res.campaigns,
					...allCampaigns.filter(
						item =>
							!res.campaigns.find(ele => ele.activityName === item.activityName)
					),
				];
				console.log(data);
				setTableData(data);
			}

			let tempSelf = 0;
			let tempPrincipal = 0;
			let tempTotal = 0;
			let tempLeads = 0;
			let tempSpendPerLead = 0;

			if (res) {
				tempSelf = tempSelf + res.dashboardTiles.spend_self;
				tempPrincipal = tempPrincipal + res.dashboardTiles.spend_principal;
				tempTotal = tempSelf + tempPrincipal;

				tempLeads = tempLeads + res.dashboardTiles?.total_leads;
				console.log(tempTotal, tempLeads);
				tempSpendPerLead = parseInt(tempTotal, 10) / parseInt(tempLeads, 10);
			}
			setAvgSpendPerLead(parseInt(tempLeads, 10) ? tempSpendPerLead : 0);
			setLoader(false);
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

	const getARList = async () => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		let params = principalFilters
			? principalFilters + "?principal=" + principalFilters
			: "";
		params += "&startDate=" + yearFilter;
		//   ? "&registerIsReceivable=" + receivableFilter
		//   : "";
		// params += statusFilter ? "&registerStatus=" + statusFilter : "";
		// params += purposeFilter ? "&registerPurpose=" + purposeFilter : "";
		const res = await fetchJSON(
			BASE_URL + "/dashboard/register/partner/" + partnerId + "/" + params
		);
		if (res) {
			let newPaybles = 0;
			let newReceivables = 0;
			res.map(item => {
				if (item.registerIsReceivable) {
					newReceivables = newReceivables + item.registerAmount;
				} else {
					// if (item.registerStatus !== 2) {
					newPaybles = newPaybles + item.registerAmount;
					// }
				}
			});
			setPayables(newPaybles);
			setReceivables(newReceivables);
		}
	};

	useEffect(() => {
		setLoader(true);
		getBudgetList();
		getPrincipals();
		getARList();
	}, []);

	useEffect(() => {
		if (principalFilters || yearFilter) {
			getBudgetList();
			getARList();
		}
	}, [principalFilters, yearFilter]);

	const Columns = [
		{
			label: "Campaign Name",
			key: "activityName",
			isSort: true,
		},
		{
			label: "CAMPAIGN SPEND",
			key: "total_spend",
			isLocaleValue: true,
			isCurrency: true,
		},
		{
			label: "COUNT LEADS",
			key: "leadsCount",
			isCenter: true,
			isLink: true,
			linkKey: "leadsLink",
			isSort: true,
		},
		{
			label: "% LEADS",
			key: "percentLeads",
			minWidth: 100,
			isPercent: true,
			isCenter: true,
		},
		{
			label: "SPEND / LEAD",
			key: "spendbylead",
			minWidth: 100,
			isLocaleValue: true,
			isCurrency: true,
			isCenter: true,
		},
	];
	return (
		<>
			<Card className="card-box expand-card">
				<CardHeader title="Marketing"></CardHeader>

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
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Control
										as="select"
										value={yearFilter}
										onChange={e => setYearFilter(e.target.value)}
									>
										<option
											value="a
                    ll"
											disabled
										>
											Select Year
										</option>
										<option>2022</option>
										<option>2021</option>
										<option>2020</option>
										<option>2019</option>
										<option>2018</option>
										{/* {years && years.map((item) => {
                     return (
                     <option value={item}>{item}</option>
                     )
                   })} */}
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
					</div>
					<div className="row mt-3">
						<div
							className="col-lg-2 bg-light-danger px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-danger text-center font-size-15">
									{budgetList.dashboardTiles &&
									budgetList.dashboardTiles.total_campaigns
										? budgetList.dashboardTiles.total_campaigns
										: 0}
								</h3>
								<div className="text-center">
									<label className="text-danger">Total Campaigns</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-success px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-success text-center font-size-15">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{budgetList?.dashboardTiles?.avg_spend_per_campaign &&
									budgetList.dashboardTiles.avg_spend_per_campaign.toLocaleString()
										? budgetList.dashboardTiles.avg_spend_per_campaign.toLocaleString()
										: 0}
								</h3>
								<div className="text-center">
									<label className="text-success">Avg Spend / Campaign</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-info px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-info text-center font-size-15">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{budgetList.dashboardTiles &&
									budgetList.dashboardTiles.spend_self &&
									budgetList.dashboardTiles.spend_self.toLocaleString()
										? budgetList.dashboardTiles.spend_self.toLocaleString()
										: 0}
								</h3>
								<div className="text-center">
									<label className="text-info">Spend Self</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-warning px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-warning text-center font-size-15">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{budgetList.dashboardTiles &&
									budgetList.dashboardTiles.spend_principal &&
									budgetList.dashboardTiles.spend_principal.toLocaleString()
										? budgetList.dashboardTiles.spend_principal.toLocaleString()
										: 0}
								</h3>
								<div className="text-center">
									<label className="text-warning">Spend Principal</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-primary px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-primary text-center font-size-15">
									{budgetList.dashboardTiles &&
									budgetList.dashboardTiles?.total_leads
										? budgetList.dashboardTiles?.total_leads
										: 0}
								</h3>
								<div className="text-center">
									<label className="text-primary">Leads</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-info px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-info text-center font-size-15">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{avgSpendPerLead && parseInt(avgSpendPerLead).toLocaleString()
										? parseInt(avgSpendPerLead).toLocaleString()
										: 0}
								</h3>
								<div className="text-center">
									<label className="text-info">Avg Spend / Lead</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-primary px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-primary text-center font-size-15">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{payables ? payables.toLocaleString() : 0}
								</h3>
								<div className="text-center">
									<label className="text-primary">Marketing Payable</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-warning px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-warning text-center font-size-15">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{receivables ? receivables.toLocaleString() : 0}
								</h3>
								<div className="text-center">
									<label className="text-warning">Marketing Receivable</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<h6 className="text-center mt-3 mb-2 ">Leads by Campaign</h6>
				<DataTable
					columns={Columns}
					data={
						tableData
							? [
									...tableData.map(item => {
										item.leadsLink = {
											to: {
												pathname: "/leads",
												state: item.activityName,
												date: yearFilter,
											},
											label: item.count,
										};
										item.leadsCount = item.count ? parseInt(item.count, 10) : 0;
										item.activityName =
											item.activityName == null
												? "UN-TAGGED"
												: item.activityName;
										item.percentLeads = isNaN(
											Math.round(
												(item.count / budgetList.dashboardTiles?.total_leads) *
													100
											)
										)
											? 0
											: Math.round(
													(item.count /
														budgetList.dashboardTiles?.total_leads) *
														100
											  );
										item.total_spend =
											item.total_spend == null ? "0" : item.total_spend;
										item.spendbylead = isNaN(item.total_spend / item.count)
											? 0
											: Math.round(item.total_spend / item.count);
										return item;
									}),
							  ]
							: []
					}
				></DataTable>
			</Card>
		</>
	);
}
export default DashboardTotalBudget;
