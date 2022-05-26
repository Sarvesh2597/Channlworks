import React, { useState, useEffect } from "react";
import { Table, Form, Modal, Spinner } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import Button from "@material-ui/core/Button";
import "react-datepicker/dist/react-datepicker.css";
import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";
import _, { indexOf } from "lodash";
import moment from "moment";
import { CSVLink } from "react-csv";
import { useHistory } from "react-router-dom";
import SnackbarComp from "../../Components/SnackbarComp";
import { datePipe } from "../../../_metronic/_helpers/date-pipe";
import SkeletonComp from "../../Components/SkeletonComp";
import { Link, useLocation } from "react-router-dom";
import { Status } from "../../../utils/helpers";
import { useSnapshot } from "valtio";
import { valtioState } from "../../App";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AddUpdateLeads } from "./AddUpdate";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

const schema = yup.object().shape({
  status: yup.string().required(),
  currentLeadStage: yup.string().required(),
  partnerCrmLeadId: yup
    .string()
    .max(18, "only 18 characters allowed")
    .required(),
  apnCrmUniqueIdentifier: yup
    .string()
    .max(18, "only 18 characters allowed")
    .required(),
  CampaignName: yup
    .string()
    .max(255, "only 255 characters allowed")
    .required(),
  firstName: yup
    .string()
    .max(40, "only 40 characters allowed")
    .required(),
  lastName: yup
    .string()
    .max(80, "only 80 characters allowed")
    .required(),
  email: yup
    .string()
    .email("invalid email")
    .required(),
  website: yup.string().max(255, "only 255 characters allowed"),
  useCaseWorkload: yup.string(),
  title: yup.string().max(128, "only 128 characters allowed"),
  streetAddress: yup.string().max(255, "only 255 characters allowed"),
  state: yup.string(),
  segmentCompanySize: yup.string(),
  projectDescription: yup.string().max(3200, "only 3200 characters allowed"),
  postalCode: yup.number().nullable(),
  phone: yup.number().nullable(),
  LevelofAWSUsage: yup.string(),
  leadStatusReason: yup.string(),
  leadSource: yup.string(),
  leadOwnerName: yup.string(),
  leadOwnerEmail: yup.string().email("invalid email"),
  leadAge: yup
    .number()
    .max(10, "only 10 characters allowed")
    .nullable(),
  lastModifiedDate: yup.string(),
  lastModifiedBy: yup.string(),
  industry: yup.string().max(40, "only 40 characters allowed"),
  createdDate: yup.string(),
  createdBy: yup.string().max(40, "only 40 characters allowed"),
  country: yup.string(),
  company: yup.string().max(255, "only 255 characters allowed"),
  city: yup.string().max(255, "only 255 characters allowed"),
  campaignMemberStatus: yup.string().max(40, "only 40 characters allowed"),
});

