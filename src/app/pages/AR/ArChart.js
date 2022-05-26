import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { ResponsivePie } from '@nivo/pie'


export default function ArChart({ data }) {
    const [chartData, setData] = useState([]);
    const currency = JSON.parse(localStorage.getItem('user-details'))?.Partner?.Currency?.currencyCode === 'USD' ? '$' : '₹';
    useEffect(() => {
        console.log(data);
        // setData({
        //     labels: [...data.map(item => item.label)],
        //     datasets: [
        //         {
        //             label: '',
        //             data: [...data.map(item => item.value)],
        //             backgroundColor: ['#97E3D5', '#F47560', '#B1CDBF', '#F9F9F9', '#F0DFD2'],
        //         }
        //     ]
        // })
        setData([...data.map(item=>{
            return {
                id:item.label,
                label:item.label,
                value:item.value,
                "color": item.label==='Receivables' ? "#97E3D5": "#F47560"
            }
        })])
        
    }, [data]);

    const config = {
        type: 'bar',
        data: chartData,
        plugins: {
            legend: {
                display: true,
                position: "right",
            },
            datalabels: {
                anchor: "end",
                align: "top",
                formatter: Math.round,
                font: {
                    weight: "bold",
                },
            }
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: true,
                    text: 'Chart.js Pie Chart'
                },

            }
        },
    };
    return (
        <div className="d-flex justify-content-center align-items-center" style={{width:"100%" }}>
            {/* <Doughnut data={chartData}
                options={config} ></Doughnut> */}

            <ResponsivePie
                data={chartData}
                margin={{ top: 20, right: 0, bottom: 30, left: 0 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ datum: 'data.color' }}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'Receivables'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'Payables'
                        },
                        id: 'lines'
                    }                   
                ]}
                legends={[
                    
                ]}
            />

        </div>
    )
}