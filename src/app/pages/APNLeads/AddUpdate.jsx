import React, { useState, useEffect } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";

import Button from "@material-ui/core/Button";
import "react-datepicker/dist/react-datepicker.css";

import { useSnapshot } from "valtio";
import { valtioState } from "../../App";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
	FormInput,
	FormInputDropDown,
	FormTextArea,
} from "../../Components/Basic/Form";

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
	campaignName: yup
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

export function AddUpdateLeads({
	onSubmit,
	isEdit,
	setIsEdit,
	show,
	handleShow,
}) {
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

	console.log(watch());

	useEffect(() => {}, []);

	const snap = useSnapshot(valtioState);

	return (
		<>
			<Button
				type="submit"
				className="btn btn-light-primary font-weight-bolder"
				onClick={() => {
					setIsEdit(false);
					handleShow();
				}}
				style={{
					marginRight: "10px",
				}}
			>
				Add +
			</Button>

			{/* MODAL 1 STARTS HERE*/}

			<Modal size="lg" show={show} onHide={handleShow}>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Modal.Header closeButton>
						<Modal.Title>APN - Leads Details</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormInputDropDown
							label="Field indicating the status of the lead based on lifecycle (E.g. Open or Qualified or Closed)"
							name="status"
							register={register}
							data={[
								{ label: "Open", value: "Open" },
								{ label: "Qualified", value: "Qualified" },
								{ label: "Closed", value: "Closed" },
							]}
							placeholder="Select Status"
							error={errors.status?.message}
						/>

						<FormInputDropDown
							label="Accepted/Rejected option for partners to accept or reject an opportunity shared by AWS. PII information on the opportunity is only available once partner accept the lead"
							name="currentLeadStage"
							register={register}
							data={[
								{ label: "Accepted", value: "Accepted" },
								{ label: "Rejected", value: "Rejected" },
							]}
							placeholder="Select Stage"
							error={errors.currentLeadStage?.message}
						/>

						<FormInput
							label="Unique identifier of the lead in the Partner's CRM"
							name="partnerCrmLeadId"
							register={register}
							placeholder="Partner CRM lead Id"
							error={errors.partnerCrmLeadId?.message}
						/>
						<FormInput
							label="Unique identifier of the lead in AWS APN system"
							name="apnCrmUniqueIdentifier"
							register={register}
							placeholder="APN CRM Unique Identifier"
							error={errors.apnCrmUniqueIdentifier?.message}
						/>
						<FormInput
							label="AWS Campaign name that is associated with the lead generation"
							name="campaignName"
							register={register}
							placeholder="Campaign Name"
							error={errors.campaignName?.message}
						/>
						<FormInput
							label="First name of the end customer on the lead"
							name="firstName"
							register={register}
							placeholder="First Name"
							error={errors.firstName?.message}
						/>
						<FormInput
							label="Last name of the end customer on the lead"
							name="lastName"
							register={register}
							placeholder="Last name"
							error={errors.lastName?.message}
						/>
						<FormInput
							label="Email of the end customer on the lead"
							name="email"
							register={register}
							placeholder="Email"
							error={errors.email?.message}
						/>
						{/* <FormInput
							label="Website of the end customer on the lead"
							name="website"
							register={register}
							placeholder="Select Stage"
							error={errors.website?.message}
						/>
						<FormInputDropDown
							label="End customer use case that the lead is solving for (E.g. Migration, Business applications)"
							name="useCaseWorkload"
							register={register}
							data={[
								{ label: "Migration", value: "Migration" },
								{
									label: "Business Application",
									value: "Business Application",
								},
							]}
							placeholder="Select Use Case"
							error={errors.useCaseWorkload?.message}
						/>
						<FormInput
							label="Title of the end customer on the lead"
							name="title"
							register={register}
							placeholder="Select Stage"
							error={errors.title?.message}
						/>
						<FormInput
							label="Address of the end customer on the lead"
							name="streetAddress"
							register={register}
							placeholder="Select Stage"
							error={errors.streetAddress?.message}
						/>
						<FormInputDropDown
							label="State (part of the address) of the end customer on the lead"
							name="state"
							register={register}
							data={[
								{ label: "Maharashtra", value: "Maharashtra" },
								{
									label: "West Bengal",
									value: "West Bengal",
								},
							]}
							placeholder="Select State"
							error={errors.state?.message}
						/>
						<FormInput
							label="Company Size of the end customer on the lead"
							name="segmentCompanySize"
							register={register}
							placeholder="Select Stage"
							error={errors.segmentCompanySize?.message}
						/>
						<FormTextArea
							label="Descriptive field articulating the customer need on the lead"
							name="projectDescription"
							register={register}
							placeholder="Description"
							error={errors.projectDescription?.message}
						/>
						<FormInput
							label="Postal Code (part of the address) of the end customer on the lead"
							name="postalCode"
							register={register}
							placeholder="Select Stage"
							error={errors.postalCode?.message}
						/>
						<FormInput
							label="Phone number of the end customer on the lead"
							name="phone"
							register={register}
							placeholder="Phone Number"
							error={errors.phone?.message}
						/>
						<FormInput
							label="End customer maturity on AWS"
							name="levelofAWSUsage"
							register={register}
							placeholder="Select Stage"
							error={errors.levelofAWSUsage?.message}
						/>
						<FormInput
							label="Please provide details regarding your engagement and next steps with the lead. Do not disclose any information that is confidential, sensitive or that would be considered personal information of an individual."
							name="leadStatusReason"
							register={register}
							placeholder=""
							error={errors.leadStatusReason?.message}
						/>
						<FormInput
							label="Lead source as maintained by AWS"
							name="leadSource"
							register={register}
							placeholder=""
							error={errors.leadSource?.message}
						/>
						<FormInput
							label="Name of the owner of the lead in the Partner organization.  This needs to be a Partner Central user"
							name="leaOwnerName"
							register={register}
							placeholder="Select Stage"
							error={errors.leaOwnerName?.message}
						/>
						<FormInput
							label="Email of the owner of the lead in the Partner organization.  This needs to be a Partner Central user"
							name="leadOwnerEmail"
							register={register}
							placeholder="Select Stage"
							error={errors.leadOwnerEmail?.message}
						/>
						<FormInput
							label="Age in days since the lead was created"
							name="leadAge"
							register={register}
							placeholder="Select Stage"
							error={errors.leadAge?.message}
						/>
						<FormInput
							label="Date-Time when the lead was last modified"
							name="lastModifiedDate"
							type="date"
							register={register}
							placeholder="Select Stage"
							error={errors.lastModifiedDate?.message}
						/>
						<FormInput
							label="Name of the person/entity that modified the lead"
							name="lastModifiedBy"
							register={register}
							placeholder="Select Stage"
							error={errors.lastModifiedBy?.message}
						/>
						<FormInput
							label="Industry of the end customer on the lead"
							name="industry"
							register={register}
							placeholder="Select Stage"
							error={errors.industry?.message}
						/>
						<FormInput
							label="Date-Time the lead was created"
							name="createdDate"
							type="date"
							register={register}
							placeholder="Select Stage"
							error={errors.createdDate?.message}
						/>
						<FormInput
							label="Name of the person/entity that created the lead"
							name="createdBy"
							register={register}
							placeholder="Select Stage"
							error={errors.createdBy?.message}
						/>
						<FormInputDropDown
							label="Country (part of the address) of the end customer on the lead"
							name="country"
							register={register}
							data={[
								{ label: "India", value: "India" },
								{
									label: "UK",
									value: "UK",
								},
							]}
							placeholder="Select Country"
							error={errors.country?.message}
						/>
						<FormInput
							label="Name of the end customer company name on the lead"
							name="company"
							register={register}
							placeholder="Select Stage"
							error={errors.company?.message}
						/>
						<FormInput
							label="City (part of the address) of the end customer on the lead"
							name="city"
							register={register}
							placeholder="Select Stage"
							error={errors.city?.message}
						/>
						<FormInput
							label="Level of engagement on the lead "
							name="CampaignMemberStatus"
							register={register}
							placeholder="Select Stage"
							error={errors.CampaignMemberStatus?.message}
						/> */}
						{/* RADIO BUTTON ENDS */}
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
								disabled={!isEdit}
								className="btn btn-light-primary font-weight-bolder"
							>
								Update
							</Button>
						) : snap.navRoles?.leads?.add ? (
							<Button
								variant="primary"
								type="submit"
								disabled={isEdit}
								className="btn btn-light-primary font-weight-bolder"
							>
								Add
							</Button>
						) : null}
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}
