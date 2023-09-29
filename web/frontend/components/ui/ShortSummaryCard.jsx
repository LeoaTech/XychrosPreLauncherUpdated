import "./ShortSummaryCard.css";

const ShortSummaryCard = (props) => {
  return (
    <div
      className={`short-summary-card ${
        props?.is_deactivated ? "deactive" : ""
      }`}
    >
      <div
        className={`short-summary-card-value ${
          props?.is_deactivated ? "deactive" : ""
        }`}
      >
        {props.value}
      </div>
      <img
        src={props.icon}
        className={props.class + " short-summary-card-icon"}
      />
    </div>
  );
};
export default ShortSummaryCard;
