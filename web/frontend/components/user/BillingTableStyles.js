// Billing Details Table Custom Styles
export const billingStyles = {
  headCells: {
    style: {
      fontSize: "15px",
      fontWeight: "semi-bold",
      paddingLeft: "0 6px",
      justifyContent: "center",
      color: "#FCFCFC",
      backgroundColor: "#232227",
      // width: "20px"
    },
  },
  cells: {
    style: {
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      borderLeft: "1px solid #fff",
      borderRight: "1px solid #fcfcfc",
      borderBottom: "1px solid #fff",
    },
  },
  rows: {
    style: {
      backgroundColor: "#232229",
      color: "#ECECEC",
      textAlign: "center",
    },
    highlightOnHoverStyle: {
      color: "#f3f3f3",
      backgroundColor: "gray",
      transitionDuration: "0.15s",
      transitionProperty: "background-color",
      borderBottomColor: "white",
      outlineStyle: "solid",
      outlineWidth: "1px",
      outlineColor: "lightgray",
    },
  },
  pagination: {
    style: {
      color: "white",
      fontSize: "13px",
      minHeight: "56px",
      backgroundColor: "#232229",
      border: "1px solid #fff",
      borderTop: "none",
    },
    pageButtonsStyle: {
      borderRadius: "50%",
      height: "20px",
      width: "30px",
      padding: "4px",
      margin: "px",
      cursor: "pointer",
      transition: "0.4s",
      color: "#fcfcfc",
      fill: "f3f3f3",
      backgroundColor: "transparent",
      "&:disabled": {
        cursor: "unset",
        color: "#fff",
        fill: "#fff",
      },
      "&:hover:not(:disabled)": {
        backgroundColor: "#fcfcfc",
      },
      "&:focus": {
        outline: "none",
        backgroundColor: "#fff",
      },
    },
  },
};
