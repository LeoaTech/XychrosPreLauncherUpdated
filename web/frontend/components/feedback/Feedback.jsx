import React, { useEffect, useState } from "react";
import "./feedback.css";
import StarRating from "./starRating/StarRating";
const FeedbackComponent = () => {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const handleSubmit = () => {
    // Perform any additional processing or API calls here, if needed
    // This function will be triggered when the form is submitted

    // Update the state to indicate that the form has been submitted
    setSubmitted(true)
  };


  useEffect(() => {
    // Simulating the form loading process
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // Replace this with the actual form loading logic
  }, []);
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
          {/* <form>
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
          </form> */}
          {isLoading ? <div class="spinner"></div> : <iframe className="feedback-google-form"
            src="https://docs.google.com/forms/d/e/1FAIpQLSfN0AGTHf3fczml4OeKvl3RbwC1_rezaa9lH-8krf3MD9Czvw/viewform?embedded=true"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
          >Loading....</iframe>}
        </div>
      </div>
    </div>
  );
};

export default FeedbackComponent;
