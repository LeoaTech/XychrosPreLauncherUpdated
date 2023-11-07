import "./Charts.css";
import LineChart from "./LineChart";
import DonutChart from "./DonutChart";
import RadarChart from "./RadarChart";
import { useThemeContext } from "../../contexts/ThemeContext";

export default function Charts(props) {
  const { theme } = useThemeContext();
  const chartType = props.type;
  return (
    <div id={props.type} className={theme === "dark" ? "chart" : "chart-light"}>
      <div className={theme === "dark" ? "chart-header" : "chart-header-light"}>
        <div
          className={theme === "dark" ? "chart-heading" : "chart-heading-light"}
        >
          {props.header}
        </div>
        <div className={theme === "dark" ? "chart-value" : "chart-value-light"}>
          {props.value}
        </div>
        <div
          className={
            theme === "dark" ? "chart-subheading" : "chart-subheading-light"
          }
        >
          {props.subheader}
        </div>
      </div>
      {chartType == "line" && (
        <LineChart
          options={props.LineChartOptions}
          data={props.LineChartData}
        />
      )}
      {chartType == "radar" && (
        <RadarChart
          options={props.RadarChartOptions}
          data={props.RadarChartData}
        />
      )}
      {chartType == "donut" && (
        <DonutChart
          options={props.DonutChartOptions}
          data={props.DonutChartData}
        />
      )}
    </div>
  );
}
