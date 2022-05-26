import React, { useMemo, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import ApexCharts from "apexcharts";
import { Card } from "./../../_metronic/_partials/controls";
import _ from "lodash";
import { fetchJSON } from "../../_metronic/_helpers/api";
import { BASE_URL } from "../../_metronic/_constants/endpoints";
import { Bar } from "react-chartjs-2";

const options = {
	plugins: {
		legend: {
			display: false,
		},
		datalabels: {
			anchor: "end",
			align: "top",
			formatter: Math.round,
			font: {
				weight: "bold",
			},
		},
	},
	scales: {
		yAxes: [
			{
				ticks: {
					beginAtZero: true,
				},
			},
		],
	},
};
function DashboardMonthlyRevenue(props) {
	const [monthlyList, setMonthlyList] = useState({ revenu: {} });

	const [type, setType] = useState("text");

	const [endDateType, setEndDateType] = useState("text");

	const [total, setTotal] = useState();
	const [revenueIndustryData, setRevenueIndustry] = useState({});
	const [revenueGeoData, setRevenueGeo] = useState({});

	const [totalRevenue, setTotalRevenue] = useState([]);
	const [principals, setPrincipals] = useState([]);
	const [principalFilters, setPrincipalFilters] = useState("all");
	const [startDateFilter, setStartDateFilter] = useState("");
	const [endDateFilter, setEndDateFilter] = useState("");

	useEffect(() => {
		// const element = document.getElementById("kt_mixed_widget_1_chart");
		// const element2 = document.getElementById("kt_mixed_widget_2_chart");
		// if (!element && !element2) {
		//   return;
		// }
		// const options = getChartOptions(monthlyList);
		// const options2 = getChartOptions2(monthlyList);
		// const chart = new ApexCharts(element, options);
		// const chart2 = new ApexCharts(element2, options2);
		// chart.render();
		// chart2.render();
		// return function cleanUp() {
		//   chart.destroy();
		//   chart2.destroy();
		// };
	}, [monthlyList]);

	useEffect(() => {
		getMonthlyRevenueList();
		getTotalRevenue();
		getPrincipals();
	}, []);

	useEffect(() => {
		if (principalFilters || startDateFilter || endDateFilter) {
			getMonthlyRevenueList();
		}
	}, [principalFilters, startDateFilter, endDateFilter]);

	const getTotalRevenue = async () => {
		setTotalRevenue([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(BASE_URL + "/dashboard/home/" + partnerId);
		if (res) {
			console.log(res);
			setTotalRevenue(res);
		}
	};

	const getMonthlyRevenueList = async () => {
		setMonthlyList([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		let params = principalFilters ? "?principal=" + principalFilters : "";
		params += startDateFilter ? "&startDate=" + startDateFilter : "";
		params += endDateFilter ? "&endDate=" + endDateFilter : "";
		const res = await fetchJSON(
			BASE_URL + "/dashboard/clients/dashboard/" + partnerId + params
		);
		if (res) {
			console.log(res);
			setMonthlyList(res);

			setRevenueGeo({
				labels: [...res.revenue_geo.map(item => item.region)],
				datasets: [
					{
						label: "",
						data: [...res.revenue_geo.map(item => item.revenue)],
						backgroundColor: [
							"#003f5c",
							"#2f4b7c",
							"#665191",
							"#a05195",
							"#d45087",
							"#f95d6a",
							"#ff7c43",
							"#ffa600",
						],
					},
				],
			});

			setRevenueIndustry({
				labels: [...res.revenue_industry.map(item => item.industry)],
				datasets: [
					{
						label: "",
						data: [...res.revenue_industry.map(item => item.revenue)],
						backgroundColor: [
							"#003f5c",
							"#2f4b7c",
							"#665191",
							"#a05195",
							"#d45087",
							"#f95d6a",
							"#ff7c43",
							"#ffa600",
						],
					},
				],
			});

			let tempPrincipal = 0;
			let tempService = 0;
			let tempOther = 0;
			let tempTotal = 0;

			if (res) {
				tempPrincipal = tempPrincipal + res.revenu.principal;
				tempService = tempService + res.revenu.services;
				tempOther = tempOther + res.revenu.others;
				tempTotal = tempPrincipal + tempService + tempOther;
			}

			setTotal(tempTotal);
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

	const percentage = (total, revenue) => {
		let principleRevenue = 0;
		if (monthlyList.revenu) {
			principleRevenue = ((100 * revenue) / total).toFixed(0).toLocaleString();
		}
		return principleRevenue;
	};

	return (
		<>
			<Card className="card-box expand-card">
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
							<Form.Group controlId="validationCustom02">
								<Form.Control
									type={type}
									onFocus={() => setType("month")}
									onBlur={() => setType("text")}
									placeholder="Start Month/Year"
									value={startDateFilter}
									onChange={e => setStartDateFilter(e.target.value)}
								/>
							</Form.Group>
						</div>
						<div className="col-lg-3">
							<Form.Group controlId="validationCustom02">
								<Form.Control
									type={endDateType}
									onFocus={() => setEndDateType("month")}
									onBlur={() => setEndDateType("text")}
									placeholder="End Month/Year"
									value={endDateFilter}
									onChange={e => setEndDateFilter(e.target.value)}
								/>
							</Form.Group>
						</div>
					</div>

					<div className="row mt-3">
						<div className="col-lg-2 bg-light-primary px-6 rounded-xl mr-7 mb-7">
							<div className="mt-8">
								<h3 className="text-primary text-center font-size-15">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{total && total.toLocaleString()}
								</h3>
								<div className="text-center">
									<label className="text-primary mt-2">Total</label>
								</div>
							</div>
						</div>
						<div className="col-lg-2 bg-light-success px-6 rounded-xl mr-7 mb-7">
							<div className="mt-8">
								<h3 className="text-success text-center font-size-15">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{monthlyList.revenu?.principal &&
										monthlyList.revenu.principal.toLocaleString()}
								</h3>
								<div className="text-center">
									<label className="text-success ml-2">
										{" "}
										{monthlyList.revenu && monthlyList.revenu.principal
											? percentage(
													totalRevenue.monthlyrevenue,
													monthlyList.revenu.principal
											  )
											: 0}
										%
									</label>
								</div>
								<div className="text-center mb-5">
									<label className="text-success ml-2">Revenue Vendor</label>
								</div>
							</div>
						</div>
						<div className="col-lg-2 bg-light-info px-6 rounded-xl mr-7 mb-7">
							<div className="mt-8">
								<h3 className="text-info text-center font-size-15">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{monthlyList.revenu?.services &&
										monthlyList.revenu.services.toLocaleString()}
								</h3>
								<div className="text-center">
									<label className="text-info ml-2">
										{" "}
										{monthlyList.revenu && monthlyList.revenu.principal
											? percentage(
													totalRevenue.monthlyrevenue,
													monthlyList.revenu.services
											  )
											: 0}
										%
									</label>
								</div>
								<div className="text-center">
									<label className=" text-info ml-2">Revenue Services</label>
								</div>
							</div>
						</div>
						<div className="col-lg-2 bg-light-warning px-6 rounded-xl mr-7 mb-7">
							<div className="mt-8">
								<h3 className="text-warning text-center font-size-15">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{monthlyList.revenu?.others &&
										monthlyList.revenu.others.toLocaleString()}
								</h3>
								<div className="text-center">
									<label className="text-warning ml-2">
										{monthlyList.revenu && monthlyList.revenu.principal
											? percentage(
													totalRevenue.monthlyrevenue,
													monthlyList.revenu.others
											  )
											: 0}
										%
									</label>
								</div>
								<div className="text-center">
									<label className="text-warning ml-2">Revenue - Others</label>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
			<div className="row">
				<div className="col-lg-6">
					<Card>
						<h4 style={{ padding: "8px" }}>BREAKUP - INDUSTRY</h4>
						<Bar
							data={revenueIndustryData}
							options={options}
							className="card-rounded-bottom"
							style={{ height: "200px", padding: "8px" }}
						/>
						{/* <div
              id="kt_mixed_widget_1_chart"
              className="card-rounded-bottom"
              style={{ height: "200px" }}
            ></div> */}
					</Card>
				</div>
				<div className="col-lg-6">
					<Card>
						<h4 style={{ padding: "8px" }}>BREAKUP - GEO</h4>
						<Bar
							data={revenueGeoData}
							options={options}
							className="card-rounded-bottom"
							style={{ height: "200px", padding: "8px" }}
						/>
						{/* <div
              id="kt_mixed_widget_2_chart"
              className="card-rounded-bottom"
              style={{ height: "200px" }}
            ></div> */}
					</Card>
				</div>
			</div>
		</>
	);
}

const getChartOptions = monthlyList => {
	let data = [];
	let categories = [];
	if (monthlyList.revenue_industry) {
		data = monthlyList.revenue_industry.map(e => e.revenue);
		categories = monthlyList.revenue_industry.map(e =>
			e.industry !== null ? String(e.industry) : "NA"
		);
	}
	console.log(monthlyList);
	const options = {
		series: [
			{
				// name: "Net Profit",
				data,
			},
		],
		title: {
			text: "BREAKUP - INDUSTRY",
			align: "left",
			margin: 10,
			offsetX: 0,
			offsetY: 0,
			floating: false,
			style: {
				fontSize: "15px",
				fontWeight: "bold",
				fontFamily: undefined,
				color: "#263238",
			},
		},
		chart: {
			type: "bar",
			height: 350,

			toolbar: {
				show: false,
			},
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: "60%",
				// endingShape: "rounded",
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ["transparent"],
		},
		xaxis: {
			categories,
		},
		fill: {
			opacity: 1,
			colors: ["#8950FC"],
		},
		// tooltip: {
		//   y: {
		//     formatter: function(val) {
		//       return "$ " + val + " thousands";
		//     },
		//   },
		// },
	};
	return options;
};

const getChartOptions2 = monthlyList => {
	let data = [];
	let categories = [];
	if (monthlyList.revenue_geo) {
		data = monthlyList.revenue_geo.map(e => e.revenue);
		categories = monthlyList.revenue_geo.map(e =>
			e.region !== null ? String(e.region) : "NA"
		);
	}
	console.log(monthlyList);
	const options2 = {
		series: [
			{
				data,
			},
		],
		title: {
			text: "BREAKUP - GEO",
			align: "left",
			margin: 10,
			offsetX: 0,
			offsetY: 0,
			floating: false,
			style: {
				fontSize: "15px",
				fontWeight: "bold",
				fontFamily: undefined,
				color: "#263238",
			},
		},
		chart: {
			type: "bar",
			height: 350,

			toolbar: {
				show: false,
			},
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: "60%",
				// endingShape: "rounded",
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ["transparent"],
		},
		xaxis: {
			categories,
		},
		fill: {
			opacity: 1,
			colors: ["#8950FC"],
		},
	};
	return options2;
};

export default DashboardMonthlyRevenue;
