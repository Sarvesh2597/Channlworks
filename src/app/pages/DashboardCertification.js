import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import SVG from "react-inlinesvg";
import {
	Card,
	CardBody,
	CardHeader,
} from "./../../_metronic/_partials/controls";
import moment from "moment";
import { fetchJSON } from "../../_metronic/_helpers/api";
import { BASE_URL } from "../../_metronic/_constants/endpoints";
import { ResponsiveSunburst } from "@nivo/sunburst";
import CertificationChart from "./Certifications/CerficationChart";
import ExpiredCertificatesModal from "./Certifications/ExpiredCertificatesModal";
import ExpiringCertificatesModal from "./Certifications/ExpiringCertificatesModal";
import { LinesChart } from "../Components/Chart/LinesChart";
import _ from "lodash";
import { monthYear } from "../../utils/helpers";

function DashboardCertification() {
	const [certification, setCertification] = useState([]);
	const [certificationDataByMonth, setcertificationDataByMonth] = useState([]);

	const [allCertification, setAllCertification] = useState([]);

	const [certificationNumber, setCertificationNumber] = useState(0);

	const [totalEmployees, setTotalEmployees] = useState(0);

	const [dateRange, setDateRange] = useState(
		moment(new Date()).format("YYYY-MM")
	);

	const [principal, setPrincipal] = useState("all");

	const [expired, setExpired] = useState();

	const [expiring, setExpiring] = useState();

	const [isShow, setShow] = useState(false);

	const [isShowExpired, setShowExpired] = useState(false);

	const [expiringCertificateData, setExpCertData] = useState([]);

	const [expiredCertificateData, setExpiredCertData] = useState([]);

	const [chartData, setChartData] = useState([]);

	const getExpiringCertification = async () => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(
			BASE_URL +
				"/dashboard/employee/certifications/expiring/" +
				partnerId +
				"?principal=" +
				principal
		);
		if (res) {
			setExpiring(res.count);
			setExpCertData(res.data);
		}
	};

	const getExpiredCertification = async () => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(
			BASE_URL +
				"/dashboard/employee/certifications/expired/" +
				partnerId +
				"?principal=" +
				principal
		);
		if (res) {
			setExpired(res.count);
			setExpiredCertData(res.data);
		}
	};

	const getCertificationByMonth = async () => {
		setcertificationDataByMonth([]);

		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		try {
			const res = await fetchJSON(
				BASE_URL +
					`/dashboard/certificationsbymonth/dashboard/${partnerId}?startDate=${dateRange}&principal=${principal}`
			);

			if (res) {
				const dataByMonth = res.map((d, i) => {
					if (d.label.match(/aws/i) && d.data[0][1] !== undefined) {
						return {
							...d,
							color: "#FFA800",
						};
					} else if (
						d.label.match(/google cloud/i) &&
						d.data[0][1] !== undefined
					) {
						return {
							...d,
							color: "#3699FF",
						};
					} else if (d.data[0][1] !== undefined) {
						return {
							...d,
							color: "#8950FC",
						};
					}
				});

				const princialGroup = res.map(d => {
					return d.data.map(v => v);
				});

				var merged = [].concat.apply([], princialGroup);

				var output = _.chain(merged)
					.groupBy(0)
					.map(function(v, i) {
						return [i, _.sumBy(v, 1)];
					})
					.value();

				const total = {
					label: "Total",
					data: output,
					color: "#6b6b6b",
				};

				setcertificationDataByMonth([..._.compact(dataByMonth), total]);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getCertificationList = async () => {
		setCertification([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		// console.log("hi");
		const res = await fetchJSON(
			BASE_URL +
				"/dashboard/certifications/dashboard/" +
				partnerId +
				"?principal=" +
				principal +
				"&startDate=" +
				dateRange
		);

		if (res) {
			// console.log(res);
			setChartData(res);
			let summaries = [...res.map(ele => ele.summary)];

			let allSummaries = { ...summaries[0], ...summaries[1], ...summaries[2] };

			setCertification(allSummaries);
			setAllCertification(allSummaries);

			const totalAmount = obj =>
				Object.values(obj).reduce(function(acc, obj) {
					return acc + obj;
				}, 0);

			let tempNumber = 0;
			let tempExpire = 0;
			let tempCertifications = 0;

			// const res = [{totalEmployeeCount : 10}, {totalEmployeeCount : 100}, {totalEmployeeCount : 30}]

			for (let i = 0; i < res.length; i++) {
				tempNumber = tempNumber + res[i].certifiedEmpCount;
				tempExpire = tempExpire + res[i].expiringCertCount;

				// tempCertifications = tempCertifications.filter(() => (
				//   res[i].totalEmployeeCount
				// ))
			}

			setTotalEmployees(res.length > 0 ? res[0].totalEmployeeCount : 0);
			if (summaries.length) {
				setCertificationNumber(
					totalAmount(summaries[0]) +
						totalAmount(summaries[1]) +
						totalAmount(summaries[2])
				);
			}
			// setExpire(tempExpire);
		}
	};

	useEffect(() => {
		getExpiredCertification();
		getExpiringCertification();
		getCertificationList(moment(new Date()).format("YYYY-MM"));
		getCertificationByMonth();
	}, [dateRange, principal]);

	const setDateFilter = e => {
		if (moment(e.target.value).format("YYYY-MM") === "Invalid date") return;
		else setDateRange(moment(e.target.value).format("YYYY-MM"));
	};

	const setPrincipalFilter = e => {
		setPrincipal(e.target.value);
	};
	const search = e => {
		let allCertifications = allCertification;
		if (e) {
			let searches = {};
			for (const item in allCertification) {
				console.log(e);
				console.log(item);
				console.log(item.indexOf(e));
				if (item.toLowerCase().indexOf(e.toLowerCase()) !== -1) {
					searches = { ...searches, ...{ [item]: allCertification[item] } };
				}
			}

			setCertification(searches);
		} else {
			setCertification(allCertification);
		}
	};

	return (
		<>
			<Card className="card-box expand-card">
				<CardHeader title="Certifications"></CardHeader>
				<div className="card-spacer bg-white">
					<div className="row">
						<div className="col-lg-3"></div>
						<div className="col-lg-3">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Control
										as="select"
										value={principal}
										onChange={e => setPrincipalFilter(e)}
									>
										<option disabled="true">Select Vendor</option>
										<option value="all">All</option>
										<option value={11}>AWS</option>
										<option value={12}>Google Cloud</option>
										<option value={13}> Microsoft Azure</option>
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-3">
							<Form>
								<Form.Group controlId="validationCustom02">
									<Form.Control
										required
										type="month"
										value={dateRange}
										onChange={e => setDateFilter(e)}
										min="2000-01"
										max={monthYear}
									/>
								</Form.Group>
							</Form>
						</div>
					</div>
					<div className="row mt-3">
						<div
							className="col-lg-2 bg-light-warning px-6 rounded-xl mr-7 ml-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-warning text-center font-size-15">
									{totalEmployees}
								</h3>
								<div className="text-center">
									<label className="text-warning">Total Employees</label>
								</div>
							</div>
						</div>
						<div
							className="col-lg-2 bg-light-success px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-success text-center font-size-15">
									{certificationNumber}
								</h3>
								<div className="text-center">
									<label className="text-success">
										Number of Certifications
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
									{isNaN(
										((certificationNumber / totalEmployees) * 100).toFixed(2)
									)
										? 0
										: ((certificationNumber / totalEmployees) * 100).toFixed(0)}
									%
								</h3>
								<div className="text-center">
									<label className="text-info">Certification Coverage</label>
								</div>
							</div>
						</div>
						<div
							onClick={e => setShow(true)}
							className="col-lg-2 bg-light-danger cursor px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-danger text-center font-size-15">
									{expiring}
								</h3>
								<div className="text-center">
									<label className="text-danger">Expiring in 90 days</label>
								</div>
							</div>
						</div>
						<div
							onClick={e => setShowExpired(true)}
							className="col-lg-2 bg-light-danger cursor px-6 rounded-xl mr-7 mb-7"
							style={{ height: "110px" }}
						>
							<div className="mt-8">
								<h3 className="text-danger text-center font-size-15">
									{expired}
								</h3>
								<div className="text-center">
									<label className="text-danger">Expired</label>
								</div>
							</div>
						</div>
					</div>
				</div>

				<CardBody className="pt-0 mb-5">
					<div className="d-flex flex-column align-items-center">
						<CertificationChart chartData={chartData} />

						{certificationDataByMonth.length ? (
							<LinesChart legend="Month" cdata={certificationDataByMonth} />
						) : (
							<p>Loading Data...</p>
						)}
					</div>
				</CardBody>
			</Card>
			<ExpiredCertificatesModal
				show={isShowExpired}
				data={expiredCertificateData}
				onClose={e => setShowExpired(false)}
			></ExpiredCertificatesModal>
			<ExpiringCertificatesModal
				show={isShow}
				data={expiringCertificateData}
				onClose={e => setShow(false)}
			></ExpiringCertificatesModal>
		</>
	);
}
export default DashboardCertification;
