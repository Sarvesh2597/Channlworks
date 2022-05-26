import React, { useState, useEffect } from "react";
import { Table, Popover, OverlayTrigger } from "react-bootstrap";
import SkeletonComp from "./SkeletonComp";
import _, { isArray } from "lodash";
import { CardBody } from "../../_metronic/_partials/controls";
import { datePipe } from "../../_metronic/_helpers/date-pipe";
import { Link } from "react-router-dom";

export default function DataTable({ data, columns, loader, func }) {
	const [sortActiveKey, setSortKey] = useState(null);
	const [sortType, setSortType] = useState("asc");
	const [tableData, setTableData] = useState([]);
	const currency =
		JSON.parse(localStorage.getItem("user-details"))?.Partner?.Currency
			?.currencyCode === "USD" ? (
			"($)"
		) : (
			<span className="rupee-symbol">(₹)</span>
		);

	useEffect(() => {
		setTableData(data);
	}, [data]);

	const sortData = sortActiveKey => {
		setSortKey(sortActiveKey);
		setSortType(sortType == "asc" ? "desc" : "asc");
		let sortedData = _.orderBy(
			tableData,
			[
				item =>
					item[sortActiveKey]
						? typeof item[sortActiveKey] === "number" ||
						  typeof item[sortActiveKey] === "boolean"
							? item[sortActiveKey]
							: item[sortActiveKey].toLowerCase()
						: "",
			],
			[sortType]
		);
		setTableData(sortedData);
	};
	return (
		<CardBody>
			<div className="table-container">
				<Table>
					<thead>
						<tr>
							{columns &&
								columns.map(col => {
									return (
										<th
											className="table-text"
											style={{
												minWidth: col.minWidth,
												textAlign: col.isCenter ? "center" : "left",
											}}
										>
											{col.label}
											{col.isCurrency && currency}
											{col.isSort && (
												<React.Fragment>
													{sortActiveKey == col.key && sortType === "asc" && (
														<i
															className="fa fa-sort-up ml-2 cursor"
															onClick={e => sortData(col.key)}
															aria-hidden="true"
														></i>
													)}

													{sortActiveKey == col.key && sortType === "desc" && (
														<i
															className="fa fa-sort-down ml-2 cursor"
															onClick={e => sortData(col.key)}
															aria-hidden="true"
														></i>
													)}
													{sortActiveKey !== col.key && (
														<i
															className="fa fa-sort ml-2 cursor"
															onClick={e => sortData(col.key)}
															aria-hidden="true"
														></i>
													)}
												</React.Fragment>
											)}
										</th>
									);
								})}
						</tr>
					</thead>
					<tbody>
						{loader ? (
							<SkeletonComp
								rows={8}
								columns={columns ? columns.length : 4}
							></SkeletonComp>
						) : (
							<React.Fragment>
								{tableData &&
									tableData.map(item => {
										return (
											<tr>
												{columns &&
													columns.map(col => {
														return (
															<td
																style={{
																	textAlign: col.isCenter ? "center" : "left",
																	cursor: "pointer",
																}}
																onClick={() => (func ? func(item) : null)}
															>
																<React.Fragment>
																	{!col.isHoverData && !col.isLink && (
																		<React.Fragment>
																			{col.isDate
																				? datePipe(item[col.key])
																				: col.isLocaleValue &&
																				  item[col.key] !== null
																				? item[col.key].toLocaleString()
																				: item[col.key]}
																			{col.isPercent ? "%" : ""}
																			{col.isTag && (
																				<span
																					className={`label label-lg label-light-${
																						item[col.key] ? "success" : "danger"
																					} label-inline`}
																				>
																					{item[col.key]
																						? "Active"
																						: "Inactive"}
																				</span>
																			)}
																		</React.Fragment>
																	)}
																	{col.isHoverData &&
																		!col.isLink &&
																		item.hoverData.length > 0 && (
																			<React.Fragment>
																				{col.isDate
																					? datePipe(item[col.key])
																					: item[col.key]}
																				<OverlayTrigger
																					trigger="hover"
																					placement="right"
																					overlay={
																						<Popover
																							style={{
																								padding: 16,
																								maxWidth: 500,
																							}}
																							id="popover-basic"
																							title="Popover right"
																						>
																							<strong>
																								{item.hoverDataTitle}
																							</strong>
																							<hr></hr>
																							<table>
																								<tbody>
																									{item.hoverData !== null &&
																									isArray(item.hoverData)
																										? item.hoverData.map(
																												(ele, index) => {
																													return (
																														<React.Fragment>
																															{ele && (
																																<tr>
																																	<td
																																		style={{
																																			minWidth: 10,
																																		}}
																																	>
																																		<b>
																																			{index +
																																				1}
																																			.
																																		</b>
																																	</td>
																																	<td
																																		style={{
																																			minWidth: 160,
																																			maxWidth: 200,
																																		}}
																																	>
																																		{ele?.text}
																																	</td>
																																	<td
																																		style={{
																																			paddingLeft: 50,
																																		}}
																																	>
																																		{ele?.value}
																																	</td>
																																</tr>
																															)}
																														</React.Fragment>
																													);
																												}
																										  )
																										: "NA"}
																								</tbody>
																							</table>
																						</Popover>
																					}
																				>
																					<i
																						className="fa fa-question-circle cursor"
																						style={{
																							fontSize: 12,
																							paddingLeft: 8,
																						}}
																					></i>
																				</OverlayTrigger>
																			</React.Fragment>
																		)}
																	{col.isLink && (
																		<Link to={item[col["linkKey"]]["to"]}>
																			{item[col.key]}
																		</Link>
																	)}
																</React.Fragment>
															</td>
														);
													})}
											</tr>
										);
									})}
							</React.Fragment>
						)}
					</tbody>
				</Table>
			</div>
		</CardBody>
	);
}
