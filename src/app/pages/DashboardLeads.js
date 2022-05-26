import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import ApexCharts from "apexcharts";
import { Card } from "./../../_metronic/_partials/controls";
import { makeStyles } from "@material-ui/core";
import _ from "lodash";
import { fetchJSON } from "../../_metronic/_helpers/api";
import { BASE_URL } from "../../_metronic/_constants/endpoints";
import { Bar } from "react-chartjs-2";

const useStyles = makeStyles(theme => ({
	margin: {
		margin: theme.spacing(1),
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},
}));

const data = {
	labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
	datasets: [
		{
			label: "# of Votes",
			data: [12, 19, 3, 5, 2, 3],
			backgroundColor: [
				"rgba(255, 99, 132, 0.2)",
				"rgba(54, 162, 235, 0.2)",
				"rgba(255, 206, 86, 0.2)",
				"rgba(75, 192, 192, 0.2)",
				"rgba(153, 102, 255, 0.2)",
				"rgba(255, 159, 64, 0.2)",
			],
		},
	],
};

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

export function DashboardLeads(props) {
	const [leadsList, setLeadsList] = useState({});

	const [type, setType] = useState("text");

	const [endDateType, setEndDateType] = useState("text");

	const [activeLeads, setActiveLeads] = useState();
	const [chartData, setChartData] = useState({});

	const [principals, setPrincipals] = useState([]);
	const [principalFilters, setPrincipalFilters] = useState("all");
	const [startDateFilter, setStartDateFilter] = useState("");
	const [endDateFilter, setEndDateFilter] = useState("");

	const [principalPipelineValue, setPrincipalPipelineValue] = useState();

	useEffect(() => {
		// console.log('here');
		// const element = document.getElementById("kt_mixed_widget_1_chart");
		// if (!element) {
		//   return;
		// }
		// const options = getChartOptions(leadsList);
		// const chart = new ApexCharts(element, options);
		// chart.render();
		// return function cleanUp() {
		//   chart.destroy();
		// };
	}, [leadsList, activeLeads]);

	useEffect(() => {
		getLeadsDashboard();
		getPrincipals();
	}, []);

	useEffect(() => {
		if (principalFilters || startDateFilter || endDateFilter) {
			getLeadsDashboard();
		}
	}, [principalFilters, startDateFilter, endDateFilter]);

	const getLeadsDashboard = async () => {
		setLeadsList([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		let params = principalFilters ? "?principal=" + principalFilters : "";
		params += startDateFilter ? "&startDate=" + startDateFilter : "";
		params += endDateFilter ? "&endDate=" + endDateFilter : "";
		const res = await fetchJSON(
			BASE_URL + "/dashboard/sales/dashboard/" + partnerId + params
		);
		if (res) {
			console.log(res);
			setLeadsList(res);

			setChartData({
				labels: [...res.leads_self_generated_geo.map(item => item.label)],
				datasets: [
					{
						label: "",
						data: [...res.leads_self_generated_geo.map(item => item.leads)],
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

			let tempGenerated = 0;
			let tempPrincipal = 0;
			let tempTotal = 0;
			let tempPipelineValue = 0;
			let tempLeadsValue = 0;
			let tempPrincipalPipeline = 0;

			if (res) {
				tempGenerated = tempGenerated + res.leads_self_generated;
				tempPrincipal = tempPrincipal + res.principal_leads_total;
				tempTotal = tempGenerated + tempPrincipal;
				tempPipelineValue = tempPipelineValue + res.pipeline;
				tempLeadsValue = tempLeadsValue + res.self_generated_leads_pipeline;
				tempPrincipalPipeline = tempPipelineValue - tempLeadsValue;
			}

			setActiveLeads(tempTotal);
			setPrincipalPipelineValue(tempPrincipalPipeline);
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

	const getChartOptions = leadsList => {
		console.log(leadsList);
		let data = [];
		let categories = [];
		if (leadsList.leads_self_generated_geo) {
			data = leadsList.leads_self_generated_geo.map(e => e.leads);
			categories = leadsList.leads_self_generated_geo.map(e => e.label);
		}
		const options = {
			series: [
				{
					// name: "Net Profit",
					data,
				},
			],
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
					dataLabels: {
						position: "top",
					},
					// endingShape: "rounded",
				},
			},
			dataLabels: {
				enabled: true,
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
				colors: ["#1BC5BD"],
			},
			// tooltip: {
			//   y: {
			//     formatter: function(val) {
			//       return "$ " + val + " thousands";
			//     },
			//   },
			// },
		};
		// setChartOptions(options)
		return options;
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
											Select vendor
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
						<div
							className="col-lg-2 bg-light-primary px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-primary text-center font-size-15">
									{activeLeads}
								</h3>
								<div className="text-center">
									<label className="text-primary">Total Active Leads</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-success px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-success text-center font-size-15">
									{leadsList.leads_self_generated}
								</h3>
								<div className="text-center">
									<label className="text-success">Self Generated Leads</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-info px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-info text-center font-size-15">
									{leadsList.leads_converted}%
								</h3>
								<div className="text-center">
									<label className=" text-info">
										% of Self Leads Converted
									</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-warning px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-warning text-center font-size-15">
									{leadsList && leadsList.principal_leads_total}
								</h3>

								<div className="text-center">
									<label className="text-warning">Vendor Provided Leads</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-success px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-success text-center font-size-15">
									{leadsList.principal_leads_converted_pct}%
								</h3>

								<div className="text-center">
									<label className="text-success">
										% of Vendor Leads Converted
									</label>
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
									{leadsList.pipeline && leadsList.pipeline.toLocaleString()}
								</h3>

								<div className="text-center">
									<label className="text-info">Pipeline Value</label>
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
									{leadsList.self_generated_leads_pipeline &&
										leadsList.self_generated_leads_pipeline.toLocaleString()}
								</h3>

								<div className="text-center">
									<label className="text-warning">Leads - Self</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-danger px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-danger text-center font-size-15">
									{JSON.parse(localStorage.getItem("user-details"))?.Partner
										?.Currency?.currencyCode === "USD" ? (
										"$"
									) : (
										<span className="rupee-symbol">₹</span>
									)}
									{principalPipelineValue &&
										principalPipelineValue.toLocaleString()}
								</h3>

								<div className="text-center">
									<label className="text-danger">Leads - Vendor</label>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>

			<div className="row">
				<div className="col-lg-12">
					<Card>
						<Bar
							data={chartData}
							options={options}
							className="card-rounded-bottom"
							style={{ height: "200px", padding: "32px" }}
						/>
						{/* //    <div
          //    id="kt_mixed_widget_1_chart"
          //    className="card-rounded-bottom"
          //    style={{ height: "200px" }}
          //  ></div>            */}
					</Card>
				</div>
			</div>
			<div className="row">
				<div className="col-lg-6">
					<div className="card">
						<div className="card-header border-0 py-5">
							<h3 className="card-title align-items-start flex-column">
								<span className="card-label font-weight-bolder text-dark">
									Top 5 Geos
								</span>
							</h3>
						</div>
						<div className="card-body pt-3 pb-0">
							<div className="table-responsive">
								<table className="table table-borderless table-vertical-center">
									{/* <thead>
                    <tr>
                      <th className="p-0" style={{ width: "20px" }} />
                      <th className="p-0" style={{ minWidth: "200px" }} />
                      <th className="p-0" style={{ minWidth: "100px" }} />
                      <th className="p-0" style={{ minWidth: "125px" }} />
                      <th className="p-0" style={{ minWidth: "110px" }} />
                      <th className="p-0" style={{ minWidth: "150px" }} />
                    </tr>
                  </thead> */}
									<tbody>
										{leadsList.top5Geo &&
											leadsList.top5Geo.map(item => {
												return (
													<tr>
														<td className="pl-0">
															<a
																href="#"
																className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg"
															>
																{item.regionName}
															</a>
														</td>
														<td className="text-right">
															<span className="text-dark-75 font-weight-bolder d-block font-size-lg">
																{item.count}
															</span>
														</td>
													</tr>
												);
											})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div className="col-lg-6">
					<div className="card">
						<div className="card-header border-0 py-5">
							<h3 className="card-title align-items-start flex-column">
								<span className="card-label font-weight-bolder text-dark">
									Top 5 Industries
								</span>
							</h3>
						</div>
						<div className="card-body pt-3 pb-0">
							<div className="table-responsive">
								<table className="table table-borderless table-vertical-center">
									{/* <thead>
                    <tr>
                      <th className="p-0" style={{ width: "20px" }} />
                      <th className="p-0" style={{ minWidth: "200px" }} />
                      <th className="p-0" style={{ minWidth: "100px" }} />
                      <th className="p-0" style={{ minWidth: "125px" }} />
                      <th className="p-0" style={{ minWidth: "110px" }} />
                      <th className="p-0" style={{ minWidth: "150px" }} />
                    </tr>
                  </thead> */}
									<tbody>
										{leadsList.top5Industries &&
											leadsList.top5Industries.map(item => {
												return (
													<tr>
														<td className="pl-0">
															<a
																href="#"
																className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg"
															>
																{item.verticalName}
															</a>
														</td>
														<td className="text-right">
															<span className="text-dark-75 font-weight-bolder d-block font-size-lg">
																{item.count}
															</span>
														</td>
													</tr>
												);
											})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default DashboardLeads;
