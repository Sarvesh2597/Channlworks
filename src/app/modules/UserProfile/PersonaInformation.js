import React, { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
import * as auth from "../Auth";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL, UPLOADS_URL } from "../../../_metronic/_constants/endpoints";
import { Form } from "react-bootstrap";

//
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormError, FormInput } from "../../Components/Basic/Form";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		justifyContent: "center",
		flexWrap: "wrap",
		listStyle: "none",
		padding: theme.spacing(0.5),
		margin: 0,
	},
	chip: {
		margin: theme.spacing(0.5),
	},
}));

function PersonaInformation(props) {
	// Fields

	const [profile, setProfile] = useState({
		id: null,
		dateFormat: "",
		partnerAddress: "",
		partnerCurrency: undefined,
		partnerDomains: "",
		partnerGeographies: [],
		partnerIncorporate: "",
		partnerLogo: "",
		partnerName: "",
		partnerSocialMedia: {
			linkedin: "",
			twitter: "",
			facebook: "",
		},
		partnerTotalEmployees: undefined,
		partnerZipcode: "",
		partnerBusinessGroups: [],
	});

	const [vertical, setVertical] = useState([]);
	const [regions, setRegions] = useState([]);
	const [currencies, setCurrencies] = useState([]);
	const [loading, setloading] = useState(false);
	const [pic, setPic] = useState("");
	const dispatch = useDispatch();
	const user = useSelector(state => state.auth.user, shallowEqual);
	const classes = useStyles();
	const [chipData, setChipData] = React.useState([]);
	const [yearErrorMsg, setYearErrorMsg] = useState("");

	const companySchema = Yup.object().shape({
		id: Yup.number(),
		dateFormat: Yup.string(),
		partnerAddress: Yup.string().required("address required"),
		partnerCurrency: Yup.number()
			.typeError("must provide a number")
			.min(1),
		partnerDomains: Yup.string(),
		partnerGeographies: Yup.array()
			.of(
				Yup.object().shape({
					text: Yup.string(),
				})
			)
			.min(1, "atleast 1 geographies location required"),
		partnerIncorporate: Yup.string()
			.matches(RegExp(/^\d+$/), "Invalid Incorporation Year")
			.required("Incorporation Year required")
			.min(4, "min 4 digit")
			.max(4, "max 4 digit"),

		partnerLogo: Yup.string().required(),
		partnerName: Yup.string().required("organization name required"),
		partnerSocialMedia: Yup.object({
			linkedin: Yup.string(),
			twitter: Yup.string(),
			facebook: Yup.string(),
		}),
		partnerTotalEmployees: Yup.number()
			.typeError("must provide a number")
			.min(1),
		partnerZipcode: Yup.string()
			.matches(RegExp(/^\d+$/), "Invalid Zipcode")
			.required("Zipcode required")
			.min(6, "min 6 digit")
			.max(6, "max 6 digit"),
		partnerBusinessGroups: Yup.array()
			.of(
				Yup.object().shape({
					id: Yup.string(),
					text: Yup.string(),
				})
			)
			.min(1, "atleast 1 sectoral focus required"),
	});

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		mode: "all",
		resolver: yupResolver(companySchema),
		defaultValues: profile,
	});

	const handleDelete = chipToDelete => () => {
		setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
	};
	useEffect(() => {
		if (user.pic) {
			setPic(user.pic);
		}
	}, [user]);

	const getRegionsList = async () => {
		setRegions([]);
		const res = await fetchJSON(BASE_URL + "/dashboard/regions");
		if (res) {
			setRegions(res);
		}
	};
	const getCurrencies = async () => {
		setCurrencies([]);
		const res = await fetchJSON(BASE_URL + "/currencies");
		if (res) {
			setCurrencies(res);
		}
	};

	useEffect(() => {
		getRegionsList();
		getCurrencies();
	}, []);

	const getProfileList = async () => {
		setProfile([]);
		const res = await fetchJSON(BASE_URL + "/dashboard/profile");
		if (res) {
			Object.keys(res).map(d => {
				setValue(d, res[d], { shouldDirty: true, shouldValidate: true });
			});
			setProfile(res);

			setChipData([
				...res.partnerGeographies.map((item, index) => {
					return { key: index, label: item.text };
				}),
			]);
		}
	};

	const getVerticalList = async () => {
		setVertical([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(BASE_URL + "/verticals");
		if (res) {
			console.log(res);
			setVertical(res);
		}
	};

	useLayoutEffect(() => {
		getProfileList();
		getVerticalList();
	}, []);

	// Methods
	const saveUser = (values, setStatus, setSubmitting) => {
		if (!values.partnerIncorporate) {
			setYearErrorMsg("Year of Incorporation is required");
			return;
		} else {
			setYearErrorMsg("");
		}

		setloading(true);
		const updatedUser = Object.assign(user, values);
		// user for update preparation

		console.log("updated user", updatedUser);

		//dispatch(props.setUser(updatedUser));
		setTimeout(() => {
			setloading(false);
			setSubmitting(false);
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
		pic: user.pic,
		firstname: user.firstname,
		lastname: user.lastname,
		companyName: user.companyName,
		phone: user.phone,
		email: user.email,
		website: user.website,
	};

	const Schema = Yup.object().shape({
		pic: Yup.string(),
		firstname: Yup.string().required("First name is required"),
		lastname: Yup.string().required("Last name is required"),
		companyName: Yup.string(),
		phone: Yup.string().required("Phone is required"),
		email: Yup.string()
			.email("Wrong email format")
			.required("Email is required"),
		website: Yup.string(),
	});

	const getInputClasses = fieldname => {
		if (formik.touched[fieldname] && formik.errors[fieldname]) {
			return "is-invalid";
		}

		if (formik.touched[fieldname] && !formik.errors[fieldname]) {
			return "is-valid";
		}

		return "";
	};

	const formik = useFormik({
		initialValues,
		validationSchema: Schema,
		onSubmit: (values, { setStatus, setSubmitting }) => {
			saveUser(values, setStatus, setSubmitting);
			console.log("saving user ...", values);
		},
		onReset: (values, { resetForm }) => {
			resetForm();
		},
	});
	const getUserPic = () => {
		if (!pic) {
			return "none";
		}

		return `url(${pic})`;
	};
	const removePic = () => {
		setPic("");
	};

	const updateProfile = async values => {
		console.log("updateee", values);
		const res = await fetchJSON(BASE_URL + "/dashboard/profile", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
		});
		if (res) {
			getProfileList();
			let userDetails = JSON.parse(localStorage.getItem("user-details"));
			userDetails.Partner.dateFormat = profile.dateFormat;
			userDetails.Partner.Currency.currencyCode = currencies.find(
				item => item.id == profile.partnerCurrency
			).currencyCode;
			localStorage.setItem("user-details", JSON.stringify(userDetails));
		}
	};

	const uploadProfilePic = async e => {
		const formData = new FormData();
		for (let i = 0; i < e.target.files.length; i++) {
			formData.append("document", e.target.files[i]);
		}
		const resp = await fetchJSON(BASE_URL + "/uploadfile", {
			headers: {},
			method: "POST",
			body: formData,
		});
		if (resp) {
			profile.partnerLogo = UPLOADS_URL + resp?.data?.name;
			updateProfile();
		}
	};

	return (
		<div className="card-box2">
			<form
				className="card card-custom card-stretch"
				onSubmit={formik.handleSubmit}
			>
				{loading && <ModalProgressBar />}

				{/* begin::Header */}
				<div className="card-header py-3">
					<div className="card-title align-items-start flex-column">
						<h3 className="card-label font-weight-bolder text-dark mt-3">
							Company Information
						</h3>
						{/* <span className="text-muted font-weight-bold font-size-sm mt-1">
            Update your personal informaiton
          </span> */}
					</div>
					<div className="card-toolbar">
						<button
							onClick={handleSubmit(updateProfile)}
							className="btn btn-success mr-2"
							disabled={
								formik.isSubmitting || (formik.touched && !formik.isValid)
							}
						>
							Save Changes
						</button>
						{/* <Link
              to="/user-profile/profile-overview"
              className="btn btn-secondary"
            >
              Cancel
            </Link> */}
					</div>
				</div>
				{/* end::Header */}
				{/* begin::Form */}
				<div className="form">
					{/* begin::Body */}
					<div className="card-body">
						{/* <div className="row">
              <label></label>
              <div>
                <h5 className="font-weight-bold mb-6">Company Info</h5>
              </div>
            </div> */}
						<div className="form-group row">
							{/* <label className="col-xl-3 col-lg-3 col-form-label">Avatar</label> */}
							<div className="col-lg-9 col-xl-6">
								<div
									className="image-input image-input-outline"
									id="kt_profile_avatar"
								>
									{/* <div
                    className="image-input-wrapper"
                   
                  > */}
									<img src={profile.partnerLogo} width="150" height="100"></img>
									{/* </div> */}
									<label
										className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
										data-action="change"
										data-toggle="tooltip"
										title=""
										data-original-title="Change avatar"
									>
										<i className="fa fa-pen icon-sm text-muted"></i>
										<input
											type="file"
											// name="pic"
											onChange={e => uploadProfilePic(e)}
											accept=".png, .jpg, .jpeg"
										/>
										<input type="hidden" name="profile_avatar_remove" />
									</label>
									{/* <span
                    className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                    data-action="cancel"
                    data-toggle="tooltip"
                    title=""
                    data-original-title="Cancel avatar"
                  >
                    <i className="ki ki-bold-close icon-xs text-muted"></i>
                  </span> */}
									{/* <span
                    onClick={removePic}
                    className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                    data-action="remove"
                    data-toggle="tooltip"
                    title=""
                    data-original-title="Remove avatar"
                  >
                    <i className="ki ki-bold-close icon-xs text-muted"></i>
                  </span> */}
								</div>
								<span className="form-text text-muted">
									Allowed file types: png, jpg, jpeg.
								</span>
							</div>
						</div>

						<div className="form-group row">
							<label className="col-xl-3 col-lg-3 col-form-label text-label">
								Organization Name
							</label>
							<div className="col-lg-9 col-xl-6">
								<FormInput
									type="text"
									placeholder="Organization Name"
									name="partnerName"
									register={register}
									className={`form-control form-control-lg form-control`}
								/>
								<FormError error={errors["partnerName"]?.message} />
							</div>
						</div>
						<div className="form-group row">
							<label className="col-xl-3 col-lg-3 col-form-label text-label">
								Address
							</label>
							<div className="col-lg-9 col-xl-6">
								<FormInput
									type="text"
									placeholder="Address"
									name="partnerAddress"
									register={register}
									className={`form-control form-control-lg form-control`}
								/>
								<FormError error={errors["partnerAddress"]?.message} />
							</div>
						</div>
						<div className="form-group row">
							<label className="col-xl-3 col-lg-3 col-form-label">
								Year of Incorporation
							</label>
							<div className="col-lg-9 col-xl-6">
								<FormInput
									type="text"
									placeholder="Year"
									name="partnerIncorporate"
									register={register}
									className={`form-control form-control-lg form-control`}
									error={errors?.partnerIncorporate?.message}
								/>
								<FormError error={errors["partnerIncorporate"]?.message} />
							</div>
						</div>
						<div className="form-group row">
							<label className="col-xl-3 col-lg-3 col-form-label">
								Operating Geographies
							</label>
							<div className="col-lg-9 col-xl-6">
								{regions.length && profile.partnerGeographies && (
									<Autocomplete
										multiple
										id="tags-standard"
										defaultValue={
											watch("partnerGeographies") || profile.partnerGeographies
										}
										options={regions}
										getOptionLabel={option =>
											option?.regionName || option?.text
										}
										onChange={(e, value) => {
											setValue(
												"partnerGeographies",
												[
													...value.map(item => {
														if (item.text) {
															return { text: item.text };
														} else if (item.regionName) {
															return { text: item.regionName };
														}
													}),
												],
												{ shouldDirty: true, shouldValidate: true }
											);
										}}
										renderInput={params => (
											<TextField
												{...params}
												variant="outlined"
												placeholder="Geographies"
											/>
										)}
									/>
								)}
								<FormError error={errors["partnerGeographies"]?.message} />
							</div>
						</div>
						<div className="form-group row">
							<label className="col-xl-3 col-lg-3 col-form-label">
								Sectoral Focus
							</label>
							<div className="col-lg-9 col-xl-6">
								{vertical.length && profile?.partnerBusinessGroups && (
									<Autocomplete
										multiple
										id="tags-standard"
										options={vertical}
										getOptionLabel={option =>
											option?.verticalName || option?.text
										}
										onChange={(e, value) =>
											setValue(
												"partnerBusinessGroups",
												[
													...value.map(item => {
														return {
															id: item.id,
															text: item.verticalName || item.text,
														};
													}),
												],
												{ shouldDirty: true, shouldValidate: true }
											)
										}
										defaultValue={profile?.partnerBusinessGroups || []}
										renderInput={params => (
											<TextField
												{...params}
												variant="outlined"
												placeholder="Sectoral Focus"
											/>
										)}
									/>
								)}
								<FormError error={errors["partnerBusinessGroups"]?.message} />
							</div>
						</div>

						<div className="form-group row">
							<label className="col-xl-3 col-lg-3 col-form-label">
								Currency
							</label>
							<div className="col-lg-9 col-xl-6">
								<select
									value={watch("partnerCurrency")}
									onChange={e =>
										setValue("partnerCurrency", e.target.value, {
											shouldDirty: true,
											shouldValidate: true,
										})
									}
									className={`form-control form-control-lg form-control`}
									name="partnerCurrency"
								>
									{currencies.map(item => {
										return <option value={item.id}>{item.currencyName}</option>;
									})}
								</select>
								<FormError error={errors["partnerCurrency"]?.message} />
							</div>
						</div>

						<div className="form-group row">
							<label className="col-xl-3 col-lg-3 col-form-label">
								Date Format
							</label>
							<div className="col-lg-9 col-xl-6">
								<Form.Control
									as="select"
									value={watch("dateFormat")}
									onChange={e => {
										setValue("dateFormat", e.target.value, {
											shouldDirty: true,
											shouldValidate: true,
										});
									}}
								>
									<option value="MMM DD, y">MMM dd, y</option>
									<option value="MMM DD, y, h:mm:ss a">
										MMM dd y, h:mm:ss a
									</option>
									<option value="MM/DD/YYYY">MM/DD/YYYY</option>
									<option value="DD-MM-YYYY">DD-MM-YYYY</option>
									<option value="DD/MM/YYYY">DD/MM/YYYY</option>
									<option value="YYYY/MM/DD">YYYY/MM/DD</option>
								</Form.Control>
								<FormError error={errors["dateFormat"]?.message} />
							</div>
						</div>

						<div className="form-group row">
							<label className="col-xl-3 col-lg-3 col-form-label">
								Total Employees
							</label>
							<div className="col-lg-9 col-xl-6">
								<FormInput
									type="text"
									placeholder="No. Of Employees"
									name="partnerTotalEmployees"
									register={register}
									className={`form-control form-control-lg form-control`}
								/>
								<FormError error={errors["partnerTotalEmployees"]?.message} />
							</div>
						</div>

						<div className="form-group row">
							<label className="col-xl-3 col-lg-3 col-form-label">
								Official Domain
							</label>
							<div className="col-lg-9 col-xl-6">
								<FormInput
									type="text"
									placeholder="Official Domain"
									name="partnerDomains"
									register={register}
									className={`form-control form-control-lg form-control`}
									disabled={true}
								/>
								<FormError error={errors["partnerDomains"]?.message} />
							</div>
						</div>

						<div className="form-group row">
							<label className="col-xl-3 col-lg-3 col-form-label">
								LinkedIn URL
							</label>
							<div className="col-lg-9 col-xl-6">
								<FormInput
									type="text"
									placeholder="LinkedIn URL"
									name="partnerSocialMedia.linkedin"
									register={register}
									className={`form-control form-control-lg form-control`}
								/>
								<FormError
									error={errors["partnerSocialMedia.linkedin"]?.message}
								/>
							</div>
						</div>
						<div className="form-group row">
							<label className="col-xl-3 col-lg-3 col-form-label">
								Facebook URL
							</label>
							<div className="col-lg-9 col-xl-6">
								<FormInput
									type="text"
									placeholder="Facebook URL"
									name="partnerSocialMedia.facebook"
									register={register}
									className={`form-control form-control-lg form-control`}
								/>
								<FormError
									error={errors["partnerSocialMedia.facebook"]?.message}
								/>
							</div>
						</div>
						<div className="form-group row">
							<label className="col-xl-3 col-lg-3 col-form-label">
								Twitter URL
							</label>
							<div className="col-lg-9 col-xl-6">
								<FormInput
									type="text"
									placeholder="Twitter URL"
									name="partnerSocialMedia.twitter"
									register={register}
									className={`form-control form-control-lg form-control`}
								/>
								<FormError
									error={errors["partnerSocialMedia.twitter"]?.message}
								/>
							</div>
						</div>
					</div>
					{/* end::Body */}
				</div>
				{/* end::Form */}
			</form>
		</div>
	);
}

export default connect(null, auth.actions)(PersonaInformation);
