import React, { useEffect, useState } from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { getColorRange } from "nivo/es/lib/colors";

const data = {
	name: "nivo",
	color: "hsl(26, 70%, 50%)",
	children: [
		{
			name: "viz",
			color: "hsl(212, 70%, 50%)",
			children: [
				{
					name: "stack",
					color: "hsl(278, 70%, 50%)",
					children: [
						{
							name: "cchart",
							color: "hsl(42, 70%, 50%)",
							loc: 175138,
						},
						{
							name: "xAxis",
							color: "hsl(63, 70%, 50%)",
							loc: 153277,
						},
						{
							name: "yAxis",
							color: "hsl(107, 70%, 50%)",
							loc: 138731,
						},
						{
							name: "layers",
							color: "hsl(177, 70%, 50%)",
							loc: 131834,
						},
					],
				},
				{
					name: "ppie",
					color: "hsl(246, 70%, 50%)",
					children: [
						{
							name: "chart",
							color: "hsl(6, 70%, 50%)",
							children: [
								{
									name: "pie",
									color: "hsl(251, 70%, 50%)",
									children: [
										{
											name: "outline",
											color: "hsl(62, 70%, 50%)",
											loc: 55700,
										},
										{
											name: "slices",
											color: "hsl(267, 70%, 50%)",
											loc: 76279,
										},
										{
											name: "bbox",
											color: "hsl(70, 70%, 50%)",
											loc: 157073,
										},
									],
								},
								{
									name: "donut",
									color: "hsl(298, 70%, 50%)",
									loc: 90258,
								},
								{
									name: "gauge",
									color: "hsl(17, 70%, 50%)",
									loc: 158514,
								},
							],
						},
						{
							name: "legends",
							color: "hsl(303, 70%, 50%)",
							loc: 191125,
						},
					],
				},
			],
		},
		{
			name: "colors",
			color: "hsl(76, 70%, 50%)",
			children: [
				{
					name: "rgb",
					color: "hsl(150, 70%, 50%)",
					loc: 198849,
				},
				{
					name: "hsl",
					color: "hsl(126, 70%, 50%)",
					loc: 22596,
				},
			],
		},
		{
			name: "utils",
			color: "hsl(237, 70%, 50%)",
			children: [
				{
					name: "randomize",
					color: "hsl(195, 70%, 50%)",
					loc: 13667,
				},
				{
					name: "resetClock",
					color: "hsl(121, 70%, 50%)",
					loc: 38026,
				},
				{
					name: "noop",
					color: "hsl(13, 70%, 50%)",
					loc: 159933,
				},
				{
					name: "tick",
					color: "hsl(56, 70%, 50%)",
					loc: 167215,
				},
				{
					name: "forceGC",
					color: "hsl(222, 70%, 50%)",
					loc: 115633,
				},
				{
					name: "stackTrace",
					color: "hsl(57, 70%, 50%)",
					loc: 146515,
				},
				{
					name: "dbg",
					color: "hsl(16, 70%, 50%)",
					loc: 30614,
				},
			],
		},
		{
			name: "generators",
			color: "hsl(187, 70%, 50%)",
			children: [
				{
					name: "address",
					color: "hsl(57, 70%, 50%)",
					loc: 131270,
				},
				{
					name: "city",
					color: "hsl(189, 70%, 50%)",
					loc: 139508,
				},
				{
					name: "animal",
					color: "hsl(249, 70%, 50%)",
					loc: 186590,
				},
				{
					name: "movie",
					color: "hsl(213, 70%, 50%)",
					loc: 159270,
				},
				{
					name: "user",
					color: "hsl(87, 70%, 50%)",
					loc: 91049,
				},
			],
		},
		{
			name: "set",
			color: "hsl(167, 70%, 50%)",
			children: [
				{
					name: "clone",
					color: "hsl(53, 70%, 50%)",
					loc: 108378,
				},
				{
					name: "intersect",
					color: "hsl(158, 70%, 50%)",
					loc: 126545,
				},
				{
					name: "merge",
					color: "hsl(327, 70%, 50%)",
					loc: 69565,
				},
				{
					name: "reverse",
					color: "hsl(218, 70%, 50%)",
					loc: 155986,
				},
				{
					name: "toArray",
					color: "hsl(146, 70%, 50%)",
					loc: 177462,
				},
				{
					name: "toObject",
					color: "hsl(299, 70%, 50%)",
					loc: 161392,
				},
				{
					name: "fromCSV",
					color: "hsl(307, 70%, 50%)",
					loc: 142179,
				},
				{
					name: "slice",
					color: "hsl(46, 70%, 50%)",
					loc: 104622,
				},
				{
					name: "append",
					color: "hsl(257, 70%, 50%)",
					loc: 50658,
				},
				{
					name: "prepend",
					color: "hsl(273, 70%, 50%)",
					loc: 41559,
				},
				{
					name: "shuffle",
					color: "hsl(252, 70%, 50%)",
					loc: 25907,
				},
				{
					name: "pick",
					color: "hsl(140, 70%, 50%)",
					loc: 11469,
				},
				{
					name: "plouc",
					color: "hsl(10, 70%, 50%)",
					loc: 126726,
				},
			],
		},
		{
			name: "text",
			color: "hsl(322, 70%, 50%)",
			children: [
				{
					name: "trim",
					color: "hsl(171, 70%, 50%)",
					loc: 13392,
				},
				{
					name: "slugify",
					color: "hsl(353, 70%, 50%)",
					loc: 130624,
				},
				{
					name: "snakeCase",
					color: "hsl(174, 70%, 50%)",
					loc: 174684,
				},
				{
					name: "camelCase",
					color: "hsl(180, 70%, 50%)",
					loc: 168911,
				},
				{
					name: "repeat",
					color: "hsl(179, 70%, 50%)",
					loc: 134398,
				},
				{
					name: "padLeft",
					color: "hsl(207, 70%, 50%)",
					loc: 182522,
				},
				{
					name: "padRight",
					color: "hsl(228, 70%, 50%)",
					loc: 182805,
				},
				{
					name: "sanitize",
					color: "hsl(156, 70%, 50%)",
					loc: 50197,
				},
				{
					name: "ploucify",
					color: "hsl(18, 70%, 50%)",
					loc: 124648,
				},
			],
		},
		{
			name: "misc",
			color: "hsl(88, 70%, 50%)",
			children: [
				{
					name: "greetings",
					color: "hsl(158, 70%, 50%)",
					children: [
						{
							name: "hey",
							color: "hsl(349, 70%, 50%)",
							loc: 175754,
						},
						{
							name: "HOWDY",
							color: "hsl(223, 70%, 50%)",
							loc: 71096,
						},
						{
							name: "aloha",
							color: "hsl(306, 70%, 50%)",
							loc: 92675,
						},
						{
							name: "AHOY",
							color: "hsl(136, 70%, 50%)",
							loc: 24238,
						},
					],
				},
				{
					name: "other",
					color: "hsl(253, 70%, 50%)",
					loc: 136909,
				},
				{
					name: "path",
					color: "hsl(39, 70%, 50%)",
					children: [
						{
							name: "pathA",
							color: "hsl(46, 70%, 50%)",
							loc: 182961,
						},
						{
							name: "pathB",
							color: "hsl(219, 70%, 50%)",
							children: [
								{
									name: "pathB1",
									color: "hsl(2, 70%, 50%)",
									loc: 79738,
								},
								{
									name: "pathB2",
									color: "hsl(255, 70%, 50%)",
									loc: 91161,
								},
								{
									name: "pathB3",
									color: "hsl(130, 70%, 50%)",
									loc: 95517,
								},
								{
									name: "pathB4",
									color: "hsl(277, 70%, 50%)",
									loc: 152775,
								},
							],
						},
						{
							name: "pathC",
							color: "hsl(301, 70%, 50%)",
							children: [
								{
									name: "pathC1",
									color: "hsl(139, 70%, 50%)",
									loc: 133000,
								},
								{
									name: "pathC2",
									color: "hsl(335, 70%, 50%)",
									loc: 126499,
								},
								{
									name: "pathC3",
									color: "hsl(205, 70%, 50%)",
									loc: 11628,
								},
								{
									name: "pathC4",
									color: "hsl(59, 70%, 50%)",
									loc: 36731,
								},
								{
									name: "pathC5",
									color: "hsl(343, 70%, 50%)",
									loc: 152859,
								},
								{
									name: "pathC6",
									color: "hsl(258, 70%, 50%)",
									loc: 119972,
								},
								{
									name: "pathC7",
									color: "hsl(304, 70%, 50%)",
									loc: 168547,
								},
								{
									name: "pathC8",
									color: "hsl(127, 70%, 50%)",
									loc: 81255,
								},
								{
									name: "pathC9",
									color: "hsl(178, 70%, 50%)",
									loc: 12726,
								},
							],
						},
					],
				},
			],
		},
	],
};

