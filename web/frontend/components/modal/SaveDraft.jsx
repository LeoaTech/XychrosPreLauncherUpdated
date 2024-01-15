import React from "react";
import "./draftModal.css";
import { GrStatusWarning } from "react-icons/gr";
import { RiErrorWarningFill } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";

const SaveDraft = ({
  openModal,
  onClose,
  confirmNavigation,
  handleSaveDraft,
}) => {
  return openModal ? (
    <div className="modal">
      <div className="draft-modal-container">
        <nav className="modal-nav">
          <h6>Unsaved Changes </h6>
          <span>
            <AiOutlineClose
              onClick={onClose}
              style={{
                backgroundColor: "black",
                color: "red",
                height: 30,
                width: 24,
              }}
            />
          </span>
        </nav>
        <section className="modal-body">
          <div className="modal-content">
            <p>
              <GrStatusWarning className="warning-sign" />
            </p>
            <p>
              {`You've unsaved changes? Do you want to Save your changes before leaving the Page?`}
            </p>
          </div>

          <div className="action__btn-modal">
            <button className="confirm-btn" onClick={confirmNavigation}>
              Discard
            </button>
            <button
              className="discard-btn"
              onClick={() => {
                handleSaveDraft();
              }}
            >
              Save to Draft
            </button>
          </div>
        </section>
      </div>
    </div>
  ) : null;
};

export default SaveDraft;
