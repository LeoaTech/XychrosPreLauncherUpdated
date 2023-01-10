import "./ReferralsBlock.css";
import * as React from "react";
import { referralRows, referralColumns } from "./dummyData";
import { BiShow } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ShowModal, DeleteModal } from "../modal/index";
import DataTable from "react-data-table-component";
import {customStyles} from "./customStyles"

/* const customStyles = {
  headCells: {
    style: {
      fontSize: "20px",
      fontWeight: "bold",
      paddingLeft: "0 8px",
      justifyContent: "center",
      color: "#FCFCFC",
      backgroundColor: "#232227",
    },
  },
  cells: {
    style: {
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      borderRight: "1px solid #fff",
      borderBottom: "1px solid #fff",
    },
  },
  rows: {
    style: {
      backgroundColor: "#232229",
      color: "#ECECEC",
      textAlign: "center",
    },
    highlightOnHoverStyle: {
      color: "#f3f3f3",
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
      color: "white",
      fontSize: "13px",
      minHeight: "56px",
      backgroundColor: "#232229",
      border: "1px solid #fff",
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
      color: "#fcfcfc",
      fill: "f3f3f3",
      backgroundColor: "transparent",
      "&:disabled": {
        cursor: "unset",
        color: "#fff",
        fill: "#fff",
      },
      "&:hover:not(:disabled)": {
        backgroundColor: "#fcfcfc",
      },
      "&:focus": {
        outline: "none",
        backgroundColor: "#fff",
      },
    },
  },
}; */

const ReferralsBlock = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [modalData, setModalData] = React.useState();
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [data, setData] = React.useState(referralRows);

  // Delete Action Function for Delete a row from the table
  const handleDelete = (id) => {
    let delVal = data.filter((item) => item.id !== id);
    setData(delVal);
    console.log(delVal);
  };

  // Actions column on table to view and delete data
  const actionColumns = [
    {
      name: "Details",
      selector: "details",
      id: "details",
      cell: (row) => {
        return (
          <div className="cellAction">
            <div
              className="actionbtn"
              onClick={(e) => {
                setOpenModal(true);
                setModalData(row);
                document.body.style.overflow = "hidden";
              }}
            >
              <BiShow />
            </div>
            <div className="deletebtn">
              <RiDeleteBin6Line
                onClick={(e) => {
                  setDeleteModal(true);
                  setModalData(row.id);
                }}
              />
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className="datatable">
        <DataTable
          customStyles={customStyles}
          columns={referralColumns.concat(actionColumns)}
          data={data}
          pagination
          highlightOnHover
        />
      </div>

      <div style={{ borderRadius: "15px" }}>
        <ShowModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          values={modalData}
        />
      </div>

      <div>
        <DeleteModal
          values={modalData}
          openModal={deleteModal}
          setDeleteModal={setDeleteModal}
          handleDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default ReferralsBlock;
