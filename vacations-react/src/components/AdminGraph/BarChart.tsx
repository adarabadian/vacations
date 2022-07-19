import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-colorschemes';
import './graph.css';

function BarChart(props:any) {
  const data : any = {
      labels: [],
      datasets: [
        {
          label: 'Vacation Followers ❤',
          data: [], 
          // backgroundColor: ['red', 'blue', 'green'],
        }
      ],
  }

  const options : any = {
      maintainAspectRatio: true,
      plugins: {
        colorschemes: {
          scheme: 'brewer.SetTwo5'
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1,
              min: 0,
            },
          },
        ],
      },
  }
  
  for (let item of props.props.props){
    data.labels.push(item.destination);
    data.datasets[0].data.push(item.followersAmount);
  }

  return <Bar data={data} options={options} width={800} height={500}/>
}

export default BarChart