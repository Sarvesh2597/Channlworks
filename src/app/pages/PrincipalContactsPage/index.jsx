import React, { useEffect, useState, useMemo } from "react";
import { Table, Form, Modal, Alert } from "react-bootstrap";

import {
	Card,
	CardBody,
	CardHeader,
	CardHeaderToolbar,
} from "./../../../_metronic/_partials/controls";

import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import Button from "@material-ui/core/Button";

import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";
import _ from "lodash";
import SnackbarComp from "../../Components/SnackbarComp";
import SkeletonComp from "../../Components/SkeletonComp";
import DataTable from "../../Components/DataTable";
import { useSnapshot } from "valtio";
import { valtioState } from "../../App";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormError, FormInput } from "../../Components/Basic/Form";
import { resetWarningCache } from "prop-types";

const vendorContactSchema = Yup.object().shape({
	contactPrincipalId: Yup.number().required(),
	contactPartnerId: Yup.number(),
	contactDetails: Yup.object({
		clientComments: Yup.string(),
		clientEmailId: Yup.string()
			.email("wrong email type")
			.required("email required"),
		clientName: Yup.string()
			.required("Name Required")
			.matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
		clientTitle: Yup.string()
			.required("Designation Required"),
		clientIsActive: Yup.boolean()
			.required("required")
			.oneOf([true, false], "required"),
		clientContactDetails: Yup.object({
			primary: Yup.string()
				.matches(RegExp(/^\d+$/), "Invalid Contact number")
				.min(8, "Please enter correct 8 digit contact number")
				.max(12, "Contact number cannot be more than 12 digits"),
		}),
	}),
});

