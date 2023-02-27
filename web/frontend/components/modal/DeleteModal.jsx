import "../modal/delete.css";

const DeleteModal = ({ openModal, setDeleteModal, values, handleDelete }) => {
  const handleClose = () => {
    setDeleteModal((prev) => !prev);
  };
  return openModal ? (
    <div className="modal">
      <div className="delete-modal-container">
        <nav className="modal__nav">
          <h6>Alert </h6>
        </nav>
        <section className="modal__body">
          <p>{`Are you Sure you want to delete ID ${values}? `}</p>

          <div className="action__btn-modal">
            <span
              className="delete__btn"
              onClick={() => {
                handleDelete(values);
                setDeleteModal(false);
              }}
            >
              OK
            </span>
            <span className="close__btn" onClick={handleClose}>
              Cancel
            </span>
          </div>
        </section>
      </div>
    </div>
  ) : null;
};

export default DeleteModal;
