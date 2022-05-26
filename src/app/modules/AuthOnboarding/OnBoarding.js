import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";

import { Tab, Tabs, Form, Button, Table, InputGroup } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";
import { fetchJSON } from "../../../_metronic/_helpers/api";
const EMAIL_REG_EXP = /[^\w.\s]/gi;
function OnBoarding(props) {
	const [activeTab, setActiveTab] = useState("home");
	const [currencies, setCurrencies] = useState([]);
	const [vertical, setVertical] = useState([]);
	const [verticals, setVerticals] = useState([]);
	const [yearErrorMsg, setYearErrorMsg] = useState([]);
	const [geoGraphical, setGeoGraphical] = useState([]);
	const [userEmail, setUserEmail] = useState("");
	const [fileData, setFileData] = useState(null);
	const [regions, setRegions] = useState([]);
	const [fileError, setFileError] = useState("");
	const [businessGroups, setBusinessGroups] = useState([]);
	const [generalInfo, setGeneralInfo] = useState(null);
	const [orgInfo, setOrgInfo] = useState(null);
	const [errMsgPartner, setErrMsgPartner] = useState("");
	const [errmsgOffice, setErrMsgOffice] = useState("");
	const [errMsgZip, setErrMsgZip] = useState("");
	const [errMsgGeographies, setErrMsgGeographies] = useState("");
	const [errMsgBusinessGroup, setErrMsgBusinessGroup] = useState("");
	const [errMsgEmpAssociation, setErrMsgEmpAssociation] = useState("");

	const [formData, setFormData] = useState({});
	const [
		redirectToPrincipalSelection,
		setRedirectToPrincipalSelection,
	] = useState(false);
	const [redirectToHome, setRedirectToHome] = useState(false);

	useEffect(() => {
		getCurrencyList();
		getVerticalList();
		getRegionsList();
		const userDetails = window.localStorage.getItem("user-details")
			? JSON.parse(window.localStorage.getItem("user-details"))
			: null;
		if (!userDetails || !userDetails["userFirstLogin"]) {
			setRedirectToHome(true);
		}

		const companyDomain = userDetails["userEmail"].split("@");
		setUserEmail(companyDomain[1]);
	}, []);

	const getRegionsList = async () => {
		setRegions([]);
		const res = await fetchJSON(BASE_URL + "/dashboard/regions");
		if (res) {
			setRegions(res);
		}
	};

	const toNextTab = e => {
		handleTabChange();
	};

	const toPrevTab = e => {
		handlePrevTabchange();
	};

	const handleTabChange = () => {
		if (activeTab === "home") {
			setActiveTab("profile");
		}
		if (activeTab === "profile") {
			setActiveTab("contact");
		}
	};

	const getCurrencyList = async () => {
		const res = await fetchJSON(BASE_URL + "/currencies");
		if (res) {
			setCurrencies(res);
		}
	};

	const getVerticalList = async () => {
		const res = await fetchJSON(BASE_URL + "/verticals");
		if (res) {
			const verticalList = [];
			setVerticals(res);
			res.map(ele => {
				verticalList.push(ele.verticalName);
			});
			setVertical(verticalList);
		}
	};

	const handlePrevTabchange = () => {
		if (activeTab === "contact") {
			setActiveTab("profile");
		}
		if (activeTab === "profile") {
			setActiveTab("home");
		}
	};

	const onSubmit = value => {
		let isErrorOccurred = false;
		if (!value.partnerName.value) {
			setErrMsgPartner("Company Name is required");
			isErrorOccurred = true;
		} else {
			setErrMsgPartner("");
		}

		if (!value.partnerIncorporate.value) {
			setYearErrorMsg("Year of Incorporation is required");
			isErrorOccurred = true;
		} else {
			setYearErrorMsg("");
		}

		if (!value.partnerAddress.value) {
			setErrMsgOffice("Registered Office is required");
			isErrorOccurred = true;
		} else {
			setErrMsgOffice("");
		}

		if (!value.partnerZipcode.value) {
			setErrMsgZip("ZipCode is required");
			isErrorOccurred = true;
		} else {
			setErrMsgZip("");
		}

		if (businessGroups.length === 0) {
			setErrMsgBusinessGroup("Sectoral Focus is Required");
			isErrorOccurred = true;
		} else {
			setErrMsgBusinessGroup("");
		}

		if (!geoGraphical || geoGraphical.length === 0) {
			setErrMsgGeographies("Geographies is required");
			isErrorOccurred = true;
		} else {
			setErrMsgGeographies("");
		}

		if (!isErrorOccurred) {
			setErrMsgPartner("");
			setYearErrorMsg("");
			setErrMsgOffice("");
			setErrMsgZip("");
			setErrMsgGeographies("");
			setErrMsgBusinessGroup("");
			const businessGroup = [];
			businessGroups.map(ele => {
				const verticalObj = verticals.find(item => item.verticalName === ele);
				if (verticalObj) {
					const obj = {
						id: verticalObj["id"],
						text: verticalObj["verticalName"],
					};
					businessGroup.push(obj);
				}
			});
			const geoGraphy = [];
			geoGraphical.map(ele => {
				geoGraphy.push({
					text: ele,
				});
			});

			const userDetails = window.localStorage.getItem("user-details")
				? JSON.parse(window.localStorage.getItem("user-details"))
				: null;
			const generalInfo = {
				userId: userDetails["id"],
				partnerName: value.partnerName.value,
				partnerIncorporate: value.partnerIncorporate.value,
				partnerAddress: value.partnerAddress.value,
				partnerZipcode: value.partnerZipcode.value,
				partnerCurrency: parseInt(value.partnerCurrency.value, 10),
				partnerDateFormat: value.partnerDateFormat.value,
				partnerDomains: userEmail,
				partnerBusinessGroups: businessGroup,
				partnerGeographies: geoGraphy,
			};
			setGeneralInfo(generalInfo);
			toNextTab();
		}
	};

	const onOrgSubmit = data => {
		if (data.partnerTotalEmployees.value === "") {
			setErrMsgEmpAssociation("*Total no of employees are Required");
		} else {
			const partnerInvites = {
				alliances: formData?.partnerInvitesAH
					? formData?.partnerInvitesAH + "@" + userEmail
					: "",
				delivery: formData?.partnerInvitesDH
					? formData?.partnerInvitesDH + "@" + userEmail
					: "",
				finance: formData?.partnerInvitesFL
					? formData?.partnerInvitesFL + "@" + userEmail
					: "",
				hr: formData?.partnerInvitesHR
					? formData?.partnerInvitesHR + "@" + userEmail
					: "",
				marketing: formData?.partnerInvitesML
					? formData?.partnerInvitesML + "@" + userEmail
					: "",
				sales: formData?.partnerInvitesSL
					? formData?.partnerInvitesSL + "@" + userEmail
					: "",
			};
			const partnerSocialMedia = {
				facebook: data.partnerSocialMediaFB.value,
				linkedin: data.partnerSocialMediaLD.value,
				twitter: data.partnerSocialMediaTW.value,
			};
			const orgInfoObj = {
				partnerInvites: [partnerInvites],
				partnerTotalEmployees: parseInt(data.partnerTotalEmployees.value, 10),
				partnerSocialMedia: partnerSocialMedia,
			};
			setOrgInfo(orgInfoObj);
			toNextTab();
		}
	};

	const onBoardingSubmit = () => {
		const payload = {
			...orgInfo,
			...generalInfo,
			partnerLogo: fileData
				? "https://s3.ap-south-1.amazonaws.com/staging.channlworks.com/uploads/" +
				  fileData
				: null,
		};
		fetchJSON(BASE_URL + "/onboarding/onboardadmin", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}).then(res => {
			if (res.user) {
				window.localStorage.setItem("user-details", JSON.stringify(res.user));
				setRedirectToPrincipalSelection(true);
			} else {
				setFileError(res["message"]); //Add toaster message here
			}
		});
	};

	const validateSize = event => {
		const file = event.target.files[0];
		const size = 30000;
		let err = "";
		if (file.size > size) {
			err = file.type + "is too large, please pick a smaller file\n";
			//  toast.error(err);
		}
		return true;
	};

	function alphaOnly(event) {
		var key = event.keyCode;
		return (key >= 65 && key <= 90) || key == 8;
	}

	const onFileChange = event => {
		const file = event.target.files[0];
		if (validateSize(event)) {
			const formData = new FormData();
			formData.append("document", file);
			fetchJSON(BASE_URL + "/uploadfile", {
				method: "POST",
				headers: {},
				body: formData,
			}).then(res => {
				if (res["status"]) {
					setFileData(res["data"]);
				} else {
					setFileError(res["message"]);
				}
			});
		}
	}; // need to discuss

	return (
		<div className="boarding-form">
			{redirectToHome ? <Redirect to="/home" /> : null}
			{redirectToPrincipalSelection ? <Redirect to="/principal" /> : null}
			<div className="card card-box-container card-custom gutter-b">
				<div className="card-body">
					<h3>Onboarding Wizard</h3>
					<label className="mt-3">
						Welcome to the onboarding wizard. Let us get you started.
					</label>
					<div className="mt-8">
						<Tabs
							activeKey={activeTab}
							id="noanim-tab-example"
							className="nav nav-pills nav-fill nav-justified"
							onSelect={k => {
								handlePrevTabchange();
							}}
						>
							<Tab eventKey="home" title="1. General Information">
								<Form
									className="mt-8"
									onSubmit={e => {
										e.preventDefault();
										onSubmit(e.target);
									}}
								>
									<div className="row">
										<div className="col-lg-6">
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Company Name *</Form.Label>
												<Form.Control type="text" name="partnerName" req />
												{errMsgPartner ? (
													<div className="fv-plugins-message-container ">
														<div className="fv-help-block">{errMsgPartner}</div>
													</div>
												) : null}
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Year of Incorporation *</Form.Label>
												<Form.Control
													type="number"
													name="partnerIncorporate"
													maxLength={4}
													onChange={e => {
														if (
															e.target.value < 1950 ||
															e.target.value > new Date().getFullYear()
														) {
															if (e.target.value > new Date().getFullYear()) {
																setYearErrorMsg(
																	`*Year of Incorporation is can't be greater than current year`
																);
															}
															if (e.target.value < 1950)
																setYearErrorMsg(
																	`*Year of Incorporation is can't be less than year 1950`
																);
														} else if (e.target.value.length !== 4)
															setYearErrorMsg("Invalid Year");
														else {
															setYearErrorMsg("");
														}
													}}
												/>
												{yearErrorMsg ? (
													<div className="fv-plugins-message-container ">
														<div className="fv-help-block">{yearErrorMsg}</div>
													</div>
												) :null}
											</Form.Group>
											
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Registered Office *</Form.Label>
												<Form.Control type="text" name="partnerAddress" />
												{errmsgOffice ? (
													<div className="fv-plugins-message-container ">
														<div className="fv-help-block">{errmsgOffice}</div>
													</div>
												) : null}
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>PIN/Zip Code *</Form.Label>
												<Form.Control
													type="number"
													name="partnerZipcode"
													type="number"
													maxlength="6"
													onChange={e => {
														if (e.target.value.length !== 6) {
															setErrMsgZip(`Invalid ZipCode`);
														} else {
															setErrMsgZip("");
														}
													}}
												/>
												{errMsgZip ? (
													<div className="fv-plugins-message-container ">
														<div className="fv-help-block">{errMsgZip}</div>
													</div>
												) : null}
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Geographies *</Form.Label>
												<Autocomplete
													required
													multiple
													name="Geographies"
													options={[]}
													freeSolo={true}
													options={regions}
													getOptionLabel={option =>
														option?.regionName || option?.text
													}
													onChange={(e, value) =>
														setGeoGraphical([
															...value.map(item => item.regionName),
														])
													}
													renderInput={params => (
														<TextField
															{...params}
															variant="outlined"
															placeholder="Start typing..."
														/>
													)}
												/>
												{errMsgGeographies ? (
													<div className="fv-plugins-message-container ">
														<div className="fv-help-block">
															{errMsgGeographies}
														</div>
													</div>
												) : null}
											</Form.Group>
										</div>
										<div className="col-lg-6">
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>
													Official domain used by your company
												</Form.Label>
												<Form.Control
													type="text"
													readOnly
													defaultValue={userEmail}
												/>
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Currencies</Form.Label>
												<Form.Control as="select" name="partnerCurrency">
													{currencies.length
														? currencies.map((ele, i) => (
																<option selected={i === 0} value={ele.id}>
																	{ele.currencyName +
																		" (" +
																		ele.currencyCode +
																		")"}
																</option>
														  ))
														: null}
												</Form.Control>
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Date Format</Form.Label>
												<Form.Control as="select" name="partnerDateFormat">
													<option selected={true} value="MM/DD/YYYY">
														MM/DD/YYYY
													</option>
													<option value="DD/MM/YYYY">DD/MM/YYYY</option>
													<option value="YYYY/MM/DD">YYYY/MM/DD</option>
												</Form.Control>
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Sectoral Focus</Form.Label>
												<Autocomplete
													multiple
													name="technology"
													options={vertical}
													freeSolo={true}
													// getOptionLabel={(option) => option}
													onChange={(e, value) => setBusinessGroups(value)}
													renderInput={params => (
														<TextField
															{...params}
															variant="outlined"
															placeholder="Sectoral Focus"
														/>
													)}
												/>
												{errMsgBusinessGroup ? (
													<div className="fv-plugins-message-container ">
														<div className="fv-help-block">
															{errMsgBusinessGroup}
														</div>
													</div>
												) : null}
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Upload Company logo</Form.Label>
												<Form.Control
													type="file"
													name="comment"
													onChange={e => {
														onFileChange(e);
													}}
												/>
											</Form.Group>
										</div>
										<div className="ml-auto">
											<Button type="submit" className="btn btn-primary">
												Proceed
											</Button>
										</div>
									</div>
									<div className="float-left">
										<p className="text-muted">
											Note * marked are required fields. Please fill the
											required fields before proceeding
										</p>
									</div>
								</Form>
							</Tab>
							<Tab eventKey="profile" title="2. Organization Information">
								<Form
									className="mt-8"
									onSubmit={e => {
										e.preventDefault();
										onOrgSubmit(e.target);
									}}
								>
									<div className="row">
										<div className="col-lg-6">
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Invite Human resources / L & D</Form.Label>
												<InputGroup>
													<Form.Control
														type="text"
														name="partnerInvitesHR"
														value={formData?.partnerInvitesHR}
														onChange={e =>
															setFormData({
																...formData,
																partnerInvitesHR: e.target.value.replace(
																	EMAIL_REG_EXP,
																	""
																),
															})
														}
														aria-describedby="basic-addon2"
													/>
													<InputGroup.Append>
														<InputGroup.Text id="basic-addon2">
															@{userEmail}
														</InputGroup.Text>
													</InputGroup.Append>
												</InputGroup>
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Invite Sales Lead</Form.Label>
												<InputGroup>
													<Form.Control
														type="text"
														name="partnerInvitesSL"
														value={formData?.partnerInvitesSL}
														onChange={e =>
															setFormData({
																...formData,
																partnerInvitesSL: e.target.value.replace(
																	EMAIL_REG_EXP,
																	""
																),
															})
														}
													/>
													<InputGroup.Append>
														<InputGroup.Text id="basic-addon2">
															@{userEmail}
														</InputGroup.Text>
													</InputGroup.Append>
												</InputGroup>
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Invite Finance / BizOps Lead</Form.Label>
												<InputGroup>
													<Form.Control
														type="text"
														name="partnerInvitesFL"
														value={formData?.partnerInvitesFL}
														onChange={e =>
															setFormData({
																...formData,
																partnerInvitesFL: e.target.value.replace(
																	EMAIL_REG_EXP,
																	""
																),
															})
														}
													/>
													<InputGroup.Append>
														<InputGroup.Text id="basic-addon2">
															@{userEmail}
														</InputGroup.Text>
													</InputGroup.Append>
												</InputGroup>
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Invite Delivery Head </Form.Label>
												<InputGroup>
													<Form.Control
														type="text"
														name="partnerInvitesDH"
														value={formData?.partnerInvitesDH}
														onChange={e =>
															setFormData({
																...formData,
																partnerInvitesDH: e.target.value.replace(
																	EMAIL_REG_EXP,
																	""
																),
															})
														}
													/>
													<InputGroup.Append>
														<InputGroup.Text id="basic-addon2">
															@{userEmail}
														</InputGroup.Text>
													</InputGroup.Append>
												</InputGroup>
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Invite Alliances Head*</Form.Label>
												<InputGroup>
													<Form.Control
														type="text"
														name="partnerInvitesAH"
														required
														value={formData?.partnerInvitesAH}
														onChange={e =>
															setFormData({
																...formData,
																partnerInvitesAH: e.target.value.replace(
																	EMAIL_REG_EXP,
																	""
																),
															})
														}
													/>
													<InputGroup.Append>
														<InputGroup.Text id="basic-addon2">
															@{userEmail}
														</InputGroup.Text>
													</InputGroup.Append>
												</InputGroup>
											</Form.Group>
										</div>
										<div className="col-lg-6">
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Invite Marketing Leader</Form.Label>
												<InputGroup>
													<Form.Control
														type="text"
														name="partnerInvitesML"
														value={formData?.partnerInvitesML}
														onChange={e =>
															setFormData({
																...formData,
																partnerInvitesML: e.target.value.replace(
																	EMAIL_REG_EXP,
																	""
																),
															})
														}
													/>
													<InputGroup.Append>
														<InputGroup.Text id="basic-addon2">
															@{userEmail}
														</InputGroup.Text>
													</InputGroup.Append>
												</InputGroup>
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>
													Total number of employees in your organization *
												</Form.Label>
												<Form.Control
													type="number"
													name="partnerTotalEmployees"
													defaultValue={1}
												/>

												{errMsgEmpAssociation ? (
													<div className="fv-plugins-message-container ">
														<div className="fv-help-block">
															{errMsgEmpAssociation}
														</div>
													</div>
												) : null}
											</Form.Group>

											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Official URL for LinkedIn</Form.Label>
												<Form.Control type="url" name="partnerSocialMediaLD" />
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Official URL for Facebook</Form.Label>
												<Form.Control type="url" name="partnerSocialMediaFB" />
											</Form.Group>
											<Form.Group controlId="exampleForm.ControlTextarea1">
												<Form.Label>Official URL for Twitter</Form.Label>
												<Form.Control type="url" name="partnerSocialMediaTW" />
											</Form.Group>
										</div>
										<div className="ml-auto">
											<Button type="submit" className="btn btn-primary">
												Proceed
											</Button>
										</div>
									</div>
									<div className="float-left">
										<p className="text-muted">
											Note * marked are required fields. Please fill the
											required fields before proceeding
										</p>
									</div>
								</Form>
							</Tab>
							<Tab eventKey="contact" title="3. Review Information">
								<div className="row">
									<div className="col-lg-12">
										<h5 className="mt-10">General Information</h5>
										<hr />
										<Table borderless>
											<tr>
												<td>
													<b>Company Name : </b>
													{generalInfo ? generalInfo.partnerName : ""}
												</td>
												<td>
													<b> Year of Incorporation : </b>
													{generalInfo ? generalInfo.partnerIncorporate : ""}
												</td>
											</tr>
											<tr>
												<td>
													<b>Registered Office : </b>
													{generalInfo ? generalInfo.partnerAddress : ""}
												</td>

												<td>
													<b>ZipCode : </b>
													{generalInfo ? generalInfo.partnerZipcode : ""}
												</td>
											</tr>
											<tr>
												<td>
													<b>Currency : </b>
													{generalInfo && generalInfo.partnerCurrency
														? currencies.find(
																ele => ele.id === generalInfo.partnerCurrency
														  ).currencyName
														: ""}
												</td>
												<td>
													<b> Date Format : </b>
													{generalInfo ? generalInfo.partnerDateFormat : ""}
												</td>
											</tr>
											<tr>
												<td colspan="2">
													<b> Geographies : </b>
													{generalInfo
														? generalInfo.partnerGeographies.map(ele => {
																return (
																	<span className="label label-lg label-light-info label-inline mr-2">
																		{ele.text}
																	</span>
																);
														  })
														: ""}
												</td>
											</tr>
											<tr>
												<td colspan="2">
													<b>Domains : </b>
													<span className="label label-lg label-light-info label-inline  mr-2">
														{generalInfo ? generalInfo.partnerDomains : ""}
													</span>
												</td>
											</tr>

											<tr>
												<td colspan="2">
													<span
														className="label-inline"
														style={{ maxWidth: 150 }}
													>
														<b> Sectoral Focus (Business Groups): </b>
													</span>
													{generalInfo
														? generalInfo.partnerBusinessGroups.map(ele => {
																return (
																	<span className="label label-lg label-light-info label-inline  mr-2">
																		{ele.text}
																	</span>
																);
														  })
														: ""}{" "}
												</td>
											</tr>
										</Table>
									</div>
									<div className="col-lg-12">
										<h5 className="mt-10">Organization Information</h5>
										<hr />
										<Table borderless>
											<tr>
												<td>
													<b>Total Employees : </b>
													{orgInfo ? orgInfo.partnerTotalEmployees : ""}
												</td>
												<td>
													<b>HR : </b>
													{orgInfo ? orgInfo.partnerInvites[0].hr : ""}
												</td>
											</tr>
											<tr>
												<td>
													<b>Sales : </b>
													{orgInfo ? orgInfo.partnerInvites[0].sales : ""}
												</td>
												<td>
													<b>Finance : </b>
													{orgInfo ? orgInfo.partnerInvites[0].finance : ""}
												</td>
											</tr>
											<tr>
												<td>
													<b>Delivery : </b>
													{orgInfo ? orgInfo.partnerInvites[0].delivery : ""}
												</td>
												<td>
													<b>Alliances : </b>
													{orgInfo ? orgInfo.partnerInvites[0].alliances : ""}
												</td>
											</tr>
											<tr>
												<td>
													<b> Marketing : </b>
													{orgInfo ? orgInfo.partnerInvites[0].marketing : ""}
												</td>
												<td>
													<b>LinkedIn : </b>
													{orgInfo
														? orgInfo.partnerSocialMedia["linkedin"]
														: ""}
												</td>
											</tr>
											<tr>
												<td>
													<b> Facebook : </b>
													{orgInfo
														? orgInfo.partnerSocialMedia["facebook"]
														: ""}
												</td>
												<td>
													<b> Twitter : </b>
													{orgInfo ? orgInfo.partnerSocialMedia["twitter"] : ""}
												</td>
											</tr>
											{/* <tr>
                        <td>Business Groups : {orgInfo ? orgInfo.partnerTotalEmployees : ''}</td>
                      </tr> */}
										</Table>
									</div>
								</div>
								<div className="d-flex justify-content-between">
									<Button
										className="btn btn-info"
										onClick={e => setActiveTab("home")}
									>
										Edit Details
									</Button>
									{/* <Link to="/authentication/principal-selection"> */}
									<Button
										type="submit"
										className="btn btn-primary"
										onClick={() => onBoardingSubmit()}
									>
										Proceed & Continue
									</Button>
									{/* </Link> */}
								</div>
							</Tab>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OnBoarding;
