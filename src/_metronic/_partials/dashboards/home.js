import React, { useState, useEffect } from "react";
import { MixedWidget1 } from "../widgets";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../_helpers";
import { fetchJSON } from "../../_helpers/api";
import { BASE_URL } from "../../_constants/endpoints";
import { Table } from "react-bootstrap";
import { Redirect } from "react-router";
import Icon from "@material-ui/core/Icon";
import ClientsChart from "./ClientsChart";
import LeadsChart from "./LeadsChart";

export function Home() {
	const [dashboardList, setDashboardList] = useState([]);
	const [redirectToOnboard, setRedirectToOnboard] = useState(false);

	useEffect(() => {
		const user = localStorage.getItem("user-details");
		if (JSON.parse(user).userFirstLogin) {
			setRedirectToOnboard(true);
		} else {
			getDashboardList();
		}
	}, []);

	const getDashboardList = async () => {
		setDashboardList([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(BASE_URL + "/dashboard/home/" + partnerId);
		if (res) {
			console.log(res);
			setDashboardList(res);
		}
	};

	return (
		<div>
			{redirectToOnboard ? (
				<Redirect to="/authentication/on-boarding" />
			) : (
				<React.Fragment>
					<div className="row card-box3 mt-8">
						<div className="col-lg-6 col-xl-12">
							<MixedWidget1
								className="card-stretch gutter-b"
								dashboard={dashboardList}
							/>
						</div>
					</div>
					<div className="row equal-row">
						<div className="col-lg-6 equal-cols">
							<div className="card h-100">
								<div className="card-header text-center border-0 py-5">
									<h3 className="align-items-start flex-column">
										<span className="card-label font-weight-bolder text-dark">
											Top 5 Clients
										</span>
									</h3>
								</div>
								<div className="card-body chart-card  pt-0 pb-2">
									{dashboardList.topClients && (
										<ClientsChart
											data={dashboardList.topClients}
										></ClientsChart>
									)}
								</div>
							</div>
						</div>
						<div className="col-lg-6 equal-cols">
							<div className="card h-100">
								<div className="card-header text-center border-0 py-5">
									<h3 className="align-items-start flex-column">
										<span className="card-label font-weight-bolder text-dark">
											Top 5 Leads
										</span>
									</h3>
								</div>
								<div className="card-body chart-card pt-0 pb-2">
									{dashboardList.topLeads && (
										<LeadsChart data={dashboardList.topLeads}></LeadsChart>
									)}
								</div>
							</div>
						</div>
					</div>
				</React.Fragment>
			)}
		</div>
	);
}

export default Home;
