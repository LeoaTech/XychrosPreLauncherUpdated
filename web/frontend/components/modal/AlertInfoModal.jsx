import "../modal/Alert.css";

const AlertInfoModal = ({ openModal, setAlertModal, expiryDate }) => {
  const handleClose = () => {
    setAlertModal((prev) => !prev);
  };

  return openModal ? (
    <div className="modal">
      <div className="delete-modal-container">
        <nav className="modal__nav">
          <h6>Alert </h6>
        </nav>
        <section className="modal__body">
          <p>{`Campaign is Currently Active or End at ${expiryDate}, You Can't delete it!`}</p>

          <div className="action__btn_modal">
            <button className="cancel__btn" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </section>
      </div>
    </div>
  ) : null;
};

export default AlertInfoModal;