export function APNLeads(client) {
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
    watch,
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      status: "",
      currentLeadStage: "",
      partnerCrmLeadId: "",
      apnCrmUniqueIdentifier: "",
      campaignName: "",
      firstName: "",
      lastName: "",
      email: "",
      website: "",
      useCaseWorkload: "",
      title: "",
      streetAddress: "",
      state: "",
      segmentCompanySize: "",
      projectDescription: "",
      postalCode: null,
      phone: null,
      levelofAWSUsage: "",
      leadStatusReason: "",
      leadSource: "",
      leadOwnerName: "",
      leadOwnerEmail: "",
      leadAge: null,
      lastModifiedDate: "",
      lastModifiedBy: "",
      industry: "",
      createdDate: "",
      createdBy: "",
      country: "",
      company: "",
      city: "",
      campaignMemberStatus: "",
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
    const user = localStorage.getItem("user-details");
    const partnerId = JSON.parse(user).partnerId;
    let params =
      principalFilters !== "" ? "?principal=" + principalFilters : "";
    params +=
      verticalsFilter !== "" ? "&industryVertical=" + verticalsFilter : "";
    params += regionsFilter !== "" ? "&salesRegion=" + regionsFilter : "";
    params += ageingDaysFilter !== "" ? "&ageingDays=" + ageingDaysFilter : "";
    params += convertFilter !== "" ? "&isConvert=" + convertFilter : "";
    params += leadTypeFilter !== "" ? "&isProduct=" + leadTypeFilter : "";
    params +=
      generatedFilter !== "" ? "&isSelfGenerated=" + generatedFilter : "";
    params +=
      campaignNameFilter !== "" ? "&marketingId=" + campaignNameFilter : "";
    params += statusFilter !== "" ? "&salesIsActive=" + statusFilter : "";
    params += startDateFilter ? "&startDate=" + startDateFilter : "";
    params += endDateFilter ? "&endDate=" + endDateFilter : "";
    params += leadNameFilter !== "" ? "&salesLeadName=" + leadNameFilter : "";
    params += marketingYear ? "&marketingYear=" + marketingYear : "";

    try {
      const res = await fetchJSON(BASE_URL + "/dashboard/list-leads");
      if (res) {
        setLeads(res);
		setTotalValue(res);
        const csvData = [];
        res.map((item, i) => {
          csvData.push({
            "SL.No": i + 1,
            Name: item.firstName + " " + item.lastName,
            "Customer Email": item.email,
            "Campaign Name": item.campaignName,
            "Lead Status": item.status,
            "Lead Stage": item.currentLeadStage,
            "Lead Age": item.leadAge,
            "Partner CRM lead Id": item.partnerCrmLeadId,
            "APN CRM Unique Identifier": item.apnCrmUniqueIdentifier,
            IsActive: item.isActive ? "Yes" : "No",
            "Lead Date": datePipe(item.createdAt),
          });
        });
        setCSVData(csvData);
        setLoader(false);
      }
    } catch (error) {}
  };

  const findVerticalName = (item) => {
    const data = vertical.find((ele) => ele.id === item);
    return data ? data.verticalName : "-";
  };

  const findRegionName = (item) => {
    const region = regions.find((ele) => ele.id === item);
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

  const getMarketingActivityList = async (e) => {
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
          let activity = res.find((item) => item.activityName == location.state)
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

  const addLeads = async (values) => {
    const user = localStorage.getItem("user-details");
    try {
      const res = await fetchJSON(BASE_URL + "/dashboard/create-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
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

  // const getClientsList = async (e) => {
  //   setClients([]);
  //   const user = localStorage.getItem("user-details");
  //   const partnerId = JSON.parse(user).partnerId;
  //   console.log("hi");
  //   const res = await fetchJSON(
  //     BASE_URL +
  //       "/dashboard/clients/partner/" +
  //       partnerId +
  //       "/all?principal=all"
  //   );
  //   if (res) {
  //     console.log(res);
  //     setClients(res);
  //   }
  // };

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
      industryVertical: vertical.find((ele) => ele.id == formData.verticalId),
      servicesDeployedManaged: formData.technology
        ? [
            ...formData.technology.map((item) => {
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

  const handleConvertClick = (item) => {
    setIsEdit(true);
    setSplitsRevenue([]);
    setFormData({
      active: item.salesIsActive,
      name: item.salesLeadName,
      nameRegion: item.salesRegion,
      monthlyProduct: item.salesValue,
      industryVertical: {
        vertical: item.verticalName,
      },
      verticalId: item.industryVertical,
      principal: item.salesPrincipalId,
      partnerId: item.salesPartnerId,
      salesRef: item.id,
      technology: item.technology,
      Date: item.startDate,
      convertType: item.isConvert,
      monthlyValue: item.monthlyRevenueOthers,
      monthlyService: item.revenueServices,
      isProduct: item.isProduct,
    });
    showModal(true);
  };

  const handleRowClick = (item) => {
    setIsEdit(true);
    getMarketingActivityList(item.salesPrincipalId);
    setFormData({
      id: item.id,
      active: item.salesIsActive,
      lead: item.isLeadFromPrincipal,
      campaignName: item.marketingId,
      addBy: item.added_by,
      convert: item.isConvert,
      lead: item.isSelfGenerated,
      leadType: item.isProduct,
      leadDate: item.ageingDate,
      days: item.ageingDays,
      name: item.salesLeadName,
      industryVertical: {
        vertical: item.verticalName,
      },
      verticalId: item.industryVertical,
      region: item.salesRegion,
      monthlyValue: item.salesValue,
      year: item.marketingYear,
      comments: item.salesComments,
      principal: item.salesPrincipalId,
      salesRef: item.id,
      partnerId: item.salesPartnerId,
      technology: item.servicesDeployedManaged
        ? [
            ...item.servicesDeployedManaged.map((ele) => {
              return ele.text;
            }),
          ]
        : [],
    });
    setShow(true);
  };

  const onSubmit = async (values) => {
    if (isEdit) {
      updateLeads();
    } else {
      addLeads(values);
    }
  };

  const getDiff = (date) => {
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

    await splitRevenue.forEach((ele) => {
      totalPrincipal = totalPrincipal + ele.revenuePrincipal;
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

  const onChangeFile = (event) => {
    setUploadCSVFile(event.target.files[0]);
    setCSVError("");
  };

  // let tempValue= 0;
  // tempValue =  formData.monthlyValue + formData.serviceValue + formData.otherValue
  // setTotalValue(tempValue);

  useEffect(() => {
    setLoader(true);
    // getRegionsList();
    // getVerticalList();
    // getPrincipals();
    // getTechnologyList();
    // // getClientsList();
    // getMarketingActivityList("all");
    getLeadsList();

  }, []);

  useEffect(() => {
    if (resetFilter === "true") {
      getLeadsList();
      setResetFilter("false");
    }
  }, [resetFilter]);

  useEffect(() => {
		totalValue.filter(item => item.campaignName.includes(leadNameFilter))
		
  }, [leadNameFilter]);

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

  const snap = useSnapshot(valtioState);

  return (
    <>
      <Card className="card-box expand-card">
        <CardHeader title="Leads">
          <CardHeaderToolbar>
            {snap.navRoles?.leads?.add ? (
              <AddUpdateLeads
                show={show}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                handleShow={handleShow}
                onSubmit={onSubmit}
              />
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
              filename={"leads.csv"}
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
          {/* <div className="row">
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
					</div> */}
        </div>

        {/* <div className="d-flex justify-content-end filter-btn">
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
                    <th className="table-text">Name </th>
                    <th className="table-text">Email</th>
                    <th className="table-text">Created At</th>
                    <th className="table-text">Lead Status</th>
                    <th className="table-text">Lead Stage</th>
                    <th className="table-text">Campaign Name</th>
                    <th className="table-text">Is Active</th>
                    <th className="table-text">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loader ? (
                    <SkeletonComp rows={8} columns={7}></SkeletonComp>
                  ) : (
                    <React.Fragment>
                      {leads.length > 0 ? (
                        leads.map((item) => {
                          return (
                            <tr>
                              <td
                                style={{
                                  cursor: "pointer",
                                }}
                                // onClick={e => handleRowClick(item)}
                              >
                                {item.firstName + " " + item.lastName}
                              </td>
                              <td>{item.email}</td>
                              <td>{datePipe(item.createdAt)}</td>
                              <td>{item.status}</td>
                              <td>{item.currentLeadStage}</td>
                              <td>{item.campaignName}</td>

                              <td>{item.isActive ? "Yes" : "No"}</td>
                              <td>
                                <div className="d-flex">
                                  <a
                                    title="Edit"
                                    className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                  >
                                    <span className="svg-icon svg-icon-md svg-icon-primary">
                                      <SVG
                                        title="Edit"
                                        src={toAbsoluteUrl(
                                          "/media/svg/icons/Communication/Write.svg"
                                        )}
                                        // onClick={() => handleRowClick(item)}
                                      />
                                    </span>
                                  </a>
                                  <a
                                    title="Delete"
                                    className="btn btn-icon btn-light btn-hover-danger btn-sm"
                                  >
                                    <span className="svg-icon svg-icon-md svg-icon-danger">
                                      <SVG
                                        title="Delete"
                                        src={toAbsoluteUrl(
                                          "/media/svg/icons/General/Trash.svg"
                                        )}
                                        // onClick={() => deleteAssociation(item)}
                                        // onClick={e => DeleteModal(e, item)}
                                      />
                                    </span>
                                  </a>
                                </div>
                              </td>
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

      {/* {MODAL 2 ENDS HERE} */}

      {/* {MODAL 3 STARTS HERE} */}

      {/* {MODAL 3 ENDS HERE} */}
      {isSuccess && (
        <SnackbarComp
          open={isSuccess}
          message={message}
          variant={variant}
          onClose={(e) => setSuccess(false)}
        ></SnackbarComp>
      )}
    </>
  );
}
