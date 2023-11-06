import React, { useEffect, useState } from "react";
import BillingCard from "./BillingCard";
import "./user.css";
import { useAuthenticatedFetch } from "../../hooks";
import { fetchUserDetails, SaveUser } from "../../app/features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentPlan } from "../../app/features/current_plan/current_plan";
import { fetchAllpricing } from "../../app/features/pricing/pricing";
import DataTable from "react-data-table-component";
import { useThemeContext } from "../../contexts/ThemeContext";
// Billing Details Table Custom Styles
const billingStyles = {
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


const billingStylesLight={
  headCells: {
    style: {
      fontSize: "15px",
      fontWeight: "semi-bold",
      paddingLeft: "0 6px",
      justifyContent: "center",
      color: "#030303",
      backgroundColor: "#f3f5f6",
      border: "1px solid black",
    boxShadow: "0 2px 5px rgb(0 0 0 / 0.15)"

      // width: "20px"
    },
  },
  cells: {
    style: {
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      borderLeft: "1px solid #000",
      borderRight: "1px solid #000",
      borderBottom: "1px solid #000",
    },
  },
  rows: {
    style: {
      backgroundColor: "#f5f5f5",
      color: "#000",
      textAlign: "center",
    },
    highlightOnHoverStyle: {
      color: "#000",
      backgroundColor: "#cad2d5",
      transitionDuration: "0.15s",
      transitionProperty: "background-color",
      borderBottomColor: "black",
      outlineStyle: "solid",
      outlineWidth: "1px",
      outlineColor: "lightgray",
    },
  },
  pagination: {
    style: {
      color: "#000",
      fontSize: "13px",
      minHeight: "56px",
      backgroundColor: "#f5f5f5",
      border: "1px solid #000",
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
      color: "#333",
      fill: "f3f3f3",
      backgroundColor: "transparent",
      "&:disabled": {
        cursor: "unset",
        color: "#000",
        fill: "#000",
      },
      "&:hover:not(:disabled)": {
        backgroundColor: "#gray",
      },
      "&:focus": {
        outline: "none",
        backgroundColor: "#000",
      },
    },
  },
}
const UserProfile = () => {
  const data = useSelector(fetchUserDetails);
  const priceData = useSelector(fetchAllpricing);
  const billingPlan = useSelector(fetchCurrentPlan);
  const { theme } = useThemeContext();
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const [userDetails, setUserDetails] = useState();
  const [subscribedCardId, setSubscribedCardId] = useState(null);
  const [priceCard, setPriceCard] = useState([]);
  const [tableData, setTableData] = useState([]);

  // Billing Table Columns
  const billingColumns = [
    {
      name: "Name",
      selector: (row) => row.plan_name,
      sortable: true,
      id: "charge_name",
      style: {
        fontSize: 17,
      },
    },
    {
      name: "Amount",
      selector: (row) => row.price,
      sortable: true,
      id: "charge_amount",

      style: {
        fontSize: 17,
      },
    },
    {
      name: "Charged Date",
      selector: (row) => row.created_at,
      sortable: true,
      id: "charged_date",
      style: {
        fontSize: 15,
      },
    },
  ];

  // Get user Details From DB(if any) and Set Values in States
  useEffect(() => {
    if (data) {
      let name = data?.name?.split(" ");
      if (name?.length > 0) {
        setUserDetails({
          billing_id: 1,
          firstname: name[0],
          lastname: name[1],
          store_url: data?.store_url,
          email: data?.email,
        });
      }
    } else {
      return;
    }
  }, [data, subscribedCardId]);

  // Get Current Plan and Set Billing Details in TableData
  useEffect(() => {
    let cardId;
    if (billingPlan !== undefined) {
      if (billingPlan?.plan_name?.includes("Add-on")) {
        const charged_name = billingPlan?.plan_name?.split(" + ");
        const tierName = charged_name[0]; // Extract "Tier Name"
        cardId = priceData?.find((plan) => plan?.plan_name === tierName);
      } else {
        cardId = priceData?.find(
          (plan) => plan?.plan_name === billingPlan?.plan_name
        );
      }
      setPriceCard([{ ...cardId }]);
      setSubscribedCardId(cardId?.id);
      setUserDetails({ ...userDetails, billing_id: subscribedCardId });
      setSubscribeMessage(
        `Subscribed to ${
          billingPlan?.plan_name
        } price card. Billed and reset every month on the ${new Date(
          billingPlan?.created_at
        ).getDate()} at ${new Date(
          billingPlan?.created_at
        ).getHours()}:${new Date(
          billingPlan?.created_at
        ).getMinutes()}:${new Date(billingPlan?.created_at).getSeconds()}`
      );
    }
  }, [billingPlan, priceData]);

  useEffect(() => {
    if (billingPlan) {
      let currentPlan = {
        ...billingPlan,
        plan_name: billingPlan?.plan_name,
        created_at:
          new Date(billingPlan?.created_at).toDateString() +
          " " +
          new Date(billingPlan?.created_at).toLocaleTimeString(),
      };
      setTableData([currentPlan]);
    }
  }, [billingPlan]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="user-container">
      <div
        className={
          theme === "dark" ? "account-section" : "account-section-light"
        }
      >
        <div className="account-title">
          <h2>Account Details</h2>
        </div>

        {/* Contact Details Form */}
        <div
          className={
            theme === "dark" ? "contact-details" : "contact-details-light"
          }
        >
          <h3>Contact Details </h3>

          <div className="form-section">
            <div className="form-input-group">
              <div className="inputfield">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  placeholder="e.g Joseph"
                  value={userDetails?.firstname}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className="inputfield">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  placeholder="e.g Henry"
                  value={userDetails?.lastname}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>
            <div className="form-input-group">
              <div className="inputfield">
                <label htmlFor="email">Contact Email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="joseph@gmail.com"
                  value={userDetails?.email}
                  onChange={handleChange}
                  disabled
                />
              </div>

              <div className="inputfield">
                <label htmlFor="storelink">Store URL</label>
                <input
                  type="text"
                  name="storelink"
                  id="storelink"
                  value={userDetails?.store_url}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Billing Details with All Pricing Cards */}
        <div
          className={
            theme === "dark" ? "billing-details" : "billing-details-light"
          }
        >
          <h3>Billing Details</h3>
          <p>{subscribeMessage}</p>

          {priceCard?.length > 0 ? (
            <div className="carousel">
              <div className="billing-cards" style={{}}>
                {priceCard?.length > 0 ? (
                  priceCard?.map((card, index) => {
                    return (
                      <div key={index} style={{}} className={theme === "dark"?"billing-card":"billing-card-light"}>
                        <BillingCard
                          className="card"
                          key={card.id}
                          card={card}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div class="spinner"></div>
                )}
              </div>
              <div className="billing_table">
                <DataTable
                  columns={billingColumns}
                  data={tableData}
                  customStyles={theme === "dark"?billingStyles: billingStylesLight}
                  pagination
                  highlightOnHover
                />
              </div>
            </div>
          ) : (
            <div className="spinner"></div>
          )}

          {/* <div className="billing-details-block">
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
