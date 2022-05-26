import React, { useEffect, useState } from "react";
import { fetchJSON } from "../../../_metronic/_helpers/api";
import { BASE_URL } from "../../../_metronic/_constants/endpoints";
import { Table, Form } from "react-bootstrap";
import _ from "lodash";
import { Button } from "@material-ui/core";

export default function RevneueFilter({ applyFilter, resetButtonClick }) {
	const [type, setType] = useState("text");

	const [endDateType, setEndDateType] = useState("text");
	const [principalFilters, setPrincipalFilters] = useState("All");
	const [startDateFilter, setStartDateFilter] = useState("");
	const [endDateFilter, setEndDateFilter] = useState("");
	const [searchFilter, setSearchFilter] = useState("");
	const [resetFilter, setResetFilter] = useState("");
	const [principals, setPrincipals] = useState([]);

	useEffect(() => {
		getPrincipals();
	}, []);

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

	const resetFilters = () => {
		setPrincipalFilters("All");
		setStartDateFilter("");
		setEndDateFilter("");
		setSearchFilter("");
		resetButtonClick();
	};
	return (
		<React.Fragment>
			<div className="row">
				<div className="col-lg-3">
					<Form>
						<Form.Group controlId="exampleForm.ControlSelect1">
							<Form.Control
								as="select"
								value={principalFilters}
								onChange={e => setPrincipalFilters(e.target.value)}
							>
								<option selected="true" value="" disabled="true">
									Select Vendor
								</option>
								<option value="All">All</option>
								{principals &&
									principals.map(item => {
										return (
											<option value={item.id}>{item.principalName}</option>
										);
									})}
							</Form.Control>
						</Form.Group>
					</Form>
				</div>
				<div className="col-lg-3">
					<Form>
						<Form.Group controlId="validationCustom02">
							<Form.Control
								required
								type={type}
								id="date"
								placeholder="Start Date"
								onFocus={() => setType("date")}
								onBlur={() => setType("text")}
								value={startDateFilter}
								onChange={e => {
									setStartDateFilter(e.target.value);
								}}
							/>
						</Form.Group>
					</Form>
				</div>
				<div className="col-lg-3">
					<Form>
						<Form.Group controlId="validationCustom02">
							<Form.Control
								required
								type={endDateType}
								placeholder="End Date"
								value={endDateFilter}
								onFocus={() => setEndDateType("date")}
								onBlur={() => setEndDateType("text")}
								onChange={e => {
									setEndDateFilter(e.target.value);
								}}
							/>
						</Form.Group>
					</Form>
				</div>
				<div className="col-lg-3">
					<Form>
						<Form.Group controlId="validationCustom02">
							<Form.Control
								required
								placeholder="Client Name"
								type="text"
								value={searchFilter}
								onChange={e => setSearchFilter(e.target.value)}
							/>
						</Form.Group>
					</Form>
				</div>
			</div>
			<div className="d-flex justify-content-end mt-1 mb-6">
				<Button
					type="submit"
					className="btn btn-light-info font-weight-bolder"
					onClick={e =>
						applyFilter({
							principalFilters,
							startDateFilter,
							endDateFilter,
							searchFilter,
						})
					}
				>
					Apply
				</Button>
				<Button
					type="submit"
					className="btn btn-light-danger font-weight-bolder ml-2"
					onClick={resetFilters}
				>
					Reset
				</Button>
			</div>
		</React.Fragment>
	);
}
