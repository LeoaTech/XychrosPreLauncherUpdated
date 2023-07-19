import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImAttachment } from "react-icons/im";
import "./support.css";
const SupportComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [supportForm, setSupportForm] = useState({
    store_url: "",
    issue_msg: "",
    file: ""
  })

  const handleChange = () => {

  }
  useEffect(() => {
    // Simulating the form loading process
    setTimeout(() => {
      setIsLoading(false);
    }, 400); // Replace this with the actual form loading logic
  }, []);


  const handleSubmit = () => {

  }
  return (
    <div className="support-container">
      <div className="top-description">
        <p>
          {/* Visit our <Link to="/help">Help Centre</Link> for troubleshooting and
          how-to articles.{" "} */}
        </p>
        <p>
          For an urgent inquiry fill out the form below
          {/* or
          {" "}<Link to="/chat">chat with our team</Link>. */}
        </p>
      </div>

      <div className="support-form">
        <div className="section-form">
          <h2>Support Form</h2>


          {isLoading ? <div className="spinner"></div> : <iframe className="support-google-form"
            src="https://docs.google.com/forms/d/e/1FAIpQLSfRkYidDN7u-hrv12dl_p5Qh_pyqLpU3J9geH9ggwIYku6Olw/viewform?embedded=true"
            width="640"
            height="670"
            frameborder="0"
            // marginheight="0"
            // marginwidth="0"

          >Loading…</iframe>
          }

          {/* <div className="file-links">
            <div className="link-input">
              <label htmlFor=""> Store URL</label>
              <input type="text" />
            </div>

            <div className="attach-links">
              <label>Attach image(s) or video(s) link</label>

              <ImAttachment style={{ cursor: "pointer", height: "30px", width: "25px" }} />
            </div>
          </div>

          <div className="text-issue">
            <label htmlFor="">Issue</label>
            <textarea
              className="issue-textfield"
              rows={9}

            />
          </div>

          <div className="submit-btn" onClick={handleSubmit}>Submit</div>
          */}

        </div>
      </div>
    </div>
  );
};

export default SupportComponent;



/* {isLoading ? <div className="spinner"></div> : <iframe className="support-google-form"
            src="https://docs.google.com/forms/d/e/1FAIpQLSfRkYidDN7u-hrv12dl_p5Qh_pyqLpU3J9geH9ggwIYku6Olw/viewform?embedded=true"
            width="640"
            height="670"
            frameborder="0"
            marginheight="0"
            marginwidth="0"

          >Loading…</iframe>
          } */