import { useThemeContext } from "../../contexts/ThemeContext";
import "./LoadingSkeleton.css";
import React from "react";

const SkeletonSummaryCard = () => {
  const {theme} = useThemeContext();
  return (
    <div className={theme ==="dark"?"loading_skeleton__summary-card":"loading_skeleton__summary-card-light"}>
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
