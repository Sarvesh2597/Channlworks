import React from "react";
import { Chart } from "react-charts";

export function LinesChart({ cdata }) {
	console.log("cdata", cdata);

	const axes = React.useMemo(
		() => [
			{
				primary: true,
				type: "ordinal",
				position: "bottom",
			},
			{ type: "linear", position: "left" },
		],
		[]
	);

	const tooltip = React.useMemo(
		() => ({
			render: ({ datum, primaryAxis, getStyle }) => {
				return <CustomTooltip {...{ getStyle, primaryAxis, datum }} />;
			},
		}),
		[]
	);

	function CustomTooltip({ getStyle, primaryAxis, datum }) {
		const data = React.useMemo(
			() =>
				datum
					? [
							{
								data: datum.group.map(d => ({
									primary: d.series.label,
									secondary: d.secondary,
									color: getStyle(d).fill,
								})),
							},
					  ]
					: [],
			[datum, getStyle]
		);

		return datum ? (
			<div
				style={{
					color: "white",
					pointerEvents: "none",
				}}
			>
				<h3
					style={{
						display: "block",
						textAlign: "center",
					}}
				>
					{primaryAxis.format(datum.primary)}
				</h3>
				<div
					style={{
						display: "flex",
					}}
					className="p-4"
				>
					<div
						style={{
							background: datum.style.fill,
							width: 15,
							height: 15,
							borderRadius: 100,
							marginRight: 12,
						}}
					/>
					{datum.seriesLabel} - {datum.secondary}
					{/* <Chart
						data={data}
						dark
						series={{ type: "bar" }}
						axes={[
							{
								primary: true,
								position: "bottom",
								type: "ordinal",
							},
							{
								position: "left",
								type: "linear",
							},
						]}
						getDatumStyle={datum => ({
							color: datum.originalDatum.color,
						})}
						primaryCursor={{
							value: datum.seriesLabel,
						}}
					/> */}
				</div>
			</div>
		) : null;
	}

	return (
		<div
			style={{
				width: "80%",
				height: "400px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
			className="shadow-sm bg-white"
		>
			<div
				style={{
					width: "95%",
					height: "90%",
				}}
			>
				<Chart data={cdata} axes={axes} tooltip={tooltip} />
			</div>
		</div>
	);
}
