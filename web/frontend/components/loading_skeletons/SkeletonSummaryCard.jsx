import "./LoadingSkeleton.css";
import React from "react";

const SkeletonSummaryCard = () => {
  return (
    <div className="loading_skeleton__summary-card">
      <div className="loading-skeleton__values">
        <div className="loading-skeleton__title"></div>
      </div>

      <div>
        <div className="loading-skeleton__img"></div>
      </div>
    </div>
  );
};

export default SkeletonSummaryCard;