export default function CertificationChart({ chartData }) {
	const [data, setData] = useState({});

	useEffect(() => {
		formatData(chartData);
	}, [chartData]);

	const getPrincipalName = id => {
		switch (id) {
			case 11:
				return "AWS";
			case 13:
				return "Azure";
			case 12:
				return "GCP";
			default:
				return "";
		}
	};

	const getColor = id => {
		switch (id) {
			case 11:
				return "#FF9900";
			case 13:
				return "#4285F4";
			case 12:
				return "#1BC5BD";
			default:
				return "";
		}
	};
	const formatData = data => {
		console.log(data);
		let childrens = [];
		if (data) {
			data.forEach(ele => {
				let children = [];
				for (let item in ele.summary) {
					children.push({
						name: item,
						color: getColor(ele.principalId),
						loc: ele.summary[item],
					});
				}
				childrens.push({
					name: getPrincipalName(ele.principalId),
					color: getColor(ele.principalId),
					children: children,
				});
			});

			setData({
				name: "CERTIFICATIONS",
				color: "hsl(26, 70%, 50%)",
				children: childrens,
			});
		}
	};

	const flatten = data =>
		data.reduce((acc, item) => {
			if (item.children) {
				return [...acc, item, ...flatten(item.children)];
			}

			return [...acc, item];
		}, []);

	const findObject = (data, name) =>
		data.find(searchedName => searchedName.name === name);

	return (
		<div
			style={{
				width: '80%',
				height: 400,
				marginBottom: 50,
			}}
			className="shadow-sm bg-white"
		>
			{/* <button className="btn btn-primary" onClick={() => formatData(chartData)}>Reset</button> */}
			{chartData.length > 0 ? (
				<React.Fragment>
					{/* <ResponsiveSunburst
                        data={data}
                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        id="name"
                        value="loc"
                        cornerRadius={2}
                        borderColor={{ theme: 'background' }}
                        colors={{ scheme: 'nivo' }}
                        childColor={{ from: 'color', modifiers: [['brighter', 0.1]] }}
                        enableArcLabels={true}
                        arcLabel={function (e) { return e.id + " (" + e.value + ")" }}
                        arcLabelsSkipAngle={20}
                        arcLabelsRadiusOffset={2}
                        onClick={clickedData => {
                            const foundObject = findObject(flatten(data.children), clickedData.id)
                            if (foundObject && foundObject.children) {
                                setData(foundObject)
                            }
                        }}
                        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
                    /> */}

					<ResponsiveTreeMap
						data={data}
						identity="name"
						value="loc"
						// valueFormat=".02s"
						colors={e => {
							return e.data.color;
						}}
						margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
						labelSkipSize={12}
						labelTextColor={{ from: "color", modifiers: [["darker", 1.2]] }}
						parentLabelTextColor={{
							from: "color",
							modifiers: [["darker", 2]],
						}}
						borderColor={{ from: "color", modifiers: [["darker", 0.1]] }}
					/>
				</React.Fragment>
			) : (
				"No Data Avaialable"
			)}
		</div>
	);
}
