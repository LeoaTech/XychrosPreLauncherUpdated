import { useThemeContext } from "../../contexts/ThemeContext";
import Skeleton from "./Skeleton";
import React from "react";
import "../ui/ShortSummaryCard.css"

const SkeletonShortSummaryCard = () => {
  const {theme} =useThemeContext()
  return (
    <div className={theme ==="dark"?"short-summary-card":"short-summary-card-light"}>
      <Skeleton classes="values width-50" />
      <Skeleton classes="img width-100" />
    </div>
  );
};

export default SkeletonShortSummaryCard;
