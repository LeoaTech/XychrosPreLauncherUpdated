import Skeleton from "./Skeleton";
import React from "react";

const SkeletonShortSummaryCard = () => {
  return (
    <div className="short-summary-card">
      <Skeleton classes="values width-100" />
      <Skeleton classes="img width-100" />
    </div>
  );
};

export default SkeletonShortSummaryCard;
