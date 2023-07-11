import React from "react";
import "./LoadingSkeleton.css"; // Create a CSS file for styling

const LoadingSkeleton = () => {
  return (
    <div className="loading-skeleton">
      <div className="loading-skeleton__first_row animate-pulse">
        <div className="loading-skeleton__row animate-pulse"></div>
        <div className="loading-skeleton__row animate-pulse"></div>
      </div>
      <div className="loading-skeleton__first_row">
        <div className="loading-skeleton__row animate-pulse"></div>
      </div>
      <div>
        <div className="loading-skeleton__last_row animate-pulse"></div>
        <div className="loading-skeleton__last_row animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
