/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
// import { Dropdown } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../_helpers";
import { useHtmlClassService } from "../../../layout";
import { fetchJSON } from "../../../_helpers/api";
import { BASE_URL } from "../../../_constants/endpoints";
import _, { divide } from "lodash";
import { Link } from "react-router-dom";

const initialDashboard = {
	totalclients: "0",
	monthlyrevenue: "0",
	activeleads: "0",
	pipeline: "0",
	employeescount: "0",
	casestudiescount: "0",
	certificationcount: "0",
	totalmdf: "0",
	topClients: [],
	topLeads: [],
	principals: "0",
};

export function MixedWidget1({ className, dashboard }) {
	const uiService = useHtmlClassService();

	const [principals, setPrincipals] = useState(0);

	const layoutProps = useMemo(() => {
		return {
			colorsGrayGray500: objectPath.get(
				uiService.config,
				"js.colors.gray.gray500"
			),
			colorsGrayGray200: objectPath.get(
				uiService.config,
				"js.colors.gray.gray200"
			),
			colorsGrayGray300: objectPath.get(
				uiService.config,
				"js.colors.gray.gray300"
			),
			colorsThemeBaseDanger: objectPath.get(
				uiService.config,
				"js.colors.theme.base.danger"
			),
			fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
		};
	}, [uiService]);

	useEffect(() => {
		const element = document.getElementById("kt_mixed_widget_1_chart");
		if (!element) {
			return;
		}

		const options = getChartOptions(layoutProps);

		const chart = new ApexCharts(element, options);
		chart.render();
		return function cleanUp() {
			chart.destroy();
		};
	}, [layoutProps]);

	useEffect(() => {
		getPrincipals();
	}, []);

	const getPrincipals = async () => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		if (partnerId) {
			const res = await fetchJSON(
				BASE_URL + "/dashboard/myorg/associations/principals/" + partnerId
			);
			if (res) {
				const uniquePrincipals = _.uniqBy(res, "principalId");
				// console.log(uniquePrincipals);
				setPrincipals(uniquePrincipals.length);
			}
		}
	};

	return (
		<div className={`card card-custom bg-gray-100 ${className}`}>
			<div className="card-spacer mt-n25 mt-4 bg-white">
				<div className="row">
					<Link
						to="/principal"
						className="col-lg-2 text-center bg-light-primary px-6 rounded-xl mr-7 mb-7"
						// style={{ height: "122px", paddingTop: "8px" }}
					>
						<span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
							<SVG
								title="Vendors"
								src={toAbsoluteUrl("/media/svg/icons/Media/Equalizer.svg")}
							></SVG>
						</span>
						<h5 className="text-primary font-size-15">{principals}</h5>
						<div className="text-primary font-weight-bold font-size-15">
							Vendors
						</div>
					</Link>
					<Link
						to="/clients"
						className="col-lg-2 text-center bg-light-success px-6 rounded-xl mr-7 mb-7"
					>
						<span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
							<SVG
								title="Active Client"
								src={toAbsoluteUrl("/media/svg/icons/General/User.svg")}
							></SVG>
						</span>
						<h5 className="text-success font-size-15">
							{dashboard.totalclients}
						</h5>
						<div className="text-success font-weight-bold font-size-15">
							Total Clients
						</div>
					</Link>
					<Link
						to="/dashboard-monthly-revenue"
						className="col-lg-2 text-center bg-light-warning px-6 rounded-xl mr-7 mb-7"
					>
						<span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
							{JSON.parse(localStorage.getItem("user-details"))?.Partner
								?.Currency?.currencyCode === "USD" ? (
								<i className="fa fa-dollar-sign fa-2x text-warning mt-3"></i>
							) : (
								<i className="fa fa-rupee-sign fa-2x text-warning mt-3"></i>
							)}
						</span>
						<h5 className="text-warning font-size-15">
							{JSON.parse(localStorage.getItem("user-details"))?.Partner
								?.Currency?.currencyCode === "USD" ? (
								"$"
							) : (
								<span className="rupee-symbol">₹</span>
							)}
							{dashboard.monthlyrevenue &&
								dashboard.monthlyrevenue.toLocaleString()}
						</h5>
						<div className="text-warning font-weight-bold font-size-15">
							Monthly Revenue
						</div>
					</Link>
					<Link
						to="/dashboard-leads"
						className="col-lg-2 text-center bg-light-info px-6 rounded-xl mr-7 mb-7"
						style={{ height: "122px", paddingTop: "8px" }}
					>
						<span className="svg-icon svg-icon-3x svg-icon-info d-block my-2">
							<SVG
								title="Active Lead"
								src={toAbsoluteUrl("/media/svg/icons/Shopping/Chart-line1.svg")}
							></SVG>
						</span>
						<h5 className="text-info font-size-15">{dashboard.activeleads}</h5>
						<div className="text-info font-weight-bold font-size-15">
							Total Leads
						</div>
					</Link>
					<Link
						to="/dashboard-leads"
						className="col-lg-2 text-center bg-light-danger px-6 rounded-xl mr-7 mb-7"
						style={{ height: "122px", paddingTop: "8px" }}
					>
						<span className="svg-icon svg-icon-3x svg-icon-danger d-block my-2">
							{/* <SVG title=""
                src={toAbsoluteUrl("/media/svg/icons/Tools/Tools.svg")}
              ></SVG> */}
							<i className="fa fa-filter fa-2x text-danger mt-3"></i>
						</span>
						<h5 className="text-danger font-size-15">
							{JSON.parse(localStorage.getItem("user-details"))?.Partner
								?.Currency?.currencyCode === "USD" ? (
								"$"
							) : (
								<span className="rupee-symbol">₹</span>
							)}
							{dashboard.pipeline && dashboard.pipeline.toLocaleString()}
						</h5>
						<div className=" text-danger font-weight-bold font-size-15">
							Pipeline
						</div>
					</Link>
					<Link
						to="/dashboard-total-budget"
						className="col-lg-2 text-center bg-light-info px-6 rounded-xl mr-7 mb-7"
						style={{ height: "122px", paddingTop: "8px" }}
					>
						<span className="svg-icon svg-icon-3x svg-icon-info d-block my-2">
							<SVG
								title="Total Budgeted MDF"
								src={toAbsoluteUrl("/media/svg/icons/Shopping/Calculator.svg")}
							></SVG>
						</span>
						<h5 className="text-info font-size-15">
							{JSON.parse(localStorage.getItem("user-details"))?.Partner
								?.Currency?.currencyCode === "USD" ? (
								"$"
							) : (
								<span className="rupee-symbol">₹</span>
							)}
							{dashboard.totalmdf && dashboard.totalmdf.toLocaleString()}
						</h5>
						<div className="text-info font-weight-bold font-size-15">
							Total Budgeted MDF
						</div>
					</Link>
					<Link
						to="/user-profile/account-information"
						className="col-lg-2  text-center bg-light-warning px-6 rounded-xl mr-7 mb-7"
						style={{ height: "122px", paddingTop: "8px" }}
					>
						<span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
							<SVG
								title="Employees"
								src={toAbsoluteUrl("/media/svg/icons/Communication/Group.svg")}
							></SVG>
						</span>
						<h5 className="text-warning font-size-15">
							{dashboard.employeescount}
						</h5>
						<div className="text-warning font-weight-bold font-size-15">
							Employees
						</div>
					</Link>
					<Link
						to="/dashboard-certification"
						className="col-lg-2 text-center bg-light-success px-6 rounded-xl mr-7 mb-7"
						style={{ height: "122px", paddingTop: "8px" }}
					>
						<span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
							<SVG
								title="Certifications"
								src={toAbsoluteUrl("/media/svg/icons/General/Clipboard.svg")}
							></SVG>
						</span>
						<h5 className="text-success font-size-15">
							{dashboard.certificationcount}
						</h5>
						<div className="text-success font-weight-bold font-size-15">
							Certifications
						</div>
					</Link>
					<Link
						to="/case-studies"
						className="col-lg-2 text-center bg-light-primary px-6 rounded-xl mb-7"
						style={{ height: "122px", paddingTop: "8px" }}
					>
						<span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
							<SVG
								title="Case Studies"
								src={toAbsoluteUrl("/media/svg/icons/Home/Book.svg")}
							></SVG>
						</span>
						<h5 className="text-primary font-size-15">
							{dashboard.casestudiescount}
						</h5>
						<div className="text-primary font-weight-bold font-size-15">
							Case Studies
						</div>
					</Link>
				</div>
			</div>

			{/* Resize */}
			<div className="resize-triggers">
				<div className="expand-trigger">
					<div style={{ width: "411px", height: "461px" }} />
				</div>
				<div className="contract-trigger" />
			</div>
		</div>
		// </div>
	);
}

