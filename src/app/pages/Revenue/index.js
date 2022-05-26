import React, { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardHeaderToolbar,
} from "./../../../_metronic/_partials/controls";
import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";
import _ from "lodash";
import { CSVLink } from "react-csv";

import RevenueCards from "./RevenueCards";
import RevenueFilter from "./RevenueFilter";
import DataTable from "../../Components/DataTable";

export function RevenuePage() {
	const [revenue, setRevenue] = useState([]);
	const [principalvalue, setPrincipalValue] = useState();
	const [servicesValue, setServicesValue] = useState();
	const [othervalue, setOtherValue] = useState();
	const [totalvalue, setTotalValue] = useState();
	const [loader, setLoader] = useState(false);
	const [csvData, setCSVData] = useState([]);

	let principlePercentage = ((100 * principalvalue) / totalvalue)
		.toFixed(0)
		.toLocaleString();

	let servicePercentage = ((100 * servicesValue) / totalvalue)
		.toFixed(0)
		.toLocaleString();

	let revenuePercentage = ((100 * othervalue) / totalvalue)
		.toFixed(0)
		.toLocaleString();

	const getRevenueList = async (params, principalFilters) => {
		setLoader(true);
		setRevenue([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;

		try {
			const res = await fetchJSON(
				BASE_URL +
					"/dashboard/revenue-register/partner/" +
					partnerId +
					"/" +
					principalFilters +
					params
			);
			if (res !== "Error!") {
				console.log(res);
				setRevenue(res);
				const csvData = [];
				res.map((item, i) => {
					csvData.push({
						"SL No.": i + 1,
						"Client Name": item.clientName,
						"Principal Name": item.principalName,
						"Revenue Date": item.revenueDate,
						"Revenue Principal": item.revenuePrincipal,
						"Revenue Services": item.revenueServices,
						"Revenue Others": item.revenueOthers,
						Total: item.revenueTotalMonth,
					});
				});

				setCSVData(csvData);

				let tempPrincipal = 0;
				let tempServices = 0;
				let tempOther = 0;
				let tempTotal = 0;

				// const res = [{revenueServices : 10}, {revenueServices : 100}, {revenueServices : 30}]

				for (let i = 0; i < res.length; i++) {
					tempPrincipal = tempPrincipal + res[i].revenuePrincipal;
					tempServices = tempServices + res[i].revenueServices;
					tempOther = tempOther + res[i].revenueOthers;
					tempTotal = tempTotal + res[i].revenueTotalMonth;
				}
				setPrincipalValue(tempPrincipal);
				setServicesValue(tempServices);
				setOtherValue(tempOther);
				setTotalValue(tempTotal);
				setLoader(false);
			}
		} catch (error) {}
	};

	useEffect(() => {
		getRevenueList("", "All");
	}, []);

	const applyFilter = ({
		principalFilters,
		startDateFilter,
		endDateFilter,
		searchFilter,
	}) => {
		let params = principalFilters ? "?principalName=" + principalFilters : "";
		params += startDateFilter ? "&startDate=" + startDateFilter : "";
		params += endDateFilter ? "&endDate=" + endDateFilter : "";
		params += searchFilter ? "&clientName=" + searchFilter : "";
		getRevenueList(params, principalFilters);
	};

	const resetButtonClick = () => {
		getRevenueList("", "All");
	};

	const Columns = [
		{
			label: "Client Name",
			key: "clientName",
		},
		{
			label: "Month / Year",
			key: "revenueDate",
			isDate: true,
		},
		{
			label: "Vendor",
			key: "revenuePrincipal",
			minWidth: 50,
			isCurrency: true,
		},
		{
			label: "Services",
			key: "revenueServices",
			minWidth: 50,
			isCurrency: true,
		},
		{
			label: "Other",
			key: "revenueOthers",
			minWidth: 50,
			isCurrency: true,
		},
		{
			label: "Grand Total",
			key: "revenueTotalMonth",
			isCurrency: true,
		},
	];

	return (
		<>
			<Card className="card-box expand-card">
				<CardHeader title="Revenue">
					<CardHeaderToolbar>
						<CSVLink
							className="btn btn-light-warning csv-btn font-weight-bolder"
							filename={"revenue.csv"}
							data={csvData}
						>
							Export to CSV
						</CSVLink>
					</CardHeaderToolbar>
				</CardHeader>
				<div className="card-spacer bg-white">
					<RevenueFilter
						applyFilter={applyFilter}
						resetButtonClick={resetButtonClick}
					></RevenueFilter>
					<RevenueCards
						totalvalue={totalvalue}
						principalvalue={principalvalue}
						principlePercentage={principlePercentage}
						servicesValue={servicesValue}
						servicePercentage={servicePercentage}
						othervalue={othervalue}
						revenuePercentage={revenuePercentage}
					></RevenueCards>
				</div>
				<DataTable columns={Columns} data={revenue} loader={loader}></DataTable>
			</Card>
		</>
	);
}
