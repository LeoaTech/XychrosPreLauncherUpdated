import "./ReferralsBlock.css";
import * as React from "react";
import { referralRows, referralColumns } from "./dummyData";
import { BiShow } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ShowModal, DeleteModal } from "../modal/index";
import DataTable from "react-data-table-component";
import {customStyles} from "./customStyles"

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

  React.useEffect(() =>{
    if(openModal || deleteModal){
      document.body.style.opacity="0.5 !important"; 
    }
    else{
      document.body.style.opacity="1 !important"; 

    }
  },[openModal, deleteModal])

  React.useEffect(() =>{
    if(deleteModal){
      window.addEventListener("click", () =>{
        setDeleteModal(false);
      })
    }
  },[deleteModal])


  React.useEffect(() =>{
    if(openModal){
      setDeleteModal(false);
    }
    else if(DeleteModal){
      setOpenModal(false)
    }
  })

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
                // document.body.style.overflow = "hidden";
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
