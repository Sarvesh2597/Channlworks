import React from "react";

export default function RevenueCards({
	totalvalue,
	principalvalue,
	principlePercentage,
	servicesValue,
	servicePercentage,
	othervalue,
	revenuePercentage,
}) {
	const currency =
		JSON.parse(localStorage.getItem("user-details"))?.Partner?.Currency
			?.currencyCode === "USD" ? (
			"$"
		) : (
			<span className="rupee-symbol">₹</span>
		);
	return (
		<div className="row">
			<div className="col-lg-2 bg-light-primary px-6 rounded-xl mr-7 mb-7">
				<div className="mt-4 text-center">
					<h5 className="text-primary font-size-15">
						{currency}
						{totalvalue && totalvalue.toLocaleString()}
					</h5>
					<div className="text-center mt-5">
						<label className="text-primary">Total</label>
					</div>
				</div>
			</div>
			<div className="col-lg-2 bg-light-info px-6 rounded-xl mr-7 mb-7">
				<div className="mt-4">
					<h5 className="text-info text-center font-size-15">
						{currency}
						{principalvalue && principalvalue.toLocaleString()}
					</h5>
					<div className="text-center">
						<label className="text-info">
							{principlePercentage !== "NaN" ? principlePercentage : 0}%
						</label>
						<br></br>
					</div>
					<div className="text-center">
						<label className="text-info">Revenue - Vendor</label>
					</div>
				</div>
			</div>
			<div className="col-lg-2 bg-light-warning px-6 rounded-xl mr-7 mb-7">
				<div className="mt-4">
					<h5 className="text-warning text-center font-size-15">
						{currency}
						{servicesValue && servicesValue.toLocaleString()
							? servicesValue.toLocaleString()
							: 0}
					</h5>
					<div className="text-center">
						<label className="text-warning">
							{servicePercentage !== "NaN" ? servicePercentage : 0}%
						</label>
						<br></br>
					</div>
					<div className="text-center">
						<label className="text-warning">Revenue - Services</label>
					</div>
				</div>
			</div>
			<div className="col-lg-2 bg-light-success px-6 rounded-xl mr-7 mb-7">
				<div className="mt-4">
					<h5 className="text-success text-center font-size-15">
						{currency}
						{othervalue && othervalue.toLocaleString()}
					</h5>
					<div className="text-center">
						<label className="text-success">
							{revenuePercentage !== "NaN" ? revenuePercentage : 0}%
						</label>
						<br></br>
					</div>
					<div className="text-center">
						<label className="text-success">Revenue - Others</label>
					</div>
				</div>
			</div>
		</div>
	);
}
