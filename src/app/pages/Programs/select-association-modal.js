import React, { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { Button } from "@material-ui/core";

import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";

import _ from "lodash";
import { DebounceInput } from "react-debounce-input";

const SelectAssociationModal = props => {
	const [programList, setProgramList] = useState([]);
	const [programListFilter, setProgramListFilter] = useState([]);

	useEffect(() => {
		getProgramList();
	}, []);

	const getProgramList = async () => {
		setProgramList([]);
		fetchJSON(
			BASE_URL + "/dashboard/programs/principal/" + props.principalId
		).then(res => {
			if (res.length && res !== "Error!") {
				const programs = [];
				res.map(ele => {
					if (!props.programs.find(program => program.programId === ele.id)) {
						programs.push(ele);
					}
				});
				setProgramList(programs);
				setProgramListFilter(programs);
			}
		});
	};

	const onSearchPrograms = e => {
		if (e === "" || !e || e === " ") {
			setProgramList(programListFilter);
		} else {
			let filteredData = programListFilter.filter(ele =>
				JSON.stringify(ele["programName"])
					.toLowerCase()
					.includes(e.toLowerCase())
			);
			setProgramList(filteredData);
		}
	};

	const addAssociation = async item => {
		const user = localStorage.getItem("user-details");
		const partnerId = JSON.parse(user).partnerId;
		const objToSend = {
			associationProgramId: item.id,
			associationPrincipalId: Number(item.programPrincipalId),
			associationPartnerId: partnerId,
		};
		const res = await fetchJSON(BASE_URL + "/dashboard/myorg/associations", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(objToSend),
		});
		if (res) {
			props.associationAdded();
		}
	};

	return (
		<Modal
			size="lg"
			show={true}
			onHide={() => {
				props.onClose();
			}}
		>
			<Modal.Header closeButton>
				<Modal.Title>New Association</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{/* FORM STARTS */}
				<Form>
					<Form.Group controlId="exampleForm.ControlInput1">
						<DebounceInput
							minLength={0}
							debounceTimeout={300}
							placeholder="Search"
							className={`form-control form-control-solid h-auto py-5 px-6`}
							onChange={event => onSearchPrograms(event.target.value)}
						/>
					</Form.Group>
				</Form>
				<div className="customscrollbar">
					{programList &&
						programList.map(item => {
							return (
								<>
									<div className="d-flex justify-content-between mb-4">
										<label>{item.programName}</label>
										<Button
											className="btn btn-info mr-5"
											size="small"
											type="submit"
											onClick={() => addAssociation(item)}
										>
											Associate
										</Button>
									</div>
									{/* <hr /> */}
								</>
							);
						})}
				</div>
				{/* FORM ENDS */}
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="danger"
					onClick={() => props.onClose()}
					className="btn btn-light-danger font-weight-bolder mr-5"
				>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default SelectAssociationModal;
