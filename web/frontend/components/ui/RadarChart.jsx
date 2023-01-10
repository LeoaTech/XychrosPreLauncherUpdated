import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { createRef } from 'react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);



export default function RadarChart(props) {
  const chartRef  = createRef();
  console.log(chartRef,"ref");
  // let gradient = chartRef.current.chartInstance.ctx.createLinearGradient
  return <Radar data={props.data} options={props.options} />;
}
