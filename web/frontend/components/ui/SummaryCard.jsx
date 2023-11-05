import { useThemeContext } from "../../contexts/ThemeContext";
import "./SummaryCard.css";

const SummaryCard = (props) => {
  const {theme} = useThemeContext()
  // Format Largest Number Value(Clicks,Revenue,TotalRevenue, Referrals and Total Campaigns)
  function formatNumber(num) {
    if (num >= 1000000000000) {
      return (num / 1000000000).toFixed(1) + "T";
    } else if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + "B";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    } else {
      return num.toString();
    }
  }

  return (
    <div className={theme=== "dark"?"summary-card":"summary-card-light"}>
      <div className={theme === 'dark'?"summary-details":"summary-details-light"}>
        <div className="summary-card-value">{formatNumber(props.value)}</div>
        <div className="summary-card-title">{props.title}</div>
      </div>

      <div>
        <img src={props.icon} className={props.class + " summary-card-icon"} />
      </div>
    </div>
  );
};

export default SummaryCard;
