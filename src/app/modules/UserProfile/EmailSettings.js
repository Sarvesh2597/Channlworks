import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Table, Form, Toast, IconButton } from "react-bootstrap";
import * as auth from "../Auth";
import SnackbarComp from "../../Components/SnackbarComp";
import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";
import { useSnapshot } from "valtio";
import { valtioState } from "../../App";

function EmailSettings(props) {
	const [users, setUsers] = useState([]);
	const [navRoles, setNavRoles] = useState({});
	const [refreshUi, setRefresh] = useState(true);
	const [show, setShow] = useState(false);

	const [isSuccess, setSuccess] = useState(false);
	const [message, setMessage] = useState("");
	const [variant, setVariant] = useState("success");

	const getUsersList = async () => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		setUsers([]);
		try {
			const res = await fetchJSON(
				BASE_URL + "/dashboard/myorg/members/" + partnerId
			);
			if (res) {
				setUsers(res);
				setNavRoles(res.orgDetails.navRoles);
			}
		} catch (error) {}
	};

	useEffect(() => {
		getUsersList();
	}, []);
	const saveRoles = async e => {
		e.preventDefault();
		if (e) {
			let user = JSON.parse(localStorage.getItem("user-details"));
			const partnerId = user.partnerId;

			try {
				const res = await fetchJSON(
					BASE_URL + "/dashboard/update/navs-access/" + partnerId,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ navRoles }),
					}
				);
				if (res) {
					user.Partner.navRoles = navRoles;
					localStorage.setItem("user-details", JSON.stringify(user));
					setShow(true);
					setSuccess(true);
					setMessage("Managed Roles successfully updated");
				}
			} catch (error) {
				setSuccess(true);
				setMessage("Something went wrong");
				setVariant("error");
			}
		}
	};
	const changeRole = (e, key) => {
		eval(key);
		let newNavRoles = { ...navRoles };
		setNavRoles(newNavRoles);
	};

	const snap = useSnapshot(valtioState);
	return (
		<div className="card-box2">
			<form className="card card-custom">
				{/* begin::Header */}
				<div className="card-header py-3">
					<div className="card-title align-items-start flex-column">
						<h3 className="card-label font-weight-bolder text-dark mt-3">
							Manage Roles
						</h3>
					</div>
					{snap.navRoles?.editRoles.edit ? (
						<div className="card-toolbar">
							<button
								onClick={e => saveRoles(e)}
								className="btn btn-primary mr-2"
							>
								Save
							</button>
						</div>
					) : null}
				</div>

				<div className="card-spacer bg-white">
					<div className="row">
						<div className="col-lg-12">
							<div className="my-2"></div>
							<h5 className="mb-5">Manage Access by Role</h5>
							<div className="table-container">
								<Table bordered>
									<thead>
										<tr>
											<th>Navigation Name</th>
											<th className="text-center" style={{ minWidth: 30 }}>
												HR
											</th>
											<th className="text-center" style={{ minWidth: 30 }}>
												Finance
											</th>
											<th className="text-center" style={{ minWidth: 30 }}>
												Delivery
											</th>
											<th className="text-center" style={{ minWidth: 30 }}>
												Alliances
											</th>
											<th className="text-center" style={{ minWidth: 30 }}>
												Marketing
											</th>
											<th className="text-center" style={{ minWidth: 30 }}>
												Sales
											</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Clients (View)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.clients?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.clients.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.finance?.roles?.clients?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.clients.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.delivery?.roles?.clients?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.clients.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.alliances?.roles?.clients?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.clients.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.marketing?.roles?.clients?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.clients.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.clients?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.clients.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>

										<tr>
											<td>Clients (Edit)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.clients?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.clients.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.finance?.roles?.clients?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.clients.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.delivery?.roles?.clients?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.clients.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.alliances?.roles?.clients?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.clients.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.marketing?.roles?.clients?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.clients.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.clients?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.clients.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Clients (Add)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.clients?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.clients.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.finance?.roles?.clients?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.clients.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.delivery?.roles?.clients?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.clients.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.alliances?.roles?.clients?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.clients.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.marketing?.roles?.clients?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.clients.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.clients?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.clients.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Marketing Budgets (View)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.marketing?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.marketing.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.finance?.roles?.marketing?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.marketing.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.delivery?.roles?.marketing?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.marketing.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.alliances?.roles?.marketing?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.marketing.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.marketing?.roles?.marketing?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.marketing.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.marketing?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.marketing.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Marketing Budgets (Edit)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.marketing?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.marketing.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.finance?.roles?.marketing?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.marketing.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.delivery?.roles?.marketing?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.marketing.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.alliances?.roles?.marketing?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.marketing.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.marketing?.roles?.marketing?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.marketing.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.marketing?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.marketing.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Marketing Budgets (Add)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.marketing?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.marketing.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.finance?.roles?.marketing?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.marketing.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.delivery?.roles?.marketing?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.marketing.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.alliances?.roles?.marketing?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.marketing.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.marketing?.roles?.marketing?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.marketing.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.marketing?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.marketing.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Case Study (View)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.clientCaseStudy?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.clientCaseStudy.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.clientCaseStudy?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.clientCaseStudy.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.clientCaseStudy?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.clientCaseStudy.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.clientCaseStudy?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.clientCaseStudy.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.clientCaseStudy?.roles?.clientCaseStudy
															?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.clientCaseStudy.roles.clientCaseStudy.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles?.clientCaseStudy?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.clientCaseStudy.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Case Study (Edit)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.clientCaseStudy?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.clientCaseStudy.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.clientCaseStudy?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.clientCaseStudy.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.clientCaseStudy?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.clientCaseStudy.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.clientCaseStudy?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.clientCaseStudy.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.clientCaseStudy?.roles?.clientCaseStudy
															?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.clientCaseStudy.roles.clientCaseStudy.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles?.clientCaseStudy?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.clientCaseStudy.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Case Study (Add)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.clientCaseStudy?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.clientCaseStudy.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.clientCaseStudy?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.clientCaseStudy.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.clientCaseStudy?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.clientCaseStudy.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.clientCaseStudy?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.clientCaseStudy.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.clientCaseStudy?.roles?.clientCaseStudy
															?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.clientCaseStudy.roles.clientCaseStudy.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.clientCaseStudy?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.clientCaseStudy.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Vendor Contacts (View)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.contactList?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.contactList.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.finance?.roles?.contactList?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.contactList.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.delivery?.roles?.contactList?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.contactList.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.contactList?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.contactList.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.contactList?.roles?.contactList?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.contactList.roles.contactList.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.contactList?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.contactList.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Vendor Contacts (Edit)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.contactList?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.contactList.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.finance?.roles?.contactList?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.contactList.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.delivery?.roles?.contactList?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.contactList.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.contactList?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.contactList.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.contactList?.roles?.contactList?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.contactList.roles.contactList.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.contactList?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.contactList.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Vendor Contacts (Add)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.contactList?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.contactList.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.finance?.roles?.contactList?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.contactList.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.delivery?.roles?.contactList?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.contactList.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.alliances?.roles?.contactList?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.contactList.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.contactList?.roles?.contactList?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.contactList.roles.contactList.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.contactList?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.contactList.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Programs (View)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.hr?.roles?.partnerInformation?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.partnerInformation.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.partnerInformation?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.partnerInformation.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.partnerInformation?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.partnerInformation.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.partnerInformation?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.partnerInformation.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles
															?.partnerInformation?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.partnerInformation.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles?.partnerInformation?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.partnerInformation.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>

										<tr>
											<td>Programs (Edit)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.hr?.roles?.partnerInformation?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.partnerInformation.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.partnerInformation?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.partnerInformation.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.partnerInformation?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.partnerInformation.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.partnerInformation?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.partnerInformation.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles
															?.partnerInformation?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.partnerInformation.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles?.partnerInformation?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.partnerInformation.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Certified Employees (View)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.staffInformation?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.staffInformation.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.staffInformation?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.staffInformation.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.staffInformation?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.staffInformation.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.staffInformation?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.staffInformation.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles?.staffInformation
															?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.staffInformation.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles?.staffInformation?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.staffInformation.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Certified Employees (Edit)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.staffInformation?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.staffInformation.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.staffInformation?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.staffInformation.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.staffInformation?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.staffInformation.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.staffInformation?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.staffInformation.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles?.staffInformation
															?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.staffInformation.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles?.staffInformation?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.staffInformation.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Certified Employees (Add)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.staffInformation?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.staffInformation.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.staffInformation?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.staffInformation.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.staffInformation?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.staffInformation.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.staffInformation?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.staffInformation.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles?.staffInformation
															?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.staffInformation.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles?.staffInformation?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.staffInformation.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Leads (View)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.leads?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.leads.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.finance?.roles?.leads?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.leads.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.delivery?.roles?.leads?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.leads.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.alliances?.roles?.leads?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.leads.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles?.leads?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.leads.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.leads?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.leads.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Leads (Edit)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.leads?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.leads.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.finance?.roles?.leads?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.leads.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.delivery?.roles?.leads?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.leads.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.alliances?.roles?.leads?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.leads.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles?.leads?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.leads.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.leads?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.leads.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Leads (Add)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.leads?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.leads.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.finance?.roles?.leads?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.leads.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.delivery?.roles?.leads?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.leads.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.alliances?.roles?.leads?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.leads.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.marketing?.roles?.leads?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.leads.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.sales?.roles?.leads?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.leads.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Marketing AR/AP (View)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.financialRegister?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.financialRegister.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.financialRegister?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.financialRegister.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.financialRegister?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.financialRegister.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.financialRegister?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.financialRegister.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles?.financialRegister
															?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.financialRegister.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles?.financialRegister?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.financialRegister.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Marketing AR/AP (Add)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.financialRegister?.add}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.financialRegister.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.financialRegister?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.financialRegister.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.financialRegister?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.financialRegister.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.financialRegister?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.financialRegister.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles?.financialRegister
															?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.financialRegister.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles?.financialRegister?.add
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.financialRegister.add = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Marketing AR/AP (Add)</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.financialRegister?.edit}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.financialRegister.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.financialRegister?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.financialRegister.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.financialRegister?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.financialRegister.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.financialRegister?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.financialRegister.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles?.financialRegister
															?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.financialRegister.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles?.financialRegister?.edit
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.financialRegister.edit = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Dashboard Revenue</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.hr?.roles?.dashboard?.revenue?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.dashboard.revenue.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.dashboard?.revenue?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.dashboard.revenue.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.dashboard?.revenue?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.dashboard.revenue.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.dashboard?.revenue?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.dashboard.revenue.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles?.dashboard?.revenue
															?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.dashboard.revenue.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles?.dashboard?.revenue?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.dashboard.revenue.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Dashboard Leads</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={navRoles?.hr?.roles?.dashboard?.leads?.view}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.dashboard.leads.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles?.dashboard?.leads?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.dashboard.leads.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles?.dashboard?.leads?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.dashboard.leads.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles?.dashboard?.leads?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.dashboard.leads.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles?.dashboard?.leads
															?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.dashboard.leads.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles?.dashboard?.leads?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.dashboard.leads.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Dashboard Marketing</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.hr?.roles.dashboard?.marketing?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.dashboard.marketing.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles.dashboard?.marketing?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.dashboard.marketing.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles.dashboard?.marketing?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.dashboard.marketing.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles.dashboard?.marketing
															?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.dashboard.marketing.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles.dashboard
															?.marketing?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.dashboard.marketing.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles.dashboard?.marketing?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.dashboard.marketing.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Dashboard Case Study</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.hr?.roles.dashboard?.case_study?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.dashboard.case_study.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles.dashboard?.case_study?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.dashboard.case_study.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles.dashboard?.case_study
															?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.dashboard.case_study.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles.dashboard?.case_study
															?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.dashboard.case_study.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles.dashboard
															?.case_study?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.dashboard.case_study.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles.dashboard?.case_study?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.dashboard.case_study.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Dashboard Certifications</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.hr?.roles.dashboard?.certifications?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.hr.roles.dashboard.certifications.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.finance?.roles.dashboard?.certifications
															?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.finance.roles.dashboard.certifications.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.delivery?.roles.dashboard?.certifications
															?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.delivery.roles.dashboard.certifications.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.alliances?.roles.dashboard?.certifications
															?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.alliances.roles.dashboard.certifications.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.marketing?.roles.dashboard
															?.certifications?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.marketing.roles.dashboard.certifications.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
											<td className="text-center" style={{ minWidth: 20 }}>
												<Form.Check
													aria-label="option 1"
													checked={
														navRoles?.sales?.roles.dashboard?.certifications
															?.view
													}
													onChange={e =>
														changeRole(
															e,
															"navRoles.sales.roles.dashboard.certifications.view = e.target.checked ? true:false"
														)
													}
												/>
											</td>
										</tr>
									</tbody>
								</Table>
							</div>
						</div>
					</div>
				</div>
			</form>
			{isSuccess && (
				<SnackbarComp
					open={isSuccess}
					message={message}
					variant={variant}
					onClose={e => setSuccess(false)}
				></SnackbarComp>
			)}
		</div>
	);
}

export default connect(null, auth.actions)(EmailSettings);