function getChartOptions(layoutProps) {
	const strokeColor = "#3699FF";

	const options = {
		series: [
			{
				name: "Net Profit",
				data: [30, 45, 32, 70, 40, 40, 40],
			},
		],
		chart: {
			type: "area",
			height: 200,
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
			sparkline: {
				enabled: true,
			},
			dropShadow: {
				enabled: true,
				enabledOnSeries: undefined,
				top: 0,
				left: 0,
				blur: 3,
				color: strokeColor,
				opacity: 0.5,
			},
		},
		plotOptions: {},
		legend: {
			show: false,
		},
		dataLabels: {
			enabled: false,
		},
		fill: {
			type: "solid",
			opacity: 0,
		},
		stroke: {
			curve: "smooth",
			show: true,
			width: 3,
			colors: [strokeColor],
		},
		xaxis: {
			categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
			labels: {
				show: false,
				style: {
					colors: layoutProps.colorsGrayGray500,
					fontSize: "12px",
					fontFamily: layoutProps.fontFamily,
				},
			},
			crosshairs: {
				show: false,
				position: "front",
				stroke: {
					color: layoutProps.colorsGrayGray300,
					width: 1,
					dashArray: 3,
				},
			},
		},
		yaxis: {
			min: 0,
			max: 80,
			labels: {
				show: false,
				style: {
					colors: layoutProps.colorsGrayGray500,
					fontSize: "12px",
					fontFamily: layoutProps.fontFamily,
				},
			},
		},
		states: {
			normal: {
				filter: {
					type: "none",
					value: 0,
				},
			},
			hover: {
				filter: {
					type: "none",
					value: 0,
				},
			},
			active: {
				allowMultipleDataPointsSelection: false,
				filter: {
					type: "none",
					value: 0,
				},
			},
		},
		tooltip: {
			style: {
				fontSize: "12px",
				fontFamily: layoutProps.fontFamily,
			},
			y: {
				formatter: function(val) {
					return "$" + val + " thousands";
				},
			},
			marker: {
				show: false,
			},
		},
		colors: ["transparent"],
		markers: {
			colors: layoutProps.colorsThemeBaseDanger,
			strokeColor: [strokeColor],
			strokeWidth: 3,
		},
	};
	return options;
}
