/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import {
	DropdownCustomToggler,
	DropdownMenu4,
} from "../../../../_metronic/_partials/dropdowns";
import { useSnapshot } from "valtio";
import { valtioState } from "../../../App";

export function ProfileCard() {
	const user = useSelector(({ auth }) => auth.user, shallowEqual);

	useEffect(() => {
		return () => {};
	}, [user]);

	const snap = useSnapshot(valtioState);

	return (
		<>
			{user && (
				<div
					className="flex-row-auto offcanvas-mobile w-250px w-xxl-350px card-box"
					id="kt_profile_aside"
				>
					<div className="card card-custom card-stretch card-width">
						<div className="card-body pt-4">
							<div className="navi navi-bold navi-hover navi-active navi-link-rounded">
								<div className="navi-item mb-2">
									<NavLink
										to="/user-profile/personal-information"
										className="navi-link py-4"
										activeClassName="active"
									>
										<span className="navi-icon mr-2">
											<span className="svg-icon">
												<SVG
													src={toAbsoluteUrl(
														"/media/svg/icons/Design/Layers.svg"
													)}
												></SVG>{" "}
											</span>
										</span>
										<span className="navi-text font-size-lg">
											Profile Overview
										</span>
									</NavLink>
								</div>

								<div className="navi-item mb-2">
									<NavLink
										to="/user-profile/account-information"
										className="navi-link py-4"
										activeClassName="active"
									>
										<span className="navi-icon mr-2">
											<span className="svg-icon">
												<SVG
													src={toAbsoluteUrl(
														"/media/svg/icons/Communication/Group.svg"
													)}
												></SVG>{" "}
											</span>
										</span>
										<span className="navi-text font-size-lg">
											Manage Employees
										</span>
									</NavLink>
								</div>
								<div className="navi-item mb-2">
									<NavLink
										to="/user-profile/change-password"
										className="navi-link py-4"
										activeClassName="active"
									>
										<span className="navi-icon mr-2">
											<span className="svg-icon">
												<SVG
													src={toAbsoluteUrl(
														"/media/svg/icons/Communication/Shield-user.svg"
													)}
												></SVG>{" "}
											</span>
										</span>
										<span className="navi-text font-size-lg">
											Manage Authorized Users
										</span>
									</NavLink>
								</div>
								{snap.navRoles?.editRoles?.view ? (
									<div className="navi-item mb-2">
										<NavLink
											to="/user-profile/email-settings"
											className="navi-link py-4"
											activeClassName="active"
										>
											<span className="navi-icon mr-2">
												<span className="svg-icon">
													<SVG
														src={toAbsoluteUrl(
															"/media/svg/icons/Communication/Add-user.svg"
														)}
													></SVG>{" "}
												</span>
											</span>
											<span className="navi-text font-size-lg">
												Manage Roles
											</span>
										</NavLink>
									</div>
								) : null}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
