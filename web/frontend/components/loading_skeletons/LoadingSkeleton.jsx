import React from "react";
import "./LoadingSkeleton.css"; // Create a CSS file for styling
import { useThemeContext } from "../../contexts/ThemeContext";

const LoadingSkeleton = () => {
  const {theme} = useThemeContext();
  return (
    <div className={theme ==="dark"?"loading-skeleton":"loading-skeleton-light"}>
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
