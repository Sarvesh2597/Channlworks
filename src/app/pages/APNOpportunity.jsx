import React, { useState, useEffect } from "react";
import { Table, Form, Modal, Spinner } from "react-bootstrap";
import {
	Card,
	CardBody,
	CardHeader,
	CardHeaderToolbar,
} from "../../_metronic/_partials/controls";
import Button from "@material-ui/core/Button";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { fetchJSON } from "../../_metronic/_helpers/api";
import { BASE_URL } from "../../_metronic/_constants/endpoints";
import _ from "lodash";
import moment from "moment";
import { CSVLink } from "react-csv";
import { useHistory } from "react-router-dom";
import SnackbarComp from "../Components/SnackbarComp";
import { datePipe } from "../../_metronic/_helpers/date-pipe";
import SkeletonComp from "../Components/SkeletonComp";
import { Link, useLocation } from "react-router-dom";
import { Status } from "../../utils/helpers";
import { useSnapshot } from "valtio";
import { valtioState } from "../App";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormInput, FormInputDropDown } from "../Components/Basic/Form";
import { FormTextArea } from "../Components/Basic/Form";
import { country } from "./APNLeads/contries";
import { industry, stateValue } from "./APNLeads/states";

const schema = yup.object().shape({
	customerCompanyName: yup.string().required(),
	industry: yup.string().required(),
	country: yup.string().required(),
	postalCode: yup
		.string()
		.matches(RegExp(/^\d+$/), "invalid postal code")
		.required("required"),
	state: yup.string().required(),
	customerWebsite: yup.string().required(),
	partnerProjectTitle: yup.string().required(),
	projectDescription: yup.string().required(),
	partnerPrimaryNeedFromAws: yup.string().required(),
	useCase: yup.string().required(),
	expectedMonthlyAwsRevenue: yup.string().required(),
	targetCloseDate: yup.string().required(),
	deliveryModel: yup.string().required(),
	stage: yup.string().required(),
	opportunityOwnerName: yup.string().required(),
	opportunityOwnerEmail: yup.string().required(),
	isNetNewBusinessForCompany: yup.string().required(),
	contractVehicle: yup.string().required(),
	closedLostReason: yup.string().required(),
	awsFieldEngagement: yup.string().required(),
	awsAccountId: yup.string().required(),
	nextStep: yup.string().required(),
	campaignName: yup.string().required(),
	partnerAcceptanceStatus: yup.string().required(),
	apnCrmUniqueIdentifier: yup.string().required(),
	partnerCrmUniqueIdentifier: yup.string().required(),
	status: yup.string().required(),
	opportunityOwnership: yup.string().required(),
	subUseCase: yup.string(),
	streetAddress: yup.string(),
	isThisAPublicReference: yup.string(),
	publicReferenceUrl: yup.string(),
	publicReferenceTitle: yup.string(),
	primaryContactPhone: yup.string(),
	primaryContactLastName: yup.string(),
	primaryContactFirstName: yup.string(),
	primaryContactEmail: yup.string(),
	partnerPrimaryNeedFromAwsOther: yup.string(),
	partnerDeveloperManagerPhone: yup.string(),
	partnerDeveloperManagerEmail: yup.string(),
	partnerDeveloperManager: yup.string(),
	nextStepHistory: yup.string(),
	leadSource: yup.string(),
	lastModifiedDate: yup.string(),
	lastModifiedBy: yup.string(),
	isThisForMarketplace: yup.string(),
	isMarketingDevelopmentFunded: yup.string(),
	industryOther: yup.string(),
	customerTitle: yup.string(),
	customerPhone: yup.string(),
	customerLastName: yup.string(),
	customerFirstName: yup.string(),
	customerEmail: yup.string(),
	createdDate: yup.string(),
	createdBy: yup.string(),
	competitiveTracking: yup.string(),
	competitiveTrackingOther: yup.string(),
	city: yup.string(),
	aWSStage: yup.string(),
	aWSSalesRepName: yup.string(),
	aWSSalesRepEmail: yup.string(),
	aWSPartnerSuccessManagerName: yup.string(),
	aWSPartnerSuccessManagerEmail: yup.string(),
	aWSISVSuccessManagerName: yup.string(),
	aWSISVSuccessManagerEmail: yup.string(),
	aWSCloseDate: yup.string(),
	aWSAccountOwnerName: yup.string(),
	aWSAccountOwnerEmail: yup.string(),
	additionalComments: yup.string(),
	wWPSPDMEmail: yup.string(),
	wWPSPDM: yup.string(),
});

