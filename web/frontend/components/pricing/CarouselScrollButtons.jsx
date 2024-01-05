import React from "react";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";

const CarouselScrollButtons = ({handleClickPrev, handleClickNext}) => {
  return (
    <div className="action-click-btn">
      <button className="clickPrev" onClick={handleClickPrev}>
        <AiOutlineArrowLeft style={{ height: 19, width: 19 }} />
      </button>
      <button className="clickNext" onClick={handleClickNext}>
        <AiOutlineArrowRight style={{ height: 19, width: 19 }} />
      </button>
    </div>
  );
};

export default CarouselScrollButtons;
