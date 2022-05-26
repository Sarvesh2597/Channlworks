/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
import { Table, Button, Modal, Form } from "react-bootstrap";
import * as auth from "../Auth";
import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";
import SnackbarComp from "../../Components/SnackbarComp";
import SkeletonComp from "../../Components/SkeletonComp";
import DataTable from "../../Components/DataTable";

function ChangePassword(props) {
	// Fields
	const [loading, setloading] = useState(false);
	const [isError, setisError] = useState(false);
	const [isEmailValid, setEmailError] = useState("");
	const [users, setUsers] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [orgMembers, setOrgMembers] = useState([]);
	const [invitedUsersList, setInvitedUsersList] = useState([]);
	const [loader, setLoader] = useState(false);
	const [modal, setModal] = useState(false);

	const [formData, setFormData] = useState({});

	const [updateModal, setUpdateModal] = useState(false);

	const [invitedUsers, setInvitedUsers] = useState([]);

	const [emailMsg, setEmailMsg] = useState("");

	const [isSuccess, setSuccess] = useState(false);
	const [message, setMessage] = useState(false);

	const handleShow = () => {
		setModal(!modal);
	};

	const showModal = () => {
		setUpdateModal(!updateModal);
	};

	const dispatch = useDispatch();
	const user = useSelector(state => state.auth.user, shallowEqual);
	useEffect(() => {}, [user]);
	// Methods
	const saveUser = (values, setStatus, setSubmitting) => {
		setloading(true);
		setisError(false);
		const updatedUser = Object.assign(user, {
			password: values.password,
		});
		// user for update preparation
		dispatch(props.setUser(updatedUser));
		setTimeout(() => {
			setloading(false);
			setSubmitting(false);
			setisError(true);
			// Do request to your server for user update, we just imitate user update there, For example:
			// update(updatedUser)
			//  .then(()) => {
			//    setloading(false);
			//  })
			//  .catch((error) => {
			//    setloading(false);
			//    setSubmitting(false);
			//    setStatus(error);
			// });
		}, 1000);
	};
	// UI Helpers
	const initialValues = {
		currentPassword: "",
		password: "",
		cPassword: "",
	};
	const Schema = Yup.object().shape({
		currentPassword: Yup.string().required("Current password is required"),
		password: Yup.string().required("New Password is required"),
		cPassword: Yup.string()
			.required("Password confirmation is required")
			.when("password", {
				is: val => (val && val.length > 0 ? true : false),
				then: Yup.string().oneOf(
					[Yup.ref("password")],
					"Password and Confirm Password didn't match"
				),
			}),
	});
	const formik = useFormik({
		initialValues,
		validationSchema: Schema,
		onSubmit: (values, { setStatus, setSubmitting }) => {
			saveUser(values, setStatus, setSubmitting);
		},
		onReset: (values, { resetForm }) => {
			resetForm();
		},
	});

	const getUsersList = async () => {
		setLoader(true);
		setUsers([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		console.log("hi");
		const res = await fetchJSON(
			BASE_URL + "/dashboard/myorg/members/" + partnerId
		);
		if (res) {
			console.log(res);
			setUsers(res);
			setTableData(res.orgMembers);
			setOrgMembers(res.orgMembers);
			setInvitedUsersList(res.orgDetails.invitedUsersList);
			setLoader(false);
		}
	};

	const reInviteUser = async item => {
		console.log(item);
		const objToSend = {
			email: item.email,
		};
		const res = await fetchJSON(BASE_URL + "/dashboard/myorg/reinvite-member", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(objToSend),
		});
		if (res) {
			setSuccess(true);
			setMessage("Re-Invited Successfully");
		}
	};

	const InviteUser = async item => {
		item.preventDefault();
		setEmailMsg("");
		var domain = formData.email && formData.email.split("@")[1];
		// var emailName = formData.email.substring(
		// 	0,
		// 	formData.email.lastIndexOf("@")
		// );

		if (
			domain !== undefined &&
			domain !==
				JSON.parse(localStorage.getItem("user-details")).Partner.partnerDomains
		) {
			setEmailMsg(
				`*wrong email address, don't specify domain address 
					<del className="text-info">@${domain}</del>`
			);
			return;
		}

		console.log(item);
		console.log(invitedUsers);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const userId = JSON.parse(user).id;

		const values = [...invitedUsers];
		setFormData({ ...formData });
		values.push({ invites: "" });
		setInvitedUsers(values);
		console.log(invitedUsers);
		let invites = users.orgDetails.invitedUsersList.map(item => {
			let key = item["role"];
			return { [key]: item.email };
		});
		const objToSend = {
			invites: [Object.assign(...invites)],
			newInvite: [
				{
					[formData.role]:
						formData.email +
						"@" +
						JSON.parse(localStorage.getItem("user-details")).Partner
							.partnerDomains,
				},
			],
			id: partnerId,
		};
		console.log(objToSend);
		const res = await fetchJSON(BASE_URL + "/dashboard/myorg/invitemember", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(objToSend),
		});
		if (res) {
			handleShow(!modal);
			getUsersList();
			setSuccess(true);
			setMessage("User Invited Successfully");
		}
	};

	const search = e => {
		if (e === "") {
			setTableData(orgMembers);
		} else {
			//This needs to more accurate
			let filteredData = orgMembers.filter(ele =>
				JSON.stringify(ele)
					.toLowerCase()
					.includes(e.toLowerCase())
			);
			setTableData(filteredData);
		}
	};

	const updateUser = async item => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;

		console.log(item);
		const objToSend = {
			id: formData.userId,
			partnerId: formData.partnerId,
			associationId: formData.associationId,
			businessGroup: formData.group,
			userIsActive: formData.active,
			userRole: formData.role,
			userName: formData.userName,
			userFirstLogin: formData.firstLogin,
			userVerified: formData.verified,
			userVerificationCode: formData.code,
			userEmail: formData.email,
			userPassword: formData.password,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		const res = await fetchJSON(BASE_URL + "/dashboard/myorg/members", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(objToSend),
		});
		if (res) {
			showModal(!updateModal);
			getUsersList();
			setSuccess(true);
			setMessage("Updated Successfully");
		}
	};

	useEffect(() => {
		getUsersList();
	}, []);

	const handleRowClick = item => {
		console.log(item);
		setFormData({
			userId: item.id,
			email: item.userEmail,
			role: item.userRole,
			active: item.userIsActive,
			partnerId: item.partnerId,
			associationId: item.associationId,
			group: item.businessGroup,
			userName: item.userName,
			firstLogin: item.userFirstLogin,
			verified: item.userVerified,
			code: item.userVerificationCode,
		});
		showModal(true);
	};

	const userListColumns = [
		{
			label: "Role Name",
			key: "role",
			isSort: true,
		},
		{
			label: "Email ID",
			key: "userEmail",
		},
		{
			label: "Status",
			key: "isActive",
			isSort: true,
			isTag: true,
			isCenter: true,
		},
		{
			label: "Joined On",
			key: "createdAt",
			minWidth: 120,
			isDate: true,
			isCenter: true,
		},
	];

	const invitedUsersListColumns = [
		{
			label: "Email Id",
			key: "email",
		},
		{
			label: "Status",
			key: "userStatus",
			isCenter: true,
		},
		{
			label: "Action",
			key: "action",
			isCenter: true,
		},
	];

	return (
		<div className="card-box2">
			<form className="card card-custom" onSubmit={formik.handleSubmit}>
				{loading && <ModalProgressBar />}

				{/* begin::Header */}
				<div className="card-header py-3">
					<div className="card-title align-items-start flex-column">
						<h4 className="card-label font-weight-bolder text-dark mt-3">
							Authorized Users
						</h4>
					</div>
					<div className="card-toolbar">
						<button
							type="submit"
							className="btn btn-primary mr-2"
							onClick={() => {
								handleShow();
								setFormData({});
							}}
						>
							Invite Users
						</button>
					</div>
				</div>

				<div className="card-spacer mt-4 bg-white">
					<div className="row">
						<div className="col-lg-12">
							<input
								type="text"
								className="form-control"
								name="searchText"
								placeholder="Search..."
								onChange={e => search(e.target.value)}
							/>
						</div>
					</div>

					<div className="row">
						<div className="col-lg-12">
							{/* <div className="my-7"></div> */}
							<DataTable
								loader={loader}
								columns={userListColumns}
								data={[
									...tableData.map(item => {
										item.role =
											item?.userRole.toLowerCase() === "hr"
												? "Human Resources"
												: item?.userRole.toLowerCase() === "sales"
												? "Sales Lead"
												: item?.userRole.toLowerCase() === "orgadmin"
												? "Org Admin"
												: item?.userRole.toLowerCase() === "marketing"
												? "Marketing Lead"
												: item?.userRole.toLowerCase() === "finance"
												? "Finance Lead"
												: item?.userRole.toLowerCase() === "alliances"
												? "Alliances Head"
												: item?.userRole.toLowerCase() === "delivery"
												? "Delivery"
												: "";
										item.isActive = item.userIsActive;
										return item;
									}),
								]}
							></DataTable>
						</div>
					</div>

					<div className="row mt-4">
						<div className="col-lg-12">
							<div className="my-7"></div>
							<h4 className="text-dark text-bold mb-6">Invited Users</h4>
							<DataTable
								loader={loader}
								columns={invitedUsersListColumns}
								data={[
									...invitedUsersList.map(item => {
										item.userStatus = (
											<span
												className={`label label-lg label-light-${
													item?.status ? "success" : "warning"
												} label-inline`}
											>
												{item?.status ? "Active" : "Registration Pending"}
											</span>
										);
										item.action = item?.status ? (
											""
										) : (
											<Button
												size="sm"
												className="btn btn-light-info"
												onClick={() => reInviteUser(item)}
											>
												Reinvite
											</Button>
										);
										return item;
									}),
								]}
							></DataTable>
						</div>
					</div>
				</div>
			</form>
			{/* {MODAL 1 STARTS HERE} */}
			<Modal size="md" show={modal} onHide={handleShow}>
				<Form onSubmit={e => InviteUser(e)}>
					<Modal.Header closeButton>
						<Modal.Title>Invite User</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Role *</Form.Label>
							<Form.Control
								as="select"
								name="role"
								required
								value={formData.role}
								onChange={e =>
									setFormData({ ...formData, role: e.target.value })
								}
							>
								<option></option>
								<option value="hr">Human Resources</option>
								<option value="sales">Sales Lead</option>
								<option value="finance">Finance Lead</option>
								<option value="Delivery">Delivery Head</option>
								<option value="alliances">Alliances Head</option>
								<option value="marketing">Marketing Lead</option>
							</Form.Control>
						</Form.Group>

						<div className="row">
							<div className="col-lg-7">
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label>Email *</Form.Label>
									<Form.Control
										type="name"
										name="email"
										required
										value={formData.email}
										// onInput={e=>{return false}}
										onChange={e =>
											setFormData({
												...formData,
												email: e.target.value,
											})
										}
									/>
									<label className="text-danger">{isEmailValid}</label>
								</Form.Group>
							</div>
							<div className="col-lg-4">
								<p className="mt-10">
									@
									{
										JSON.parse(localStorage.getItem("user-details")).Partner
											.partnerDomains
									}
								</p>
							</div>
						</div>
						{emailMsg ? (
							<p
								className="text-danger"
								dangerouslySetInnerHTML={{ __html: emailMsg }}
							/>
						) : null}
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
							type="submit"
							className="btn btn-light-success font-weight-bolder mr-5"
						>
							Invite
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
			{/* {MODAL 1 ENDS HERE} */}

			{/* {MODAL 2 STARTS HERE} */}
			<Modal size="md" show={updateModal} onHide={showModal}>
				<Modal.Header closeButton>
					<Modal.Title>User</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Change Email </Form.Label>
							<Form.Control
								type="name"
								name="email"
								value={formData.email}
								onChange={e =>
									setFormData({ ...formData, email: e.target.value })
								}
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Password </Form.Label>
							<Form.Control
								type="password"
								name="password"
								onChange={e =>
									setFormData({ ...formData, password: e.target.value })
								}
							/>
						</Form.Group>

						<Form.Label className="mt-8">Is user active</Form.Label>
						{/* 1 */}
						<div key={`default-1`} className="mb-3">
							<Form.Group controlId="exampleForm.ControlInput1">
								<Form.Check
									inline
									type={"radio"}
									label={`Yes`}
									name="active"
									onChange={e => setFormData({ ...formData, active: true })}
									checked={formData.active}
								/>

								<Form.Check
									inline
									// disabled
									type={"radio"}
									label={`No`}
									name="active"
									onChange={e => setFormData({ ...formData, active: false })}
									checked={formData.active === false}
								/>
							</Form.Group>
						</div>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="danger"
						onClick={showModal}
						className="btn btn-light-danger font-weight-bolder mr-5"
					>
						Close
					</Button>
					<Button
						// variant="danger"
						onClick={updateUser}
						className="btn btn-light-success font-weight-bolder mr-5"
					>
						Update
					</Button>
				</Modal.Footer>
			</Modal>
			{/* {MODAL 2 ENDS HERE} */}
			<SnackbarComp
				open={isSuccess}
				message={message}
				onClose={e => setSuccess(false)}
			></SnackbarComp>
		</div>
	);
}

export default connect(null, auth.actions)(ChangePassword);
