export const customStyles = {
    headCells: {
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        paddingLeft: "0 8px",
        justifyContent: "center",
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
        borderRight: "1px solid #fff",
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
        height: "40px",
        width: "40px",
        padding: "8px",
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