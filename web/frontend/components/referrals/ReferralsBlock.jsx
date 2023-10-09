import "./ReferralsBlock.css";
import * as React from "react";
import { referralRows, referralColumns } from "./dummyData";
import { BiShow } from "react-icons/bi";

import { IoDiamondOutline } from "react-icons/io5";
import { ShowModal, DeleteModal } from "../modal/index";
import DataTable from "react-data-table-component";
import { customStyles } from "./customStyles";
import { useDispatch, useSelector } from "react-redux";
import { fetchReferralById } from "../../app/features/referrals/referralSlice";
import { fetchDeactivatedCampaignsByName } from "../../app/features/campaign_details/campaign_details";
import { fetchCurrentTier } from "../../app/features/current_plan/current_plan";
import { useNavigate } from "react-router-dom";

const ReferralsBlock = (props) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [modalData, setModalData] = React.useState();
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [campaignName, setCampaignName] = React.useState([]);
  const [TableData, setTableData] = React.useState([]);
  const currentPlan = useSelector(fetchCurrentTier);
  const navigate = useNavigate();

  let getDeactivatedCampaignsName = useSelector(
    fetchDeactivatedCampaignsByName
  );

  React.useEffect(() => {
    if (getDeactivatedCampaignsName.length > 0) {
      setCampaignName(getDeactivatedCampaignsName);
    }
  }, [getDeactivatedCampaignsName]);

  // Chnage the Color of Rows in Table with deactivated Campaigns ID's/Names
  const conditionalRowStyles = [
    {
      when: (row) => campaignName?.includes(row?.campaign_name),
      style: {
        color: "gray",
        "&:hover": {
          cursor: "pointer",
          color: "black",
        },
      },
    },
  ];

  const customRowStyles = (row) => {
    if (!campaignName?.includes(row?.campaign_name)) {
      return {
        style: {
          backgroundColor: "blue",
          color: "#red",
          fill: "red",
          textAlign: "center",
          cursor: "not-allowed",
        },
      };
    } else {
      return {}; // Return an empty object for active campaign rows
    }
  };

  // Define the number of rows accessible for each plan
  const planRowLimits = {
    Free: 5,
    "Tier 1": 8,
    "Tier 2": 10,
    "Tier 3": 12,
    "Tier 4": 15,
    "Tier 5": 17,
    "Tier 6": 19,
    "Tier 7": 22,
    "Tier 8": 24,
  };

  // Determine the number of visible rows based on the Current users plan
  const visibleRows = props?.tableData?.slice(0, planRowLimits[currentPlan]);

  // Delete Action Function for Delete a row from the table
  /* const handleDelete = (id) => {
    let delVal = data.filter((item) => item.id !== id);
    setData(delVal);
  };
 */
  React.useEffect(() => {
    if (openModal || deleteModal) {
      document.body.style.opacity = "0.5 !important";
    } else {
      document.body.style.opacity = "1 !important";
    }
  }, [openModal, deleteModal]);

  React.useEffect(() => {
    if (deleteModal) {
      window.addEventListener("click", () => {
        setDeleteModal(false);
      });
    }
  }, [deleteModal]);

  React.useEffect(() => {
    if (openModal) {
      setDeleteModal(false);
    } else if (DeleteModal) {
      setOpenModal(false);
    }
  });
  // Actions column on table to view and delete data
  const actionColumns = [
    {
      name: "Details",
      id: "details",
      style: {
        textAlign: "center",
        alignItems: "center",
        fontSize: 17,
        maxWidth: "12px",
      },
      cell: (row) => {
        return (
          <div className="cellAction">
            <div
              className="actionbtn"
              onClick={(e) => {
                setOpenModal(true);
                setModalData(row);
                // document.body.style.overflow = "hidden";
              }}
            >
              <BiShow />
            </div>
            {/* <div className='deletebtn'>
              <RiDeleteBin6Line
                onClick={(e) => {
                  setDeleteModal(true);
                  setModalData(row.id);
                }}
              />
            </div> */}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <h1 className="upgrade-message">
        To View All {props?.tableData?.length} Referrals Details Data Upgrade
        your Plan{" "}
        <button onClick={() => navigate("/price")} className="upgrade-plan">
          Upgrade Plan <IoDiamondOutline style={{ height: 16 }} />
        </button>
      </h1>

      {props?.tableData?.length > 0 ? (
        <div className="datatable">
          <DataTable
            columns={referralColumns.concat(actionColumns)}
            // data={props.tableData}
            data={visibleRows}
            pagination
            paginationPerPage={planRowLimits[currentPlan]}
            paginationRowsPerPageOptions={[planRowLimits[currentPlan]]}
            pointerOnHover
            highlightOnHover
            customStyles={customStyles}
            conditionalRowStyles={conditionalRowStyles}
            customRowStyles={customRowStyles} // Apply the customRowStyles
          />
        </div>
      ) : null}
      <div style={{ borderRadius: "15px" }}>
        <ShowModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          values={modalData}
          fulldata={props?.tableData}
          campaignName={campaignName}
        />
      </div>

      {/* <div>
        <DeleteModal
          values={modalData}
          openModal={deleteModal}
          setDeleteModal={setDeleteModal}
          handleDelete={handleDelete}
        />
      </div> */}
    </>
  );
};

export default ReferralsBlock;