export function APNOpportunity(client) {
	const [show, setShow] = useState(false);

	const [type, setType] = useState("text");

	const [endDateType, setEndDateType] = useState("text");

	const [leads, setLeads] = useState([]);

	const [vertical, setVertical] = useState([]);

	const [regions, setRegions] = useState([]);

	const [principals, setPrincipals] = useState([]);

	const [activities, setActivities] = useState([]);

	const [selectedPrincipalId, setSelectedPrincipalId] = useState(null);

	const [formData, setFormData] = useState({});

	const [isEdit, setIsEdit] = useState(false);

	const [modal, setModal] = useState(false);

	const [fields, setFields] = useState([]);

	const [csvModal, setCSVModal] = useState(false);

	const [selectedPrincipalIdCSV, setSelectedPrincipalIdCSV] = useState(null);

	const [technology, setTechnology] = useState([]);

	const [totalValue, setTotalValue] = useState([]);

	const [clients, setClients] = useState([]);

	const [uploadCSVFile, setUploadCSVFile] = useState();

	const history = useHistory();

	const [isSuccess, setSuccess] = useState(false);
	const [message, setMessage] = useState(false);
	const [variant, setVariant] = useState("success");

	const [loader, setLoader] = useState(false);
	const [marketingYear, setMarketingYear] = useState(null);

	const location = useLocation();
	//csv
	const [csvStatus, setCsvStatus] = useState(Status.idle);

	//FILTERS STATES

	const [principalFilters, setPrincipalFilters] = useState("all");
	const [leadNameFilter, setLeadNameFilter] = useState("");
	const [startDateFilter, setStartDateFilter] = useState("");
	const [endDateFilter, setEndDateFilter] = useState("");
	const [verticalsFilter, setVerticalsFilter] = useState("");
	const [regionsFilter, setRegionsFilters] = useState("");
	const [leadTypeFilter, setLeadTypeFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [generatedFilter, setGeneratedFilter] = useState("");
	const [convertFilter, setConvertFilter] = useState("");
	const [ageingDaysFilter, setAgeingDaysFilter] = useState("");
	const [campaignNameFilter, setcampaignNameFilter] = useState("");
	const [resetFilter, setResetFilter] = useState("");

	const [csvData, setCSVData] = useState([]);
	const [csvError, setCSVError] = useState("");

	const [splitRevenue, setSplitsRevenue] = useState([]);
	const [totalRevenue, setTotalRevenue] = useState({
		totalPrincipal: 0,
		totalOthers: 0,
		totalServices: 0,
		grandTotal: 0,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "all",
		resolver: yupResolver(schema),
		defaultValues: {
			customerCompanyName: "",
			industry: "",
			country: "",
			postalCode: "",
			state: "",
			customerWebsite: "",
			partnerProjectTitle: "",
			projectDescription: "",
			partnerPrimaryNeedFromAws: "",
			useCase: "",
			expectedMonthlyAwsRevenue: "",
			targetCloseDate: "",
			deliveryModel: "",
			stage: "",
			opportunityOwnerName: "",
			opportunityOwnerEmail: "",
			isNetNewBusinessForCompany: "",
			contractVehicle: "",
			closedLostReason: "",
			awsFieldEngagement: "",
			awsAccountId: "",
			nextStep: "",
			campaignName: "",
			partnerAcceptanceStatus: "",
			apnCrmUniqueIdentifier: "",
			partnerCrmUniqueIdentifier: "",
			status: "",
			opportunityOwnership: "",
			subUseCase: "",
			streetAddress: "",
			isThisAPublicReference: "",
			publicReferenceUrl: "",
			publicReferenceTitle: "",
			primaryContactPhone: "",
			primaryContactLastName: "",
			primaryContactFirstName: "",
			primaryContactEmail: "",
			partnerPrimaryNeedFromAwsOther: "",
			partnerDeveloperManagerPhone: "",
			partnerDeveloperManagerEmail: "",
			partnerDeveloperManager: "",
			nextStepHistory: "",
			leadSource: "",
			lastModifiedDate: "",
			lastModifiedBy: "",
			isThisForMarketplace: "",
			isMarketingDevelopmentFunded: "",
			industryOther: "",
			customerTitle: "",
			customerPhone: "",
			customerLastName: "",
			customerFirstName: "",
			customerEmail: "",
			createdDate: "",
			createdBy: "",
			competitiveTracking: "",
			competitiveTrackingOther: "",
			city: "",
			aWSStage: "",
			aWSSalesRepName: "",
			aWSSalesRepEmail: "",
			aWSPartnerSuccessManagerName: "",
			aWSPartnerSuccessManagerEmail: "",
			aWSISVSuccessManagerName: "",
			aWSISVSuccessManagerEmail: "",
			aWSCloseDate: "",
			aWSAccountOwnerName: "",
			aWSAccountOwnerEmail: "",
			additionalComments: "",
			wWPSPDMEmail: "",
			wWPSPDM: "",
		},
	});

	const csvSampleData = [
		[
			"Lead Name",
			"Vertical",
			"Region",
			"Monthly Value",
			"Campaign",
			"Campaign Name",
			"Lead Type",
			"Active",
			"Generated By",
		],
		[
			"John",
			"Agri-Tech Startups",
			"India South",
			"45665",
			"2020",
			"Campaign Name",
			"Product",
			"Yes",
			"Self",
		],
		[
			"John2",
			"Agri-Tech Startups",
			"India West",
			"87664",
			"2020",
			"Campaign Name",
			"Service",
			"No",
			"Principal",
		],
	];

	function handleAdd(e) {
		e.preventDefault();
		let tempSR = [...splitRevenue];
		const user = JSON.parse(localStorage.getItem("user-details"));
		tempSR.push({
			monthlyRevenueOthers:
				tempSR.length === 0 && formData.isProduct === null
					? formData.monthlyProduct
					: 0,
			registerAddedBy: user.id,
			registerPartnerId: user.partnerId,
			registerPrincipalId: tempSR.length === 0 ? formData.principal : 0,
			revenuePrincipal:
				tempSR.length === 0 && formData.isProduct ? formData.monthlyProduct : 0,
			revenueServices:
				tempSR.length === 0 && formData.isProduct === false
					? formData.monthlyProduct
					: 0,
		});
		if (tempSR.length === 1) {
			setTotalRevenue({
				totalPrincipal: tempSR[0].revenuePrincipal,
				totalOthers: tempSR[0].monthlyRevenueOthers,
				totalServices: tempSR[0].revenueServices,
				grandTotal:
					tempSR[0].revenuePrincipal +
					tempSR[0].monthlyRevenueOthers +
					tempSR[0].revenueServices,
			});
		}
		setSplitsRevenue(tempSR);
		// const values = [...fields];
		// values.push({ value: null });
		// setFields(values);
	}

	function handleDelete(e) {
		let tempSR = [...splitRevenue];
		tempSR.splice(e, 1);
		setSplitsRevenue(tempSR);
	}

	const handleShow = () => {
		setShow(!show);
	};

	const showModal = () => {
		setModal(!modal);
	};

	const showCSVModal = () => {
		setCSVModal(!csvModal);
	};

	const getLeadsList = async () => {
		setLoader(true);
		setLeads([]);

		try {
			const res = await fetchJSON(BASE_URL + "/dashboard/list-opportunities");
			if (res) {
				setLeads(res);
				setTotalValue(res)
				const csvData = [];
				res.map((item, i) => {
					csvData.push({
						"SL.No": i + 1,
						"Company Name": item.opportunityData.customerCompanyName,
						Industry: item.opportunityData.industry,
						"Postal Code": item.opportunityData.postalCode,
						Country: item.opportunityData.country,
						"Customer Website": item.opportunityData.customerWebsite,
						partnerProjectTitle: item.opportunityData.partnerProjectTitle,
						"Project Description": item.opportunityData.projectDescription,
						"Partner Primary Need From Aws": item.opportunityData.partnerPrimaryNeedFromAws,
						"Use Case": item.opportunityData.useCase,
						expectedMonthlyAwsRevenue: item.opportunityData.expectedMonthlyAwsRevenue,
						targetCloseDate: item.opportunityData.targetCloseDate,
						deliveryModel: item.opportunityData.deliveryModel,
						stage: item.opportunityData.stage,
						opportunityOwnerName: item.opportunityData.opportunityOwnerName,
						opportunityOwnerEmail: item.opportunityData.opportunityOwnerEmail,
						isNetNewBusinessForCompany: item.opportunityData.isNetNewBusinessForCompany,
						contractVehicle: item.opportunityData.contractVehicle,
						closedLostReason: item.opportunityData.closedLostReason,
						awsFieldEngagement: item.opportunityData.awsFieldEngagement,
						awsAccountId: item.opportunityData.awsAccountId,
						nextStep: item.opportunityData.nextStep,
						campaignName: item.opportunityData.campaignName,
						partnerAcceptanceStatus: item.opportunityData.partnerAcceptanceStatus,
						apnCrmUniqueIdentifier: item.opportunityData.apnCrmUniqueIdentifier,
						partnerCrmUniqueIdentifier: item.opportunityData.partnerCrmUniqueIdentifier,
						opportunityOwnership: item.opportunityData.opportunityOwnership,
						subUseCase: item.opportunityData.subUseCase,
						streetAddress: item.opportunityData.streetAddress,
						isThisAPublicReference: item.opportunityData.isThisAPublicReference,
						publicReferenceUrl: item.opportunityData.publicReferenceUrl,
						publicReferenceTitle: item.opportunityData.publicReferenceTitle,
						State: item.opportunityData.state,
						Email: item.opportunityData.opportunityOwnerEmail,
						Status: item.opportunityData.status,
						Title: item.opportunityData.partnerProjectTitle,
						"Created At": item.updatedAt,
						"Is Active": item.isActive ? "Yes" : "No"
					});
				});
				setCSVData(csvData);
				setLoader(false);
			}
		} catch (error) {}
	};

	const findVerticalName = item => {
		const data = vertical.find(ele => ele.id === item);
		return data ? data.verticalName : "-";
	};

	const findRegionName = item => {
		const region = regions.find(ele => ele.id === item);
		return region ? region.regionName : "-";
	};

	const getVerticalList = async () => {
		setVertical([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		try {
			const res = await fetchJSON(BASE_URL + "/verticals");
			if (res) {
				setVertical(res);
			}
		} catch (error) {}
	};

	const getRegionsList = async () => {
		setRegions([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		try {
			const res = await fetchJSON(BASE_URL + "/dashboard/regions");
			if (res) {
				setRegions(res);
			}
		} catch (error) {}
	};

	const getPrincipals = async () => {
		setPrincipals([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		try {
			const res = await fetchJSON(
				BASE_URL + "/dashboard/myorg/associations/principals/" + partnerId
			);
			if (res) {
				const uniquePrincipals = _.uniqBy(res, "principalId");
				setPrincipals(uniquePrincipals);
				//setPrincipals()
			}
		} catch (error) {}
	};

	const getTechnologyList = async () => {
		setTechnology([]);
		const res = await fetchJSON(BASE_URL + "/technologies");
		if (res) {
			setTechnology(res);
		}
	};

	const getMarketingActivityList = async e => {
		setActivities([]);
		setSelectedPrincipalId(e);

		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		try {
			const res = await fetchJSON(
				BASE_URL +
					"/dashboard/marketing/activites/" +
					partnerId +
					"/" +
					e +
					"/2021"
			);
			if (res !== "Error!") {
				setActivities(res);
				if (location.state && location.date) {
					setMarketingYear(location.date);
					let activity = res.find(item => item.activityName == location.state)
						?.id;
					setcampaignNameFilter(activity ? activity : "untagged");
				}
			}
		} catch (error) {}
	};

	const uploadCSV = async () => {
		if (!selectedPrincipalIdCSV) {
			setCSVError("please select principal");
			return;
		} else if (!uploadCSVFile) {
			setCSVError("please select file");
			return;
		}

		setCsvStatus(Status.pending);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;

		const userId = JSON.parse(user).id;

		const formData = new FormData();

		formData.append("added_by", userId);
		formData.append("file", uploadCSVFile);

		try {
			const res = await fetchJSON(
				BASE_URL +
					"/dashboard/sales/bulk-leads" +
					"/" +
					partnerId +
					"/" +
					selectedPrincipalIdCSV,
				{
					method: "POST",
					headers: {
						// "Content-Type": "application/vnd.ms-excel",
					},
					body: formData,
				}
			);
			if (res) {
				setSuccess(true);

				if (typeof res === "string" || !res?.successInsert.length) {
					setVariant("error");
					setMessage(
						typeof res === "string"
							? res
							: "Some of the emails were skipped, as they were already in use"
					);
				} else if (res.successInsert.length) {
					setVariant("success");
					setMessage("File uploaded successfully");
				}

				setCsvStatus(Status.resolved);

				getLeadsList();
				showCSVModal(!csvModal);
			}
		} catch (error) {
			setCsvStatus(Status.rejected);
		}
		setUploadCSVFile("");
		// setSelectedPrincipalIdCSV("");
	};

	const addLeads = async values => {
		try {
			const res = await fetchJSON(BASE_URL + "/dashboard/create-opportunity", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ opportunity: values }),
			});
			if (res) {
				setSuccess(true);
				setMessage("Added Successfully");
				getLeadsList();
				setShow(!show);
			}
		} catch (error) {}
	};

	const updateLeads = async () => {
		const user = localStorage.getItem("user-details");
		const userId = JSON.parse(user).id;

		const objToSend = {
			added_by: formData.addBy,
			isConvert: formData.convert,
			createdAt: new Date(),
			updatedAt: new Date(),
			marketingId: formData.campaignName,
			id: formData.id,
			salesIsActive: formData.active,
			isLeadFromPrincipal: formData.lead,
			isSelfGenerated: formData.lead,
			isProduct: formData.leadType,
			ageingDate: formData.leadDate,
			ageingDays: formData.days,
			salesLeadName: formData.name,
			industryVertical: {
				id: formData.verticalId,
				verticalName: formData.vertical,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			salesRegion: formData.region,
			salesValue: formData.monthlyValue,
			marketingYear: formData.year,
			campaignYear: formData.year,
			salesComments: formData.comments,
			salesPartnerId: formData.partnerId,
			salesPrincipalId: Number(formData.principal),
			generatedBy: userId,
		};
		try {
			const res = await fetchJSON(BASE_URL + "/dashboard/sales", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(objToSend),
			});
			if (res) {
				setSuccess(true);
				setMessage("Updated Successfully");
				getLeadsList();
				setShow(!show);
			} else {
				setSuccess(true);
				setMessage("Something Went Wrong");
			}
		} catch (error) {}
	};

	const addConvertToRevenue = async () => {
		const user = localStorage.getItem("user-details");
		const userId = JSON.parse(user).id;

		const objToSend = {
			isOngoing: formData.active,
			clientName: formData.name,
			region: formData.nameRegion,
			revenuePrincipal: splitRevenue[0] && splitRevenue[0].revenuePrincipal,
			startDate: formData.Date,
			principalId: Number(formData.principal),
			industryVertical: vertical.find(ele => ele.id == formData.verticalId),
			servicesDeployedManaged: formData.technology
				? [
						...formData.technology.map(item => {
							return {
								id: technology[0].technologyName.indexOf(item),
								text: item,
							};
						}),
				  ]
				: [],
			clientAddress: formData.address,
			clientPincode: formData.pinCode,
			partnerId: formData.partnerId,
			splitRevenue: splitRevenue,
			type: formData.convertType,
			salesRef: formData.salesRef ? formData.salesRef : null,
			type: "converttorevenue",
		};

		try {
			const res = await fetchJSON(BASE_URL + "/dashboard/clients", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(objToSend),
			});
			if (res) {
				getLeadsList();
				setShow(!show);
				setSuccess(true);
				setMessage("Converted Successfully");
				history.push("/clients");
			}
		} catch (error) {}
	};

	const onSubmit = async values => {
		if (isEdit) {
			updateLeads(values);
		} else {
			addLeads(values);
		}
	};

	const getDiff = date => {
		return moment(new Date()).diff(date, "days");
	};

	const applyFilter = () => {
		getLeadsList();
	};

	const calculateRevenue = async () => {
		let totalPrincipal = 0;
		let totalServices = 0;
		let totalOthers = 0;
		let grandTotal = 0;

		await splitRevenue.forEach(ele => {
			totalPrincipal = totalPrincipal + ele.revenuePrincipal;
			console.log(totalPrincipal);
			totalServices = totalServices + ele.revenueServices;
			totalOthers = totalOthers + ele.monthlyRevenueOthers;
			grandTotal = totalPrincipal + totalOthers + totalServices;
		});

		setTotalRevenue({
			totalPrincipal: totalPrincipal,
			totalOthers: totalOthers,
			totalServices: totalServices,
			grandTotal: grandTotal,
		});
	};

	const resetButtonClick = () => {
		setPrincipalFilters("all");
		setResetFilter("true");

		setLeadNameFilter("");
		setStartDateFilter("");
		setEndDateFilter("");
		setVerticalsFilter("");
		setRegionsFilters("");
		setLeadTypeFilter("");
		setStatusFilter("");
		setGeneratedFilter("");
		setConvertFilter("");
		setAgeingDaysFilter("");
		setcampaignNameFilter("");
		setResetFilter("true");
	};

	const onChangeFile = event => {
		setUploadCSVFile(event.target.files[0]);
		setCSVError("");
	};

	// let tempValue= 0;
	// tempValue =  formData.monthlyValue + formData.serviceValue + formData.otherValue
	// setTotalValue(tempValue);

	useEffect(() => {
		setLoader(true);
		getLeadsList();
	}, []);

	useEffect(() => {
		if (resetFilter === "true") {
			getLeadsList();
			setResetFilter("false");
		}
	}, [resetFilter]);

	useEffect(() => {
		if (
			vertical.length &&
			regions.length &&
			location.state === null &&
			location.date === undefined
		) {
			getLeadsList();
		}
	}, [vertical, regions]);
	useEffect(() => {
		if (campaignNameFilter && marketingYear) {
			applyFilter();
		}
	}, [campaignNameFilter]);

	useEffect(() => {
		setLeads(totalValue.filter(item => item.opportunityData.customerCompanyName.includes(leadNameFilter)))
  	}, [leadNameFilter]);

	const snap = useSnapshot(valtioState);

	return (
		<>
			<Card className="card-box expand-card">
				<CardHeader title="Opportunities">
					<CardHeaderToolbar>
						{snap.navRoles?.leads?.add ? (
							<Button
								type="submit"
								className="btn btn-light-primary font-weight-bolder"
								onClick={() => {
									setIsEdit(false);
									setFormData({});
									handleShow();
								}}
								style={{
									marginRight: "10px",
								}}
							>
								Add +
							</Button>
						) : null}
						{/* <Button
							type="submit"
							className="btn btn-light-success font-weight-bolder"
							onClick={() => {
								showCSVModal();
							}}
						>
							Upload CSV
						</Button> */}
						<CSVLink
							className="btn btn-light-warning ml-3 csv-btn font-weight-bolder"
							filename={"opportunities.csv"}
							data={csvData}
						>
							Export to CSV
						</CSVLink>
					</CardHeaderToolbar>
				</CardHeader>
				<div className="card-spacer bg-white">
					<div className="row">
						<div className="col-lg-2">
						<Form>
							<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Control
								type="text"
								placeholder="Name"
								value={leadNameFilter}
								onChange={(e) => setLeadNameFilter(e.target.value)}
							/>
							</Form.Group>
						</Form>
						</div>
					</div>
				</div>
				{/* <div className="card-spacer bg-white">
					<div className="row">
						<div className="col-lg-2">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Control
										as="select"
										value={principalFilters}
										onChange={e => setPrincipalFilters(e.target.value)}
									>
										<option selected={true} value="" className="default-option">
											Select Principal
										</option>
										<option value="all">All</option>
										{principals &&
											principals.map(item => {
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
						<div className="col-lg-2">
							<Form>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Control
										type="text"
										placeholder="Name"
										value={leadNameFilter}
										onChange={e => setLeadNameFilter(e.target.value)}
									/>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-2">
							<Form>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Control
										type={type}
										onFocus={() => setType("date")}
										onBlur={() => setType("text")}
										placeholder="Start Date"
										value={startDateFilter}
										onChange={e => setStartDateFilter(e.target.value)}
									/>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-2">
							<Form>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Control
										type={endDateType}
										placeholder="End Date"
										onFocus={() => setEndDateType("date")}
										onBlur={() => setEndDateType("text")}
										value={endDateFilter}
										onChange={e => setEndDateFilter(e.target.value)}
									/>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-2">
							<Form>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Control
										as="select"
										value={verticalsFilter}
										onChange={e => setVerticalsFilter(e.target.value)}
									>
										<option selected="true" value="" className="default-option">
											Vertical
										</option>
										{vertical &&
											vertical.map(item => {
												return (
													<option value={item.id}>{item.verticalName}</option>
												);
											})}
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-2">
							<Form>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Control
										as="select"
										value={regionsFilter}
										onChange={e => setRegionsFilters(e.target.value)}
									>
										<option selected="true" value="" className="default-option">
											Region
										</option>
										{regions &&
											regions.map(region => {
												return (
													<option value={region.id}>{region.regionName}</option>
												);
											})}
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-2">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Control
										as="select"
										value={leadTypeFilter}
										onChange={e => setLeadTypeFilter(e.target.value)}
									>
										<option selected="true" value="" className="default-option">
											Lead Type
										</option>
										<option value="all">All</option>
										<option value={"true"}>Product</option>
										<option value={"false"}>Service</option>
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-2">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Control
										as="select"
										value={statusFilter}
										onChange={e => setStatusFilter(e.target.value)}
									>
										<option selected="true" value="" className="default-option">
											Status
										</option>
										<option value="all">All</option>
										<option value={"true"}>Active</option>
										<option value={"false"}>Inactive</option>
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-2">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Control
										as="select"
										value={generatedFilter}
										onChange={e => setGeneratedFilter(e.target.value)}
									>
										<option selected="true" value="" className="default-option">
											Generated By
										</option>
										<option value="all">All</option>
										<option value={"true"}>Self</option>
										<option value={"false"}>Principal</option>
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-2">
							<Form.Group controlId="exampleForm.ControlSelect1">
								<Form.Control
									as="select"
									value={convertFilter}
									onChange={e => setConvertFilter(e.target.value)}
								>
									<option selected="true" value="" className="default-option">
										Converted To Client
									</option>
									<option value={"true"}>Yes</option>
									<option value={"false"}>No</option>
								</Form.Control>
							</Form.Group>
						</div>
						<div className="col-lg-2">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Control
										as="select"
										value={ageingDaysFilter}
										onChange={e => setAgeingDaysFilter(e.target.value)}
									>
										<option selected="true" value="" className="default-option">
											Ageing Days
										</option>
										<option value={"0_30"}>0-30</option>
										<option value={"31_60"}>31-60</option>
										<option value={"61_90"}>61-90</option>
										<option value={"90"}> 90 </option>
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
						<div className="col-lg-2">
							<Form>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<Form.Control
										as="select"
										value={campaignNameFilter}
										onChange={e => setcampaignNameFilter(e.target.value)}
									>
										<option selected="true" value="" className="default-option">
											Campaign
										</option>
										{activities &&
											activities.map(item => (
												<option value={item.id}>{item.activityName}</option>
											))}
									</Form.Control>
								</Form.Group>
							</Form>
						</div>
					</div>
				</div>

				<div className="d-flex justify-content-end filter-btn">
					<Button
						type="submit"
						className="btn btn-light-info font-weight-bolder mr-2"
						onClick={() => applyFilter()}
					>
						Apply
					</Button>
					<Button
						type="submit"
						className="btn btn-light-danger font-weight-bolder mr-4"
						onClick={() => resetButtonClick()}
					>
						Reset
					</Button>
				</div> */}

				<CardBody>
					<div className="table-container">
						<Table>
							<div className="table-body">
								<thead>
									<tr>
										<th className="table-text">Company Name</th>
										<th className="table-text">Industry</th>
										<th className="table-text">Country</th>
										<th className="table-text">Email</th>
										<th className="table-text">Status</th>
										<th className="table-text">Title</th>
										<th className="table-text">Created At</th>
										<th className="table-text">Is Active</th>
									</tr>
								</thead>
								<tbody>
									{loader ? (
										<SkeletonComp rows={8} columns={7}></SkeletonComp>
									) : (
										<React.Fragment>
											{leads.length > 0 ? (
												leads.map(item => {
													return (
														<tr>
															<td>
																{item.opportunityData?.customerCompanyName}
															</td>
															<td>{item.opportunityData?.industry}</td>
															<td>{item.opportunityData?.country}</td>
															<td>
																{item.opportunityData?.opportunityOwnerEmail}
															</td>
															<td>{item.opportunityData?.status}</td>
															<td>
																{item.opportunityData?.partnerProjectTitle}
															</td>

															<td>{datePipe(item.updatedAt)}</td>
															<td>{item.isActive ? "Yes" : "No"}</td>
														</tr>
													);
												})
											) : (
												<div className="my-4">
													{!loader && "No records found"}
												</div>
											)}
										</React.Fragment>
									)}
								</tbody>
							</div>
						</Table>
					</div>
					{/* <Pagination className="float-right">{items}</Pagination> */}
				</CardBody>
			</Card>

			{/* MODAL 1 STARTS HERE*/}

			<Modal size="lg" show={show} onHide={handleShow}>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Modal.Header closeButton>
						<Modal.Title>APN Opportunity Details</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormInput
							label="Name of the end customer company name on the opportunity"
							id="customerCompanyName"
							register={register}
							name={"customerCompanyName"}
							error={errors?.customerCompanyName?.message}
						/>
						<FormInputDropDown
							label="Industry of the end customer on the opportunity"
							name="industry"
							register={register}
							data={industry.map(item => {
								return {
									value: item,
									label: item
								}
							})}
							placeholder="Select Industry"
							error={errors.industry?.message}
						/>
						<FormInputDropDown
							label="Country (part of the address) of the end customer on the opportunity"
							id="country"
							name="country"
							register={register}
							data={country.map(item => {
								return {
									value: item,
									label: item
								}
							})}
							placeholder="Select Country"
							error={errors.country?.message}
						/>
						<FormInput
							label="Postal Code (part of the address) of the end customer on the opportunity"
							id="postalCode"
							register={register}
							name={"postalCode"}
							error={errors?.postalCode?.message}
						/>
						<FormInputDropDown
							label="State (part of the address) of the end customer on the opportunity"
							name="state"
							register={register}
							data={stateValue.map(item => {
								return {
									value: item,
									label: item
								}
							})}
							placeholder="Select Use Case"
							error={errors.state?.message}
						/>
						<FormInput
							label="Website of the end customer on the opportunity"
							id="customerWebsite"
							register={register}
							name={"customerWebsite"}
							error={errors?.customerWebsite?.message}
						/>
						<FormInput
							label="Title of the opportunity"
							id="partnerProjectTitle"
							register={register}
							name={"partnerProjectTitle"}
							error={errors?.partnerProjectTitle?.message}
						/>
						<FormInput
							label="Descriptive field articulating the details on the opportunity and the partners role on it"
							id="projectDescription"
							register={register}
							name={"projectDescription"}
							error={errors?.projectDescription?.message}
						/>
						<FormInputDropDown
							label="Partners primary need from AWS on the opportunity"
							name="partnerPrimaryNeedFromAws"
							register={register}
							data={[
								"Architectural validation",
								"Business presentation",
								"Competitive Information",
								"Pricing Assistance",
								"Technical consultation",
								"Total Cost of Ownership Evaluation",
								"For Visibility - No Assistance Needed",
								"Deal support",
								"Other"
							 ].map(item => {
								return {
									value: item,
									label: item
								}
							})}
							placeholder="Select Use Case"
							error={errors.partnerPrimaryNeedFromAws?.message}
						/>
						<FormInputDropDown
							label="End customer use case that the opportunity is solving for (E.g. Migration, Business applications)"
							name="useCase"
							register={register}
							data={[
								"AI/Machine Learning",
								"Big Data",
								"Business Applications",
								"Cloud Management Tools & DevOps",
								"Containers & Serverless",
								"End User Computing",
								"Energy",
								"Financial Services",
								"Healthcare & Life Sciences",
								"Hybrid application platform",
								"Industrial Software",
								"IOT",
								"Media & High performance computing (HPC)",
								"Migration",
								"Networking",
								"Security",
								"Storage"
							 ].map(item => {
								return {
									value: item,
									label: item
								}
							})}
							placeholder="Select Use Case"
							error={errors.useCase?.message}
						/>
						<FormInputDropDown
							label="End customer sub use case that the opportunity is solving for. These are further break ups of the use case"
							name="subUseCase"
							register={register}
							data={[
								{ label: "Accepted", value: "Accepted" },
								{
									label: "Rejected",
									value: "Rejected",
								},
							]}
							placeholder="Select Use Case"
							error={errors.subUseCase?.message}
						/>
						<FormInput
							label="Expected monthly revenue on the opportunity. Please enter amount in USD. This should not be negative amount."
							id="expectedMonthlyAwsRevenue"
							register={register}
							name={"expectedMonthlyAwsRevenue"}
							error={errors?.expectedMonthlyAwsRevenue?.message}
						/>
						<FormInput
							label="Expected launch date on the opportunity."
							type="date"
							id="targetCloseDate"
							register={register}
							name={"targetCloseDate"}
							error={errors?.targetCloseDate?.message}
						/>
						<FormInputDropDown
							label="Indicate the most applicable deployment or consumption model for your solution or service"
							name="deliveryModel"
							register={register}
							data={[
								"SaaS or PaaS",
								"BYOL or AMI",
								"Managed Services",
								"Professional Services",
								"Resell",
								"Other"
							 ].map(item => {
								return {
									value: item,
									label: item
								}
							})}
							placeholder="Select Use Case"
							error={errors.deliveryModel?.message}
						/>
						<FormInputDropDown
							label="Field indicating the opportunity lifecycle on the opportunity (E.g. Launched)"
							name="stage"
							register={register}
							data={[
								"Prospect",
								"Qualified",
								"Technical Validation",
								"Business Validation",
								"Committed",
								"Launched",
								"Closed Lost"
							 ].map(item => {
								return {
									value: item,
									label: item
								}
							})}
							placeholder="Select Use Case"
							error={errors.stage?.message}
						/>
						<FormInput
							label="Name of the owner of the opportunity in the Partner organization.  This needs to be a Partner Central user"
							id="opportunityOwnerName"
							register={register}
							name={"opportunityOwnerName"}
							error={errors?.opportunityOwnerName?.message}
						/>
						<FormInput
							label="Email of the owner of the opportunity in the Partner organization.  This needs to be a Partner Central user"
							id="opportunityOwnerEmail"
							register={register}
							name={"opportunityOwnerEmail"}
							error={errors?.opportunityOwnerEmail?.message}
						/>
						<FormInputDropDown
							label="Yes/No field indicating if the opportunity is a net new business (customer) for the partner"
							name="isNetNewBusinessForCompany"
							register={register}
							data={[
								{ label: "Yes", value: "Yes" },
								{
									label: "No",
									value: "No",
								},
							]}
							placeholder="Select Use Case"
							error={errors.isNetNewBusinessForCompany?.message}
						/>
						<FormInput
							label="Contract Vehicle on the Opportunity. Used for Public Sector opportunities in the United States"
							id="contractVehicle"
							register={register}
							name={"contractVehicle"}
							error={errors?.contractVehicle?.message}
						/>
						<FormInputDropDown
							label="Reason code for opportunity being Closed"
							name="closedLostReason"
							register={register}
							data={[
								"Customer Deficiency",
								"Delay / Cancellation of Project",
								"Legal / Tax / Regulatory",
								"Lost to Competitor – Google",
								"Lost to Competitor – Microsoft",
								"Lost to Competitor – SoftLayer",
								"Lost to Competitor – VMWare",
								"Lost to Competitor – Other",
								"No Opportunity",
								"On Premises Deployment",
								"Partner Gap",
								"Price",
								"Security / Compliance",
								"Technical Limitations",
								"Customer Experience",
								"Other",
								"People/Relationship/Governance",
								"Product/Technology"
							 ].map(item => {
								return {
									value: item,
									label: item
								}
							})}
							placeholder="Select closed Lost Reason"
							error={errors.closedLostReason?.message}
						/>
						<FormInputDropDown
							label="Yes/No field indicating if the AWS Sales rep supported the partner on the opportunity (e.g. joint call or joint meeting with the customer)"
							name="awsFieldEngagement"
							register={register}
							data={[
								{ label: "Yes", value: "Yes" },
								{
									label: "No",
									value: "No",
								},
							]}
							placeholder="Select Use Case"
							error={errors.awsFieldEngagement?.message}
						/>
						<FormInput
							label="12 digit AWS Account number associated with the opportunity"
							id="awsAccountId"
							register={register}
							name={"awsAccountId"}
							error={errors?.awsAccountId?.message}
						/>
						<FormInput
							label="Next steps on the opportunity. This is used to communicate to AWS the next action required"
							id="nextStep"
							register={register}
							name={"nextStep"}
							error={errors?.nextStep?.message}
						/>
						<FormInputDropDown
							label="AWS Campaign name on the opportunity to track campaign performance"
							name="campaignName"
							register={register}
							data={[
								"APN Immersion Days",
								"APN Marketing Central",
								"APN Solution Space",
								"AWS Field Event",
								"AWS Marketplace Campaign",
								"Integrated Partner Campaign",
								"ISV Workload Migration",
								"Migration Acceleration Program (MAP)",
								"Partner Launch Initiative",
								"Partner Led Event",
								"Partner Opportunity Acceleration Funded",
								"Partner Prospecting",
								"The Next Smart",
								"VMware Cloud",
								"Well-Architected",
								"Windows RMP",
								"Workspaces/AppStream Accelerator Program",
								"WWPS Marketing",
								"WWPS NewBE"
							 ].map(item => {
								return {
									value: item,
									label: item
								}
							})}
							placeholder="Select Campaign Name"
							error={errors.campaignName?.message}
						/>

						<FormInputDropDown
							label="Accepted/Rejected option for partners to accept or reject an opportunity shared by AWS. PII information on the opportunity is only available once partner accept the opportunity"
							name="partnerAcceptanceStatus"
							register={register}
							data={[
								{ label: "Accepted", value: "Accepted" },
								{
									label: "Rejected",
									value: "Rejected",
								},
							]}
							placeholder="Select Partner Acceptance Status"
							error={errors.partnerAcceptanceStatus?.message}
						/>

						<FormInput
							label="Unique identifier of the opportunity in AWS APN system"
							id="apnCrmUniqueIdentifier"
							register={register}
							name={"apnCrmUniqueIdentifier"}
							error={errors?.apnCrmUniqueIdentifier?.message}
						/>
						<FormInput
							label="Unique identifier of the opportunity in the Partner's CRM"
							id="partnerCrmUniqueIdentifier"
							register={register}
							name={"partnerCrmUniqueIdentifier"}
							error={errors?.partnerCrmUniqueIdentifier?.message}
						/>

						<FormInputDropDown
							label="Field indicating whether AWS has approved or rejected the partner referral "
							name="status"
							register={register}
							data={[
								"Prospect",
								"Qualified",
								"Technical Validation",
								"Business Validation",
								"Committed",
								"Launched",
								"Closed Lost"
							 ].map(item => {
								return {
									value: item,
									label: item
								}
							})}
							placeholder="Select Use Case"
							error={errors.status?.message}
						/>
						<FormInputDropDown
							label="Field indicating the origination of the opportunity. Partner Referral will indicate it was submitted by Partner, AWS Referral will indicate it was originated by the seller"
							name="opportunityOwnership"
							register={register}
							data={[
								{ label: "AWS Referral", value: "AWS Referral" },
								{
									label: "Partner Referral",
									value: "Partner Referral",
								},
							]}
							placeholder="Select Use Case"
							error={errors.opportunityOwnership?.message}
						/>

						<FormInput
							label="Address of the end customer on the opportunity"
							id="streetAddress"
							register={register}
							name={"streetAddress"}
							error={errors?.streetAddress?.message}
						/>

						<FormInputDropDown
							label="Yes/No field indicating if the opportunity can be referenced in public"
							name="isThisAPublicReference"
							register={register}
							data={[
								{ label: "Yes", value: "Yes" },
								{
									label: "No",
									value: "No",
								},
							]}
							placeholder="Select isThisAPublicReference"
							error={errors.isThisAPublicReference?.message}
						/>

						<FormInput
							label="URL of the customer public reference on the opportunity. This can be added once the opportunity is launched"
							id="publicReferenceUrl"
							register={register}
							name={"publicReferenceUrl"}
							error={errors?.publicReferenceUrl?.message}
						/>
						<FormInput
							label="Title of the customer public reference on the opportunity. This can be added once the opportunity is launched"
							id="publicReferenceTitle"
							register={register}
							name={"publicReferenceTitle"}
							error={errors?.publicReferenceTitle?.message}
						/>
						{/* <FormInput
							label="Phone number of the sales rep on the opportunity from the partner organization"
							id="primaryContactPhone"
							register={register}
							name={"primaryContactPhone"}
							error={errors?.primaryContactPhone?.message}
						/>
						<FormInput
							label="Last Name of the sales rep on the opportunity from the partner organization"
							id="primaryContactLastName"
							register={register}
							name={"primaryContactLastName"}
							error={errors?.primaryContactLastName?.message}
						/>
						<FormInput
							label="First Name of the sales rep on the opportunity from the partner organization"
							id="primaryContactFirstName"
							register={register}
							name={"primaryContactFirstName"}
							error={errors?.primaryContactFirstName?.message}
						/>
						<FormInput
							label="Email of the sales rep on the opportunity from the partner organization"
							id="primaryContactEmail"
							register={register}
							name={"primaryContactEmail"}
							error={errors?.primaryContactEmail?.message}
						/>
						<FormInput
							label="If Partner Primary Need is Other then specify need"
							id="partnerPrimaryNeedFromAwsOther"
							register={register}
							name={"partnerPrimaryNeedFromAwsOther"}
							error={errors?.partnerPrimaryNeedFromAwsOther?.message}
						/>
						<FormInput
							label="Phone number of the AWS Partner Development Manager on the Opportunity "
							id="partnerDeveloperManagerPhone"
							register={register}
							name={"partnerDeveloperManagerPhone"}
							error={errors?.partnerDeveloperManagerPhone?.message}
						/>
						<FormInput
							label="Email of the AWS Partner Development Manager on the Opportunity "
							id="partnerDeveloperManagerEmail"
							register={register}
							name={"partnerDeveloperManagerEmail"}
							error={errors?.partnerDeveloperManagerEmail?.message}
						/>
						<FormInput
							label="Name of the AWS Partner Development Manager on the Opportunity"
							id="partnerDeveloperManager"
							register={register}
							name={"partnerDeveloperManager"}
							error={errors?.partnerDeveloperManager?.message}
						/>
						<FormInput
							label="History of the next steps on the opportunity"
							id="nextStepHistory"
							register={register}
							name={"nextStepHistory"}
							error={errors?.nextStepHistory?.message}
						/>
						<FormInput
							label="Lead source on the opportunity"
							id="leadSource"
							register={register}
							name={"leadSource"}
							error={errors?.leadSource?.message}
						/>
						<FormInput
							label="Date-Time the opportunity was last modified
"
							id="lastModifiedDate"
							register={register}
							name={"lastModifiedDate"}
							error={errors?.lastModifiedDate?.message}
						/>
						<FormInput
							label="Name of the person/entity that modified the opportunity"
							id="lastModifiedBy"
							register={register}
							name={"lastModifiedBy"}
							error={errors?.lastModifiedBy?.message}
						/>
						<FormInputDropDown
							label="Yes/No field indicating if the opportunity is for AWS marketplace"
							name="isThisForMarketplace"
							register={register}
							data={[
								{ label: "Yes", value: "Yes" },
								{
									label: "No",
									value: "No",
								},
							]}
							placeholder="Select Use Case"
							error={errors.isThisForMarketplace?.message}
						/>
						<FormInputDropDown
							label="Was this opportunity the result of a marketing development fund (MDF) funded activity?"
							name="isMarketingDevelopmentFunded"
							register={register}
							data={[
								{ label: "Yes", value: "Yes" },
								{
									label: "No",
									value: "No",
								},
							]}
							placeholder="Select Use Case"
							error={errors.isMarketingDevelopmentFunded?.message}
						/>

						<FormInput
							label="Value indicating the Industry of the end customer on the opportunity (if the selection on the Industry field is other)"
							id="industryOther"
							register={register}
							name={"industryOther"}
							error={errors?.industryOther?.message}
						/>
						<FormInput
							label="Title of the end customer on the opportunity. (E.g. Mr., Mrs., Miss)"
							id="customerTitle"
							register={register}
							name={"customerTitle"}
							error={errors?.customerTitle?.message}
						/>
						<FormInput
							label="Phone of the end customer on the opportunity "
							id="customerPhone"
							register={register}
							name={"customerPhone"}
							error={errors?.customerPhone?.message}
						/>
						<FormInput
							label="Last Name of the end customer on the opportunity
"
							id="customerLastName"
							register={register}
							name={"customerLastName"}
							error={errors?.customerLastName?.message}
						/>
						<FormInput
							label="First Name of the end customer on the opportunity
"
							id="customerFirstName"
							register={register}
							name={"customerFirstName"}
							error={errors?.customerFirstName?.message}
						/>
						<FormInput
							label="Email of the end customer on the opportunity"
							id="customerEmail"
							register={register}
							name={"customerEmail"}
							error={errors?.customerEmail?.message}
						/>
						<FormInput
							label="Date-Time the opportunity was created"
							id="createdDate"
							register={register}
							name={"createdDate"}
							error={errors?.createdDate?.message}
						/>
						<FormInput
							label="Name of the person/entity that created the opportunity"
							id="createdBy"
							register={register}
							name={"createdBy"}
							error={errors?.createdBy?.message}
						/>
						<FormInputDropDown
							label="Identify other cloud providers who are potential competitors on the opportunity"
							name="competitiveTracking"
							register={register}
							data={[
								{ label: "Yes", value: "Yes" },
								{
									label: "No",
									value: "No",
								},
							]}
							placeholder="Select Use Case"
							error={errors.competitiveTracking?.message}
						/>

						<FormInput
							label={`If Competitive tracking is "Other", specify which competitor`}
							id="competitiveTrackingOther"
							register={register}
							name={"competitiveTrackingOther"}
							error={errors?.competitiveTrackingOther?.message}
						/>
						<FormInput
							label="City (part of the address) of the end customer on the opportunity"
							id="city"
							register={register}
							name={"city"}
							error={errors?.city?.message}
						/>
						<FormInput
							label="Field indicating the opportunity lifecycle on the opportunity, as tracked by AWS (E.g. Launched) "
							id="aWSSalesRepName"
							register={register}
							name={"aWSSalesRepName"}
							error={errors?.aWSSalesRepName?.message}
						/>
						<FormInput
							label="Email of the AWS Sales Rep on the Opportunity. Primary point of contact from AWS on the opportunity"
							id="aWSSalesRepEmail"
							register={register}
							name={"aWSSalesRepEmail"}
							error={errors?.aWSSalesRepEmail?.message}
						/>
						<FormInput
							label="Name of the Partner Success Manager on the Opportunity. Primary point of contact from AWS on the opportunity for Consulting partners"
							id="aWSPartnerSuccessManagerName"
							register={register}
							name={"aWSPartnerSuccessManagerName"}
							error={errors?.aWSPartnerSuccessManagerName?.message}
						/>
						<FormInput
							label="Email of the Partner Success Manager on the Opportunity. Primary point of contact from AWS on the opportunity for Consulting partners"
							id="aWSPartnerSuccessManagerEmail"
							register={register}
							name={"aWSPartnerSuccessManagerEmail"}
							error={errors?.aWSPartnerSuccessManagerEmail?.message}
						/>
						<FormInput
							label="Name of the ISV Success Manager on the Opportunity. Primary point of contact from AWS on the opportunity for Technology partners"
							id="aWSISVSuccessManagerName"
							register={register}
							name={"aWSISVSuccessManagerName"}
							error={errors?.aWSISVSuccessManagerName?.message}
						/>
						<FormInput
							label="Email of the ISV Success Manager on the Opportunity. Primary point of contact from AWS on the opportunity for Technology partners"
							id="aWSISVSuccessManagerEmail"
							register={register}
							name={"aWSISVSuccessManagerEmail"}
							error={errors?.aWSISVSuccessManagerEmail?.message}
						/>
						<FormInput
							label="Expected launch date on the opportunity, as tracked by AWS"
							id="aWSCloseDate"
							register={register}
							name={"aWSCloseDate"}
							error={errors?.aWSCloseDate?.message}
						/>
						<FormInput
							label="Name of the AWS account owner of the end customer on the Opportunity."
							id="aWSAccountOwnerName"
							register={register}
							name={"aWSAccountOwnerName"}
							error={errors?.aWSAccountOwnerName?.message}
						/>
						<FormInput
							label="Email of the AWS account owner of the end customer on the Opportunity."
							id="aWSAccountOwnerEmail"
							register={register}
							name={"aWSAccountOwnerEmail"}
							error={errors?.aWSAccountOwnerEmail?.message}
						/>
						<FormInput
							label="Additional comments on the opportunity "
							id="additionalComments"
							register={register}
							name={"additionalComments"}
							error={errors?.additionalComments?.message}
						/>
						<FormInput
							label="Email of the relevant Partner Development manager on the opportunity"
							id="wWPSPDMEmail"
							register={register}
							name={"wWPSPDMEmail"}
							error={errors?.wWPSPDMEmail?.message}
						/>
						<FormInput
							label="Name of the relevant Partner Development manager on the opportunity"
							id="wWPSPDM"
							register={register}
							name={"wWPSPDM"}
							error={errors?.wWPSPDM?.message}
						/> */}
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="danger"
							onClick={handleShow}
							className="btn btn-light-danger font-weight-bolder mr-5"
						>
							Close
						</Button>

						{snap.navRoles?.leads?.edit && isEdit ? (
							<Button
								variant="primary"
								type="submit"
								disabled={(isEdit && !formData.active) || formData.isConvert}
								className="btn btn-light-primary font-weight-bolder"
							>
								Update
							</Button>
						) : snap.navRoles?.leads?.add ? (
							<Button
								variant="primary"
								type="submit"
								disabled={(isEdit && !formData.active) || formData.isConvert}
								className="btn btn-light-primary font-weight-bolder"
							>
								Add
							</Button>
						) : null}
					</Modal.Footer>
				</Form>
			</Modal>

			{/* MODAL 1 ENDS HERE*/}

			{/* {MODAL 2 STARTS HERE} */}

			<Modal size="lg" show={modal} onHide={showModal}>
				<Modal.Header closeButton>
					<Modal.Title>Convert To Clients</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Client Name *</Form.Label>
							<Form.Control
								type="name"
								placeholder=""
								name="name"
								required
								value={formData.name}
								onChange={e =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Principal *</Form.Label>
							<Form.Control
								as="select"
								name="principal"
								required
								value={formData.principal}
								onChange={e =>
									setFormData({
										...formData,
										principal: e.target.value,
									})
								}
								value={formData.principal}
							>
								<option selected="true" disabled="disabled">
									Select Principal
								</option>
								{principals.map(e => (
									<option value={e.principalId}>{e.principalName}</option>
								))}
							</Form.Control>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Select Vertical *</Form.Label>
							<Form.Control
								as="select"
								name="vertical"
								required
								value={formData.verticalId}
								onChange={e =>
									setFormData({
										...formData,
										vertical: e.target.textContent,
										verticalId: e.target.value,
									})
								}
							>
								<option selected="true" disabled="disabled">
									Select a Vertical
								</option>
								{vertical &&
									vertical.map(item => {
										return <option value={item.id}>{item.verticalName}</option>;
									})}
							</Form.Control>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Country / Region(s) *</Form.Label>
							<Form.Control
								as="select"
								name="nameRegion"
								required
								value={formData.nameRegion}
								onChange={e =>
									setFormData({
										...formData,
										nameRegion: e.target.value,
									})
								}
							>
								<option selected="true" disabled="disabled">
									Select Region
								</option>
								{regions &&
									regions.map(region => {
										return (
											<option value={region.id}>{region.regionName}</option>
										);
									})}
							</Form.Control>
						</Form.Group>

						<Form.Group controlId="validationCustom02">
							<Form.Label>Start Date *</Form.Label>

							<Form.Control
								required
								type="date"
								name="Date"
								required
								max={moment(new Date()).format("YYYY-MM-DD")}
								value={formData.Date}
								onChange={e =>
									setFormData({
										...formData,
										Date: e.target.value,
									})
								}
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlTextarea1">
							<Form.Label>Address</Form.Label>
							<Form.Control
								as="textarea"
								rows="3"
								name="address"
								onChange={e =>
									setFormData({
										...formData,
										address: e.target.value,
									})
								}
								value={formData.address}
							/>
						</Form.Group>

						<Form.Group controlId="validationCustom02">
							<Form.Label>PIN/Zip Code*</Form.Label>

							<Form.Control
								required
								type="number"
								name="pinCode"
								onChange={e =>
									setFormData({
										...formData,
										pinCode: e.target.value,
									})
								}
								value={formData.pinCode}
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Service Deployed *</Form.Label>
							<Autocomplete
								multiple
								name="technology"
								required
								options={technology[0]?.technologyName}
								getOptionLabel={option => option}
								onChange={(e, value) =>
									setFormData({
										...formData,
										technology: value,
									})
								}
								renderInput={params => (
									<TextField
										{...params}
										variant="outlined"
										placeholder="Sectoral Focus"
									/>
								)}
							/>
						</Form.Group>
						<h6>Revenue Split *</h6>
						{fields.length < 3 ? (
							<button
								className="btn btn-light-info mt-3 mb-3"
								onClick={e => handleAdd(e)}
							>
								Add Principal
							</button>
						) : (
							""
						)}
						{splitRevenue &&
							splitRevenue.map((item, index) => {
								return (
									<div className="d-flex justify-content-between ml-1">
										<div className="row">
											<div className="col-4">
												<Form.Group controlId="exampleForm.ControlInput1">
													<Form.Label></Form.Label>
													<Form.Control
														as="select"
														className="mt-2"
														name="principal"
														onChange={e => {
															let tempSR = [...splitRevenue];
															tempSR[index].registerPrincipalId = parseInt(
																e.target.value,
																10
															);
															setSplitsRevenue(tempSR);
														}}
														value={splitRevenue[index].registerPrincipalId}
													>
														<option selected="true" disabled="disabled">
															Select Principal
														</option>
														{principals.map(e => (
															<option value={e.principalId}>
																{e.principalName}
															</option>
														))}
													</Form.Control>
												</Form.Group>
											</div>
											<div className="col-2">
												<Form.Group controlId="validationCustom02">
													<Form.Label>Product</Form.Label>

													<Form.Control
														required
														type="number"
														name="monthlyValue"
														value={splitRevenue[index].revenuePrincipal}
														onChange={e => {
															let tempSR = [...splitRevenue];
															tempSR[index].revenuePrincipal = e.target.value
																? parseInt(e.target.value, 10)
																: 0;
															setSplitsRevenue(tempSR);
															calculateRevenue();
														}}
													/>
												</Form.Group>
											</div>
											<div className="col-2">
												<Form.Group controlId="validationCustom02">
													<Form.Label>Services</Form.Label>

													<Form.Control
														required
														type="number"
														placeholder="0"
														name="serviceValue"
														value={splitRevenue[index].revenueServices}
														onChange={e => {
															let tempSR = [...splitRevenue];
															tempSR[index].revenueServices = e.target.value
																? parseInt(e.target.value, 10)
																: 0;
															setSplitsRevenue(tempSR);
															calculateRevenue();
														}}
													/>
												</Form.Group>
											</div>
											<div className="col-2">
												<Form.Group controlId="validationCustom02">
													<Form.Label>Others</Form.Label>

													<Form.Control
														required
														type="number"
														placeholder="0"
														name="otherValue"
														value={splitRevenue[index].monthlyRevenueOthers}
														onChange={e => {
															let tempSR = [...splitRevenue];
															tempSR[index].monthlyRevenueOthers = e.target
																.value
																? parseInt(e.target.value, 10)
																: 0;
															setSplitsRevenue(tempSR);
															calculateRevenue();
														}}
													/>
												</Form.Group>
											</div>
											<div className="col-2">
												<div className="mt-10">
													<i
														className="fa fa-trash"
														style={{
															cursor: "pointer",
															color: "#F64E60",
														}}
														onClick={() => handleDelete(index)}
													></i>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						{splitRevenue.length > 0 && (
							<div className="row">
								<div className="col-4">
									<label className="mt-1 ml-2 text-dark"></label>
								</div>
								<div className="col-2">
									<label className="mt-1 ml-2 text-dark">
										{totalRevenue.totalPrincipal}
									</label>
								</div>
								<div className="col-2">
									<label className="mt-1 ml-2 text-dark">
										{totalRevenue.totalServices}
									</label>
								</div>
								<div className="col-2">
									<label className="mt-1 ml-2 text-dark">
										{totalRevenue.totalOthers}
									</label>
								</div>
								<div className="col-2">
									<label className="mt-1 ml-2 text-dark"></label>
								</div>
							</div>
						)}

						<div className="text-right">
							<h5>
								Grand Total:
								{totalRevenue.grandTotal}
							</h5>
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
						variant="primary"
						onClick={addConvertToRevenue}
						disabled={splitRevenue.length === 0}
						className="btn btn-light-primary font-weight-bolder"
					>
						Save
					</Button>
				</Modal.Footer>
			</Modal>

			{/* {MODAL 2 ENDS HERE} */}

			{/* {MODAL 3 STARTS HERE} */}

			<Modal size="lg" show={csvModal} onHide={showCSVModal}>
				<Modal.Header closeButton>
					<Modal.Title>Lead Details</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Principal *</Form.Label>
							<Form.Control
								as="select"
								name="principal"
								value={selectedPrincipalIdCSV}
								onChange={e => {
									setSelectedPrincipalIdCSV(e.target.value);

									setFormData({
										...formData,
										principal: e.target.value,
									});
									setCSVError("");
								}}
							>
								<option selected="true" disabled="disabled">
									Select Principal
								</option>
								{principals.map(e => (
									<option value={e.principalId}>{e.principalName}</option>
								))}
							</Form.Control>
							{csvError.includes("principal") ? (
								<Form.Label className="text-danger text-sm-left mt-2">
									{csvError}
								</Form.Label>
							) : null}
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Upload File *</Form.Label>
							<Form.Control
								type="file"
								name="fileUpload"
								onChange={e => onChangeFile(e)}
								value={formData.fileUpload}
							></Form.Control>
							{csvError.includes("file") ? (
								<Form.Label className="text-danger text-sm-left mt-2">
									{csvError}
								</Form.Label>
							) : null}
						</Form.Group>
					</Form>
					<p>
						Note: Marked * are the required fields. To import Leads into the
						system, please read the following instructions:
					</p>
					<ul className="text-muted">
						<li>Download the Sample File for import</li>
						<li>
							You may open the file using Microsoft Excel or any other
							spreadhseet program
						</li>
						<li>
							In the sample file, ensure the entries you wish to import are
							entered from the second(2nd) row onwards
						</li>
						<li>
							You will find two sample rows to get you started. You may delete
							these as you update your entries
						</li>
						<li>
							Please note that first row and its cell values are mandatory, and
							cannot be empty.
						</li>
						<li>Make sure the cells don't have any additional commas (,)</li>
						<li>
							Once the data is entered, save the file in the same CSV format.
						</li>
						<li>
							Duplicate records are those where an existing record exists with
							the Lead Name, Lead Type, Lead Date, Region & Campaign Name
						</li>
					</ul>
				</Modal.Body>
				<Modal.Footer>
					<div className="mr-auto">
						<CSVLink
							className="btn btn-light-warning ml-3 csv-btn font-weight-bolder"
							filename={"bulk_leads-sample.csv"}
							data={csvSampleData}
						>
							Sample CSV
						</CSVLink>
					</div>
					<Button
						variant="danger"
						onClick={showCSVModal}
						className="btn btn-light-danger font-weight-bolder mr-5"
					>
						Close
					</Button>

					<Button
						variant="primary"
						onClick={uploadCSV}
						className="btn btn-light-primary font-weight-bolder"
					>
						{csvStatus === Status.pending ? (
							<Spinner animation="border" />
						) : (
							"Upload"
						)}{" "}
					</Button>
				</Modal.Footer>
			</Modal>
			{/* {MODAL 3 ENDS HERE} */}
			{isSuccess && (
				<SnackbarComp
					open={isSuccess}
					message={message}
					variant={variant}
					onClose={e => setSuccess(false)}
				></SnackbarComp>
			)}
		</>
	);
}
