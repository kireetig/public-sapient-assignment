import React from 'react';
import Chart from 'chart.js';

interface LineChartProps{
    data: any;
}

export const LineChart: React.FC<LineChartProps> = props => {

    const chartRef = React.useRef<any>(null);

    React.useEffect(() => {
        const labels:any = [];
        const data:any = [];
      props.data.map((item:any) => {
            labels.push(item.objectID);
            data.push(item.voteCount || 0);
      })
        const chart = chartRef?.current.getContext('2d');
        new Chart(chart, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: "Car Speed",
              fill: false,
              backgroundColor: 'blue',
              borderColor: 'blue',
              data
            }]
          },
          options: {
            legend: {
                display: false
            },
            scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero:true
                          },
                          scaleLabel: {
                               display: true,
                               labelString: 'Votes',
                               fontSize: 20 
                            }
                      }],
                      xAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        scaleLabel: {
                             display: true,
                             labelString: 'ID',
                             fontSize: 20 
                          }
                    }]            
                  }  
          }
      });
      },[props.data]);

    return <div style={{position: 'relative', width: '100%'}}>
    <canvas ref={chartRef} height={100}/>
   </div>
}