import './Charts.css';
import LineChart from './LineChart';
import DonutChart from './DonutChart';
import RadarChart from './RadarChart';

export default function Charts(props) {
  const chartType = props.type;
  return (
    <div id={props.type} className='chart'>
      <div className='chart-header'>
        <div className='chart-heading'>{props.header}</div>
        <div className='chart-value'>{props.value}</div>
        <div className='chart-subheading'>{props.subheader}</div>
      </div>
      {chartType == 'line' && (
        <LineChart
          options={props.LineChartOptions}
          data={props.LineChartData}
        />
      )}
      {chartType == 'radar' && (
        <RadarChart
          options={props.RadarChartOptions}
          data={props.RadarChartData}
        />
      )}
      {chartType == 'donut' && (
        <DonutChart
          options={props.DonutChartOptions}
          data={props.DonutChartData}
        />
      )}
    </div>
  );
}
