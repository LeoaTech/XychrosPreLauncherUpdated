import React from "react";

const NextButton = ({ renderButton ,index}) => {
  return (
    <div className="toggle-next-btn">
      <div></div>
      {renderButton(index)}
    </div>
  );
};

export default NextButton;
