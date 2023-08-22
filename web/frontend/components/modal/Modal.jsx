import '../modal/modal.css';
import DataTable from 'react-data-table-component';
import { modalColumns, referralRows } from '../referrals/dummyData';

// Data Table custom styles
const referralsStyles = {
  headCells: {
    style: {
      fontSize: '15px',
      fontWeight: 'bold',
      paddingLeft: "0 8px",
      justifyContent: 'center',
      color: '#232227',
      backgroundColor: '#FCFCFC',

      border: '1px solid gray',
      borderBottom: 'none',
      borderTop: 'none',


    },
  },
  cells: {
    style: {
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      border: " 1px solid gray",
    },
  },
  rows: {
    style: {
      backgroundColor: '#ECECEC',
      color: '#232229',
      textAlign: 'center',
    },
    highlightOnHoverStyle: {
      color: '#f3f3f3',
      backgroundColor: 'gray',
      transitionDuration: '0.15s',
      transitionProperty: 'background-color',
      borderBottomColor: 'white',
      outlineStyle: 'solid',
      outlineWidth: '1px',
      outlineColor: 'lightgray',
    },
  },
};

const ShowModal = ({ openModal, setOpenModal, values, fulldata }) => {
  const handleClose = () => {
    setOpenModal((prev) => !prev);
  };

  let finalData = [];
  if (values) {
    finalData = fulldata.filter(
      (one) => one.referrer_id == values.referral_code
    );
  }

  return openModal ? (
    <div className='modal'>
      <div className='modal_container'>
        <nav className='modal__nav'>
          <h6>Referral Details</h6>
          <p className='referral__id'>Campaign: {values?.campaign_name}</p>
        </nav>
        <section className='modal__body'>
          <p>
            <strong>Email:</strong> {values?.email}
          </p>
          <p>
            <strong>Referral Code:</strong> {values?.referral_code}
          </p>
          <p>
            <strong>Friends Joined:</strong> {values?.friends_joined}
          </p>
          <p>
            <strong>Date of Joining:</strong> {new Date(values?.created_at).toDateString() + " "+ new Date(values?.created_at).toLocaleTimeString()}
          </p>

          {finalData ? (
            <div className='referral_detail-table'>
              <div >
                <DataTable
                  customStyles={referralsStyles}
                  data={finalData}
                  columns={modalColumns}
                  pagination
                />
              </div>
            </div>
          ) : null}
        </section>

        <button
          className='btn__close'
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
};

export default ShowModal;
