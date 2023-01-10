import './SummaryCard.css';

export default function SummaryCard(props) {
  return (
    <div className='summary-card'>
      <div className='summary-details'>
        <div className='summary-card-value'>{props.value}</div>
        <div className='summary-card-title'>{props.title}</div>
      </div>
      <img src={props.icon} className={props.class + ' summary-card-icon'} />
    </div>
  );
}
