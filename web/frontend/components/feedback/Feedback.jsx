import React,{useState} from "react";
import "./feedback.css";
import StarRating from "./starRating/StarRating";
const FeedbackComponent = () => {
  const [feedback, setFeedback] = useState("");
  return (
    <div className="feedback-container">
      <div className="feedback-desc">
        <p>
          We are constantly improving our app and would love to get your
          feedback!{" "}
        </p>
      </div>
      <div className="feedback-form">
        <div className="feedback-section-form">
          <h2>Feedback Form</h2>
          <form>
            <div className="rating-content">
              <div className="link__input">
                <label htmlFor=""> Store URL</label>
                <input type="text" />
              </div>

              <>
                <StarRating />
              </>
            </div>

            <div className="text-feedback">
              <label htmlFor="">Feedback</label>
              <textarea
                className="feedback-textarea"
                rows={9}
                value={feedback}
                onChange={(e)=>setFeedback(e.target.value)}
              />
            </div>

            <div className="submit-btn">Submit</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackComponent;
