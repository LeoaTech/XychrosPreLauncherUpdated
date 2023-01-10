import ShortSummaryCard from '../ui/ShortSummaryCard';
import {subscriber, Sale, arrow,} from '../../assets/index';
import { IconContext } from 'react-icons';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

import './CampaignBlock.css';
import { Link } from 'react-router-dom';

export default function CampaignBlock(props) {
  const {
    id,
    campaign_name,
    product_name,
    product_link,
    created_at,
    start_date,
    end_date,
  } = props.data;
  return (
    <div className='campaign-block'>
      <div className='campaign-details'>
        <div className='camapign-block-name'>{campaign_name}</div>
        <Link to={product_link} className='campaign-block-product-name'>
          {product_name}
        </Link>
        <div className='campaign-block-duration'>
          {start_date} - {end_date}
        </div>
      </div>
      <div className='campaign-kpis'>
        <ShortSummaryCard value='345' icon={subscriber} className='referral-icon' />
        <ShortSummaryCard value='$37' icon={Sale} className='revenue-icon' />
        <ShortSummaryCard value='4568' icon={arrow} className='clicks-icon' />
      </div>
      <div className='campaign-actions'>
        <IconContext.Provider
          value={{
            color: '#fcfcfc',
            size: '30px',
          }}
        >
          <div className='icon-image'>
            <FaEdit />
          </div>
        </IconContext.Provider>
        <IconContext.Provider
          value={{
            color: 'red',
            size: '30px',
          }}
        >
          <div className='icon-image'>
            <RiDeleteBin6Line />
          </div>
        </IconContext.Provider>
      </div>
    </div>
  );
}
