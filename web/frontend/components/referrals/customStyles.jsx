
export const customStyles = {
  headCells: {
    style: {
      fontSize: "15px",
      fontWeight: "semi-bold",
      paddingLeft: "0 6px",
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
      color: "#FCFCFC",
      backgroundColor: "#232227",
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
      paddingLeft: "0 4px",
    },
  },
  rows: {
    style: {
      backgroundColor: "#232229",
      color: "#ECECEC",
      textAlign: "center",
      border: "none",
    },
    highlightOnHoverStyle: {
      color: "#ccc",
      backgroundColor: "#3D3938",
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
      height: "40px",
      width: "40px",
      padding: "8px",
      margin: "3px",
      cursor: "pointer",
      transition: "0.4s",
      // color: "#fcfcfc",
      // fill: "f3f3f3",
      color: "blue",
      fill: "#fff",
      backgroundColor: "transparent",
      "&:disabled": {
        cursor: "unset",
        color: "#fcfcfc",
        fill: "gray",
      },
      "&:hover:not(:disabled)": {
        backgroundColor: "#fcfcfc",
        color: "#333",
        fill: "#333",
      },
      "&:focus": {
        outline: "none",
        backgroundColor: "#fff",
        color: "#fff",
      },
    },
  },
};
