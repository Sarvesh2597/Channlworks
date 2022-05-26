/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHtmlClassService } from "../../../layout";
// import { DropdownMenu2 } from "../../dropdowns";
import { fetchJSON } from "../../../_helpers/api";
import { BASE_URL } from "../../../_constants/endpoints";

export function MixedWidget2({ className, principals }) {
	const uiService = useHtmlClassService();

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
		console.log(principals, className);
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

	const colors = [
		{ colorName: "light-success", principalName: "Google Cloud" },
		{ colorName: "light-primary", principalName: "Microsoft Azure" },
		{ colorName: "light-danger", principalName: "AWS" },
	];

	const text = [
		{ textColor: "success", principalName: "Google Cloud" },
		{ textColor: "primary", principalName: "Microsoft Azure" },
		{ textColor: "danger", principalName: "AWS" },
	];

	// const icons = [
	//   { name: "google", principalName: "Google Cloud" },
	//   { name: "windows", principalName: "Microsoft Azure" },
	//   { name: "aws", principalName: "AWS" },
	// ];

	return (
		<div className={`card card-custom bg-gray-100 ${className}`}>
			{/* Header */}
			<div className="card-header border-0 bg-danger py-5">
				<h3 className="card-title font-weight-bolder text-white">Vendors</h3>
			</div>

			{/* Body */}
			<div className="card-body p-0 position-relative overflow-hidden">
				{/* Chart */}
				<div
					id="kt_mixed_widget_1_chart"
					className="card-rounded-bottom bg-danger"
					style={{ height: "200px" }}
				></div>

				{/* Stat */}
				<div className="card-spacer mt-n25">
					<div className="row m-0">
						{principals.length > 0 ? (
							principals.map((principal, i) => {
								return (
									<div
										className={`col-lg-5 px-6 py-8 rounded-xl mr-7 mb-7 
                    bg-${
											colors.find(
												e => e.principalName === principal.principalName
											) ? colors.find(
												e => e.principalName === principal.principalName
											).colorName : 'light-success'
										}
                    `}
									>
										{/* <span className="svg-icon svg-icon-4x d-block my-2"> */}
										<div className="image-box">
											<a href={principal.url} target="_blank">
												<img
													height="58"
													width="135"
													src={principal.logo_url}
												></img>
											</a>
										</div>
										{/* <i
                        className={`fab fa-${
                          icons.find(
                            (e) => e.principalName === principal.principalName
                          ).name
                        } text-${
                          text.find(
                            (e) => e.principalName === principal.principalName
                          ).textColor
                        }`}
                      ></i> */}

										{/* </span> */}

										{/* <a
                      href="#"
                      className={`font-weight-bold font-size-h3 text-${
                        text.find(
                          (e) => e.principalName === principal.principalName
                        ).textColor
                      }`}
                    >
                      {principal.principalName}
                    </a> */}
									</div>
								);
							})
						) : (
							<div className="text-white">
								<label className="text-center mb-2">
									To get started, please select the Vendor/s you're interested
									in. <br></br> Click on the <b>ADD</b> button on the{" "}
									<b>Top Right</b> corner.
								</label>
							</div>
						)}
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
		</div>
	);
}

function getChartOptions(layoutProps) {
	const strokeColor = "#D13647";

	const options = {
		tooltip: {
			enabled: false,
		},
		series: [
			{
				name: "",
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
				top: 5,
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
			tooltip: {
				enabled: false,
			},
			categories: ["", "", "", "", "", "", ""],
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

			active: {
				allowMultipleDataPointsSelection: false,
				filter: {
					type: "none",
					value: 0,
				},
			},
		},
		tooltip: {
			show: false,
			style: {
				fontSize: "12px",
				fontFamily: layoutProps.fontFamily,
			},
			y: {
				formatter: function(val) {
					return "";
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
