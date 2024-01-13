import React from "react";

const EmailNextButton = ({ handleNext, handlePrevious,prevIndex, nextIndex}) => {
  return (
    <div className="toggle-next-btn">
    <>
      <button
        className="prev-Btn"
        onClick={() => handlePrevious(prevIndex)}
      >
        Previous
      </button>
      <button className="next-button" onClick={() => handleNext(nextIndex)}>
        Next
      </button>
    </>
  </div>
  );
};

export default EmailNextButton;
