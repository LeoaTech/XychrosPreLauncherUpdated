import "../modal/modal.css";
import DataTable from "react-data-table-component";
import { modalColumns, referralRows } from "../referrals/dummyData";
import { MdOfflineBolt } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";

// Data Table custom styles
const referralsStyles = {
  headCells: {
    style: {
      fontSize: "15px",
      fontWeight: "bold",
      paddingLeft: "0 8px",
      justifyContent: "center",
      color: "#232227",
      backgroundColor: "#FCFCFC",

      border: "1px solid gray",
      borderBottom: "none",
      borderTop: "none",
    },
  },
  cells: {
    style: {
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      border: " 1px solid gray",
    },
  },
  rows: {
    style: {
      backgroundColor: "#ECECEC",
      color: "#232229",
      textAlign: "center",
    },
    highlightOnHoverStyle: {
      color: "#fcfcfc",
      backgroundColor: "gray",
      transitionDuration: "0.15s",
      transitionProperty: "background-color",
      borderBottomColor: "white",
      outlineStyle: "solid",
      outlineWidth: "1px",
      outlineColor: "lightgray",
    },
  },
  pagination: {
    style: {
      color: "#232229",
      fontSize: "13px",
      minHeight: "50px",
      backgroundColor: "fcfcfc",
      border: "1px solid #ccc",
      borderTop: "none",
    },
    pageButtonsStyle: {
      borderRadius: "50%",
      height: "40px",
      width: "40px",
      padding: "8px",
      margin: "px",
      cursor: "pointer",
      transition: "0.4s",
      color: "#ccc",
      fill: "black",
      backgroundColor: "transparent",
      "&:disabled": {
        cursor: "unset",
        color: "#333",
        fill: "#333",
      },
      "&:hover:not(:disabled)": {
        backgroundColor: "#000",
      },
      "&:focus": {
        outline: "none",
        backgroundColor: "#ccc",
        color: "black",
      },
    },
  },
};

const ShowModal = ({
  openModal,
  setOpenModal,
  values,
  fulldata,
  campaignName,
}) => {
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
    <div className="modal">
      <div className="modal_container">
        <nav className="modal__nav">
          <h6>Referral Details</h6>
          <p className="referral__id">
            Campaign:{" "}
            {campaignName?.includes(values?.campaign_name) ? (
              <>
                {" "}
                <MdOfflineBolt
                  data-tooltip-id="deactivate-campaigns-tooltip"
                  style={{
                    fill: "crimson",
                    height: 18,
                    width: 18,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                />
                {values?.campaign_name}
              </>
            ) : (
              values?.campaign_name
            )}
          </p>
        </nav>
        <section
          className="modal__body"
          data-tooltip-id="deactivate-campaigns-tooltip"
        >
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
            <strong>Date of Joining:</strong>{" "}
            {new Date(values?.created_at).toDateString() +
              " " +
              new Date(values?.created_at).toLocaleTimeString()}
          </p>

          {finalData ? (
            <div className="referral_detail-table">
              <div>
                <DataTable
                  customStyles={referralsStyles}
                  data={finalData}
                  columns={modalColumns}
                  pagination
                  highlightOnHover
                  pointerOnHover
                />
              </div>
            </div>
          ) : null}
        </section>

        <button className="btn__close" onClick={handleClose}>
          Close
        </button>
      </div>
      <ReactTooltip
        id="deactivate-campaigns-tooltip"
        place="top-left"
        variant="info"
        offset={20}
        content="This campaign is now inactive"
      />
    </div>
  ) : null;
};

export default ShowModal;
