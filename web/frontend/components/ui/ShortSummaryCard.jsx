import './ShortSummaryCard.css';

export default function ShortSummaryCard(props) {
  return (
    <div className='short-summary-card'>
      <div className='short-summary-card-value'>{props.value}</div>
      <img
        src={props.icon}
        className={props.class + ' short-summary-card-icon'}
      />
    </div>
  );
}
