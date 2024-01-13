import React from "react";

const IntegrationNextButton = ({ handlePrevious,
  prevIndex}) => {
  return (
    <div className="toggle-next-btn">
    <>
      <button
        className="prev-Btn"
        onClick={() => handlePrevious(prevIndex)}
      >
        Previous
      </button>
      <div></div>
      {/* <button className="next-button" onClick={() => handleNext(2)}>
        Next
      </button> */}
    </>
  </div>
  );
};

export default IntegrationNextButton;
