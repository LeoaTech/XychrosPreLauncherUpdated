import React from "react";
import { Link } from "react-router-dom";
import { ImAttachment } from "react-icons/im";
import "./support.css";
const SupportComponent = () => {
  return (
    <div className="support-container">
      <div className="top-description">
        <p>
          Visit our <Link to="/help">Help Centre</Link> for troubleshooting and
          how-to articles.{" "}
        </p>
        <p>
          For an urgent inquiry fill out the form below or{" "}
          <Link to="/chat">chat with our team</Link>.
        </p>
      </div>

      <div className="support-form">
        <div className="section-form">
          <h2>Support Form</h2>
          <form>
            <div className="file-links">
              <div className="link-input">
                <label htmlFor=""> Store URL</label>
                <input type="text" />
              </div>

              <div className="attach-links">
                <label>Attach image(s) or video(s) link</label>

                <ImAttachment style={{cursor:"pointer", height: "30px", width: "25px" }} />
              </div>
            </div>

            <div className="text-issue">
              <label htmlFor="">Issue</label>
              <textarea
                className="issue-textarea"
                rows={9}
                // value={defaultEmail}
                // onChange={setDefaultEmail}
              />
            </div>

            <div className="submit-btn">Submit</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportComponent;