function PrincipalContactsPage() {
	const [show, setShow] = useState(false);

	const [principalcontacts, setPrincipalContacts] = useState([]);

	const [tableData, setTableData] = useState([]);

	const [formData, setFormData] = useState({
		id: undefined,
		contactPrincipalId: undefined,
		contactPartnerId: undefined,
		contactDetails: {
			clientComments: "",
			clientEmailId: "",
			clientName: "",
			clientTitle: "",
			clientIsActive: true,
			clientContactDetails: { primary: "" },
		},
	});

	const [principals, setPrincipals] = useState([]);

	const [isEdit, setIsEdit] = useState(false);

	const [loader, setLoader] = useState(false);

	const [deleteModal, setDeleteModal] = useState(false);

	const [modalBody, setModalBody] = useState({});

	const [principalFilters, setPrincipalFilters] = useState("all");
	const [searchFilter, setSearchFilter] = useState("");

	const [isSuccess, setSuccess] = useState(false);
	const [message, setMessage] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
		reset,
	} = useForm({
		mode: "all",
		resolver: yupResolver(vendorContactSchema),
		defaultValues: formData,
	});

	const handleShow = () => {
		setShow(!show);
		if (show) {
			reset();
		}
	};

	const DeleteModal = (e, item = {}) => {
		setModalBody(item);
		setDeleteModal(!deleteModal);
	};

	const getPrincipals = async () => {
		setPrincipals([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const res = await fetchJSON(
			BASE_URL + "/dashboard/myorg/associations/principals/" + partnerId
		);
		if (res) {
			console.log(res);
			const uniquePrincipals = _.uniqBy(res, "principalId");
			setPrincipals(uniquePrincipals);
		}
	};

	const getPrincipalContacts = async () => {
		setLoader(true);
		setPrincipalContacts([]);
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		let params = principalFilters ? "?principal=" + principalFilters : "";
		const res = await fetchJSON(
			BASE_URL + "/dashboard/contacts/partner/" + partnerId + params
		);
		if (res) {
			console.log(res);
			setPrincipalContacts(res);
			setTableData(res);
			setLoader(false);
		}
	};

	const addPrincipalContact = async values => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;

		const objToSend = {
			...values,
			contactPartnerId: partnerId,
		};

		const res = await fetchJSON(BASE_URL + "/dashboard/contacts", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(objToSend),
		});
		if (res) {
			getPrincipalContacts();
			setShow(!show);
			setSuccess(true);
			setMessage("Added Successfully");
			reset();
		}
	};

	const updatePrincipalContact = async values => {
		const res = await fetchJSON(BASE_URL + "/dashboard/contacts", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
		});
		if (res) {
			getPrincipalContacts();
			setShow(!show);
			setSuccess(true);
			setMessage("Updated Successfully");
			reset();
		}
	};

	const handleRowClick = item => {
		setIsEdit(true);
		setFormData({
			id: item.id,
			contactPrincipalId: item.contactPrincipalId,
			contactPartnerId: item.contactPartnerId,
			contactDetails: item.contactDetails,
		});
		setValue("id", Number(item.id), {
			shouldValidate: true,
		});
		setValue("contactPrincipalId", Number(item.contactPrincipalId), {
			shouldValidate: true,
		});
		setValue("contactPartnerId", Number(item.contactPartnerId), {
			shouldValidate: true,
		});
		setValue("contactDetails.clientName", item.contactDetails.clientName, {
			shouldValidate: true,
		});
		setValue(
			"contactDetails.clientComments",
			item.contactDetails.clientComments,
			{
				shouldValidate: true,
			}
		);
		setValue(
			"contactDetails.clientEmailId",
			item.contactDetails.clientEmailId,
			{
				shouldValidate: true,
			}
		);
		setValue("contactDetails.clientTitle", item.contactDetails.clientTitle, {
			shouldValidate: true,
		});
		setValue(
			"contactDetails.clientIsActive",
			item.contactDetails.clientIsActive,
			{
				shouldValidate: true,
			}
		);
		setValue(
			"contactDetails.clientContactDetails.primary",
			item.contactDetails.clientContactDetails.primary,
			{
				shouldValidate: true,
			}
		);

		setShow(true);
	};

	const onSubmit = async values => {
		//e.preventDefault();
		if (isEdit) {
			updatePrincipalContact(values);
		} else {
			addPrincipalContact(values);
		}
	};

	console.log(".......", errors);
	const DeletePrincipals = async modalBody => {
		// const objToSend = {
		//   id: modalBody.id,
		// };
		const res = await fetchJSON(
			BASE_URL + "/dashboard/contacts/" + modalBody.id,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				//body: JSON.stringify(objToSend),
			}
		);
		if (res) {
			getPrincipalContacts();
			DeleteModal();
			setSuccess(true);
			setMessage("Deleted Successfully");
		}
	};

	useEffect(() => {
		getPrincipals();
		getPrincipalContacts();
	}, []);

	useEffect(() => {
		if (searchFilter || principalFilters) {
			getPrincipalContacts();
		}
	}, [searchFilter, principalFilters]);

	const setSearch = e => {
		setSearchFilter();
		if (e === "") {
			setTableData(principalcontacts);
		} else {
			//This needs to more accurate
			let filteredData = principalcontacts.filter(ele =>
				JSON.stringify(ele)
					.toLowerCase()
					.includes(e.toLowerCase())
			);
			setTableData(filteredData);
		}
	};

	const Columns = [
		{
			label: "Name",
			key: "clientName",
		},
		{
			label: "DESIGNATION",
			key: "clientTitle",
			isSort: true,
			minWidth: 150,
		},
		{
			label: "EMAIL",
			key: "clientEmailId",
		},
		{
			label: "CONTACT#",
			key: "clientContact",
			isCenter: true,
		},
		{
			label: "Status",
			key: "isActive",
			isTag: true,
			isSort: true,
			isCenter: true,
		},
		{
			label: "ACTIONS",
			key: "actions",
			minWidth: 100,
			isCenter: true,
		},
		{
			label: "COMMENTS",
			key: "clientComments",
		},
	];

	const snap = useSnapshot(valtioState);

	return (
		<>
			<Card className="card-box expand-card">
				<CardHeader title="Vendor Contacts">
					<CardHeaderToolbar>
						{snap.navRoles?.contactList?.add ? (
							<Button
								type="submit"
								onClick={() => {
									setIsEdit(false);
									setFormData({});
									handleShow();
								}}
								className="btn btn-light-primary font-weight-bolder"
							>
								Add +
							</Button>
						) : null}
					</CardHeaderToolbar>
				</CardHeader>
				<CardBody>
					<div className="card-bottom">
						<Form>
							<div className="row">
								<div className="col-lg-4">
									<Form.Group controlId="exampleForm.ControlSelect1">
										<Form.Control
											as="select"
											value={principalFilters}
											onChange={e => {
												setPrincipalFilters(e.target.value);
												setSearchFilter("");
											}}
										>
											<option selected="true" value="" disabled="disabled">
												Select Vendor
											</option>
											<option value="all">All</option>
											{principals.map(item => {
												return (
													<option value={item.principalId}>
														{item.principalName}
													</option>
												);
											})}
										</Form.Control>
									</Form.Group>
								</div>
								<div className="col-lg-4">
									<Form.Group controlId="exampleForm.ControlInput1">
										<Form.Control
											type="email"
											placeholder="Search"
											value={searchFilter}
											onChange={e => setSearch(e.target.value)}
										/>
									</Form.Group>
								</div>
							</div>
						</Form>
					</div>
				</CardBody>
				<DataTable
					columns={Columns}
					data={[
						...tableData.map(item => {
							item.clientName = item?.contactDetails?.clientName;
							item.clientTitle = item?.contactDetails?.clientTitle;
							item.clientEmailId = item?.contactDetails?.clientEmailId;
							item.clientContact =
								item?.contactDetails?.clientContactDetails?.primary;
							item.clientComments = item?.contactDetails?.clientComments;
							item.isActive = item?.contactDetails?.clientIsActive;
							item.actions = (
								<div className="d-flex">
									{snap.navRoles?.contactList?.edit ? (
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
													onClick={() => handleRowClick(item)}
												/>
											</span>
										</a>
									) : null}
									{snap.navRoles?.contactList?.delete ? (
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
													onClick={e => DeleteModal(e, item)}
												/>
											</span>
										</a>
									) : null}
								</div>
							);
							return item;
						}),
					]}
				/>
				{!tableData.length ? (
					<div className="m-4 ml-8">{!loader && "No records found"}</div>
				) : null}
			</Card>

			{/* MODAL STARTS HERE*/}

			<Modal size="lg" show={show} onHide={handleShow}>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Modal.Header closeButton>
						<Modal.Title>Vendor Contact</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{/* FORM STARTS */}
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Name *</Form.Label>

							<FormInput
								type="text"
								placeholder="Name"
								name="contactDetails.clientName"
								register={register}
								className={`form-control form-control-lg form-control`}
							/>
							<FormError error={errors?.contactDetails?.clientName?.message} />
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Designation *</Form.Label>
							<FormInput
								type="text"
								placeholder="Designation"
								name="contactDetails.clientTitle"
								register={register}
								className={`form-control form-control-lg form-control`}
							/>
							<FormError error={errors?.contactDetails?.clientTitle?.message} />
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Email *</Form.Label>
							<FormInput
								type="text"
								placeholder="eg: name@example.com"
								name="contactDetails.clientEmailId"
								register={register}
								className={`form-control form-control-lg form-control`}
							/>
							<FormError
								error={errors?.contactDetails?.clientEmailId?.message}
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Vendor *</Form.Label>
							<Form.Control
								as="select"
								name="contactPrincipalId"
								onChange={e => {
									setValue("contactPrincipalId", Number(e.target.value), {
										shouldValidate: true,
									});
								}}
								value={watch("contactPrincipalId")}
							>
								<option value="">Select Vendor</option>
								{principals.map(e => (
									<option value={e.principalId}>{e.principalName}</option>
								))}
							</Form.Control>
							<FormError error={errors?.contactPrincipalId?.message} />
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Primary contact number</Form.Label>
							<FormInput
								type="number"
								placeholder="eg: 9110002320"
								name="contactDetails.clientContactDetails.primary"
								register={register}
								className={`form-control form-control-lg form-control`}
							/>
							<FormError
								error={
									errors?.contactDetails?.clientContactDetails?.primary?.message
								}
							/>
						</Form.Group>

						<Form.Group controlId="exampleForm.ControlTextarea1">
							<Form.Label>Comment</Form.Label>
							<FormInput
								type="text"
								placeholder="Comment"
								name="contactDetails.clientComments"
								register={register}
								className={`form-control form-control-lg form-control`}
							/>
							<FormError
								error={errors["contactDetails.clientComments"]?.message}
							/>
						</Form.Group>

						{/* RADIO BUTTON STARTS */}
						<Form.Label>Active</Form.Label>
						<div key={`default-1`} className="mb-3">
							<Form.Group controlId="exampleForm.ControlInput1">
								<Form.Check
									inline
									type={"radio"}
									label={`Yes`}
									name="contactDetails.clientIsActive"
									onChange={e =>
										setValue("contactDetails.clientIsActive", true, {
											shouldValidate: true,
										})
									}
									checked={watch("contactDetails.clientIsActive")}
								/>

								<Form.Check
									inline
									type={"radio"}
									label={`No`}
									name="checkbox"
									onChange={e =>
										setValue("contactDetails.clientIsActive", false, {
											shouldValidate: true,
										})
									}
									checked={!watch("contactDetails.clientIsActive")}
								/>
							</Form.Group>
						</div>
						{/* RADIO BUTTON ENDS */}

						{/* FORM ENDS */}
					</Modal.Body>
					<Modal.Footer>
						<Button
							className="btn btn-light-danger font-weight-bolder mr-5"
							onClick={handleShow}
						>
							Close
						</Button>
						<Button
							type="submit"
							className="btn btn-light-primary font-weight-bolder"
						>
							{isEdit ? "Update" : "Add"}
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>

			{/* MODAL ENDS HERE*/}

			<Modal size="md" show={deleteModal} centered onHide={DeleteModal}>
				<Modal.Body>
					<div className="d-flex justify-content-center mb-4">
						<h1>Are you sure?</h1>
					</div>
					<div className="d-flex justify-content-center mt-2">
						<span className="font-size-25">
							You are about to delete contact:{" "}
							<b> {modalBody.contactDetails?.clientName}</b>!
						</span>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="danger"
						onClick={DeleteModal}
						className="btn btn-light-warning font-weight-bolder mr-5"
					>
						Cancel
					</Button>
					<Button
						className="btn btn-light-danger font-weight-bolder"
						onClick={() => DeletePrincipals(modalBody)}
					>
						Yes, delete it!
					</Button>
				</Modal.Footer>
			</Modal>
			<SnackbarComp
				open={isSuccess}
				message={message}
				onClose={e => setSuccess(false)}
			></SnackbarComp>
		</>
	);
}

export default PrincipalContactsPage;
