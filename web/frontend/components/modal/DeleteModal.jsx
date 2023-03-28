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
            <button
              className="delete__btn"
              onClick={() => {
                handleDelete(values);
                setDeleteModal(false);
              }}
            >
              OK
            </button>
            <button className="close__btn" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </section>
      </div>
    </div>
  ) : null;
};

export default DeleteModal;
