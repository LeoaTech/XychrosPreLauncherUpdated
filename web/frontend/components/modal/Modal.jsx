import "../modal/modal.css";
import { AiOutlineClose } from "react-icons/ai";
import DataTable from "react-data-table-component";
import { modalColumns, referralRows } from "../referrals/dummyData";

const customStyles = {
  headCells: {
    style: {
      fontSize: "17px",
      fontWeight: "bold",
      paddingLeft: "0 5px",
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
};

const ShowModal = ({ openModal, setOpenModal, values }) => {
  const handleClose = () => {
    // console.log("Clicked", openModal);
    setOpenModal((prev) => !prev);
    document.body.style.overflow = "unset";
  };

  let newData = [{ ...values, date: "2022/12/12" }];
  // console.log(newData);
  return openModal ? (
    <div>
      <div className="modal_container">
        <nav className="modal__nav">
          <h6>Referral Details</h6>
          <p className="referral__id">ID: {values?.id}</p>
        </nav>
        <section className="modal__body">
          <p>
            <strong>Email:</strong> {values?.referral_email}
          </p>
          <p>
            <strong>Referral Link:</strong> {values?.referral_code}
          </p>
          <p>
            <strong>Friends Joined:</strong> {values?.friends_joined}
          </p>

          <div className="referral_detail-table">
            <div style={{ maxHeight: "200px" }}>
              <DataTable
                customStyles={customStyles}
                data={newData}
                columns={modalColumns}
              />
            </div>
          </div>
        </section>

        <button className="btn__close" onClick={handleClose}>
          CLOSE
        </button>
      </div>
    </div>
  ) : null;
};

export default ShowModal;
