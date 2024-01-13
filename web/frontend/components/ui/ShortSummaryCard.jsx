import { useThemeContext } from "../../contexts/ThemeContext";
import "./ShortSummaryCard.css";

const ShortSummaryCard = (props) => {
const {theme} =useThemeContext()
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
    <div
      className={theme === "dark" ?`short-summary-card ${
        props?.is_deactivated ? "deactive" : ""
      }`:`short-summary-card-light ${
        props?.is_deactivated ? "deactive" : ""
      }`}
    >
      <div
        className={theme ==="dark" ?`short-summary-card-value ${
          props?.is_deactivated ? "deactive" : ""
        }`:`short-summary-card-value-light ${
          props?.is_deactivated ? "deactive" : ""
        }`}
      >
       <span className="short-summary-card-currency">{props?.value > 0 ?  props?.currency: ''} </span> {formatNumber(props.value)}
      </div>
      <img
        src={props.icon}
        className={props.class + " short-summary-card-icon"}
      />
    </div>
  );
};
export default ShortSummaryCard;
