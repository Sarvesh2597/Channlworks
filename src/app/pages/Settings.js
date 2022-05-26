/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../_metronic/_partials/controls";
import SnackbarComp from "../Components/SnackbarComp";

import { fetchJSON } from "../../_metronic/_helpers/api";
import { BASE_URL } from "../../_metronic/_constants/endpoints";

function Settings(props) {
	// Fields
	const [loading, setloading] = useState(false);
	const [isError, setisError] = useState(false);

	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: "",
	});
	const [isSuccess, setSuccess] = useState(false);
	const [message, setMessage] = useState("");
	const [variant, setVariant] = useState("success");

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

	const updatedUser = async () => {
		const user = localStorage.getItem("user-details");
		const userId = JSON.parse(user).id;

		// console.log(item);
		const objToSend = {
			id: userId,
			userName: formData.nameUser,
		};

		try {
			const res = await fetchJSON(BASE_URL + "/dashboard/username", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(objToSend),
			});
			if (res) {
			}
			setSuccess(true);
			setMessage("User successfully updated");
		} catch (error) {
			setSuccess(true);
			setMessage("Something went wrong");
			setVariant("error");
		}
	};

	const updatedPassword = async e => {
		e.preventDefault();

		const user = localStorage.getItem("user-details");
		const userId = JSON.parse(user).id;

		const objToSend = {
			newPassword: formData.password,
		};
		try {
			const res = await fetchJSON(
				BASE_URL + "/dashboard/update-password/user/" + userId,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(objToSend),
				}
			);
			if (res) {
				setFormData({ password: "", confirmPassword: "" });
				setSuccess(true);
				setMessage("Password successfully updated");
			}
		} catch (error) {
			setSuccess(true);
			setMessage("Something went wrong");
			setVariant("error");
		}
	};

	const checkUser = async item => {
		const objToSend = {
			username: formData.nameUser,
		};
		const res = await fetchJSON(BASE_URL + "/onboarding/checkusername", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(objToSend),
		});
		if (res) {
		}
	};

	const name = localStorage.getItem("user-details");
	const userName = JSON.parse(name).userEmail;

	return (
		<div className="card-box">
			<div className="row">
				<div className="col-lg-6">
					<form className="card card-custom" onSubmit={updatedPassword}>
						{/* begin::Header */}
						<div className="card-header py-3">
							<div className="card-title align-items-start flex-column">
								<h3 className="card-label font-weight-bolder text-dark">
									Change / Update Password
								</h3>
								<span className="text-muted font-weight-bold font-size-sm mt-1">
									Change or update your account password
								</span>
							</div>
							<div className="card-toolbar">
								<button type="submit" className="btn btn-primary mr-2">
									Update
								</button>
							</div>
						</div>
						{/* end::Header */}
						{/* begin::Form */}
						<div className="form">
							<div className="card-body">
								{/* <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label text-alert">
                    Current Password
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className={`form-control form-control-lg form-control-solid mb-2`}
                      name="currentPassword"
                    />
                    <a href="#" className="text-sm font-weight-bold">
                      Forgot password ?
                    </a>
                  </div>
                </div> */}
								<div className="form-group row">
									<label className="col-xl-3 col-lg-3 col-form-label text-alert">
										New Password
									</label>
									<div className="col-lg-9 col-xl-6">
										<input
											type="password"
											placeholder="New Password"
											className={`form-control form-control-lg form-control-solid`}
											name="password"
											value={formData.password}
											onChange={e =>
												setFormData({ ...formData, password: e.target.value })
											}
										/>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-xl-3 col-lg-3 col-form-label text-alert">
										Confirm New Password
									</label>
									<div className="col-lg-9 col-xl-6">
										<input
											type="password"
											placeholder="Verify Password"
											value={formData.confirmPassword}
											className={`form-control form-control-lg form-control-solid 
                      `}
											name="confirmPassword"
											onChange={e =>
												setFormData({
													...formData,
													confirmPassword: e.target.value,
												})
											}
										/>
									</div>
								</div>
							</div>
						</div>
						{/* end::Form */}
					</form>
				</div>

				<div className="col-lg-6">
					<form className="card card-custom" onSubmit={formik.handleSubmit}>
						{loading && <ModalProgressBar />}

						{/* begin::Header */}
						<div className="card-header py-3">
							<div className="card-title align-items-start flex-column">
								<h3 className="card-label font-weight-bolder text-dark">
									Username Settings
								</h3>
								<span className="text-muted font-weight-bold font-size-sm mt-1">
									Change your username
								</span>
							</div>
							<div className="card-toolbar">
								<button
									type="submit"
									className="btn btn-primary mr-2"
									onClick={() => {
										updatedUser();
										checkUser();
									}}
								>
									Update
								</button>
							</div>
						</div>
						{/* end::Header */}
						{/* begin::Form */}
						<div className="form">
							<div className="card-body">
								<div className="form-group row">
									<label className="col-xl-3 col-lg-3 col-form-label text-alert">
										Username
									</label>
									<div className="col-lg-9 col-xl-6">
										<input
											type="text"
											placeholder="Username"
											className={`form-control form-control-lg form-control-solid mb-2`}
											name="nameUser"
											defaultValue={userName}
											onChange={e =>
												setFormData({ ...formData, nameUser: e.target.value })
											}
										/>
									</div>
								</div>
							</div>
						</div>
						{/* end::Form */}
					</form>
				</div>
			</div>
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

export default Settings;
