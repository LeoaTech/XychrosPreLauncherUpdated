import { useThemeContext } from "../../contexts/ThemeContext";
import "./Skeleton.css";

import React from "react";

const Skeleton = ({ classes }) => {
  const { theme } = useThemeContext();
  const classNames =
    theme === "dark"
      ? `skeleton ${classes} animate-pulse`
      : `skeleton-light ${classes} animate-pulse`;
  return <div className={classNames}></div>;
};

export default Skeleton;
