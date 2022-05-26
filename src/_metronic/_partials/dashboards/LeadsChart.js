import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

export default function LeadsChart(data) {
    const [chartData,setData] = useState({});
    useEffect(() => {
      setData({
          labels:[...data.data.map(item=>item.salesLeadName )],
          datasets: [
            {
              axis: 'y',
              label: '',
              data:[...data.data.map(item=>item.salesValue)],
              backgroundColor: ['#063A5B', '#FF7A8B', '#F3D487', '#535353', '#F0B92D'],
            }
          ]
      })
    }, [data]);

    const config = {
        type: 'bar',
        data: data,
        indexAxis: 'y',
        plugins: {
            legend: {
                display:false
            },
            dataLabels:{
              display:true,
              color:'white'
            }
        },
        options: {
          responsive: true,
       
          plugins: {
            title: {
              display: true,
              text: 'Chart.js Doughnut Chart'
            }
          }
        },
      };
    return (
        <Bar data={chartData}
            options={config} ></Bar>
    )
}