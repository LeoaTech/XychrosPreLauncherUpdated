import "../modal/draftModal.css";

const SaveDraft = ({
  openModal,
  // onClose,
  // onSave,
  // onDiscard,
  cancelNavigation,
  confirmNavigation,
}) => {
  return openModal ? (
    <div className="modal">
      <div className="draft-modal-container">
        <nav className="modal__nav">
          <h6>Save Changes </h6>
        </nav>
        <section className="modal__body">
          <p>{`Do You want to Save Changes to Your Draft? You can Edit them from Campaigns List`}</p>

          <div className="action__btn-modal">
            <button className="confirm-btn" onClick={confirmNavigation}>
              Discard
            </button>
            <button className="discard-btn" onClick={cancelNavigation}>
             Save to Draft
            </button>
          </div>
        </section>
      </div>
    </div>
  ) : null;
};

export default SaveDraft;
