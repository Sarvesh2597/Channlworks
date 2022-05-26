import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

export default function ClientsChart(data) {
    const [chartData,setData] = useState({});
    useEffect(() => {
      setData({
          labels:[...data.data.map(item=>item.clientName)],
          datasets: [
            {
              label: '',
              data:[...data.data.map(item=>item.ttl)],
              backgroundColor: ['#7FBBC5', '#5E8AAD', '#B1CDBF', '#535353', '#A9D78C'],
            }
          ]
      })
    }, [data]);

    const config = {
        type: 'bar',
        data: chartData,
        plugins: {
            legend: {
                display:false
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
                    display:false
                },
                title: {
                    display: true,
                    text: 'Chart.js Pie Chart'
                },
               
            }
        },
    };
    return (
        <Bar data={chartData}
            options={config} ></Bar>
    )
}