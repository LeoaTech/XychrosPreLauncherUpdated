import React, { useEffect, useState } from "react";
import BillingCard from "./BillingCard";
import "./user.css";
import { BsCheck2 } from "react-icons/bs";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai'
import { useAuthenticatedFetch } from "../../hooks";
import { fetchUserDetails, SaveUser } from "../../app/features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentPlan } from "../../app/features/current_plan/current_plan";
import { fetchAllpricing } from "../../app/features/pricing/pricing";
import DataTable from "react-data-table-component";

// Billing Details Table Custom Styles
const billingStyles = {
  headCells: {
    style: {
      fontSize: "15px",
      fontWeight: "semi-bold",
      paddingLeft: "0 4px",
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
      // textAlign: "center",
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
}
const UserProfile = () => {
  const data = useSelector(fetchUserDetails);
  const priceData = useSelector(fetchAllpricing);
  const billingPlan = useSelector(fetchCurrentPlan);
  const dispatch = useDispatch();

  console.log("Price card Data", priceData);
  console.log("bill", billingPlan)

  const [subscribeMessage, setSubscribeMessage] = useState("")
  const fetch = useAuthenticatedFetch();
  // Initial User Form Data
  const formData = {
    firstname: "",
    lastname: "",
    email: "",
    store_url: window.location?.ancestorOrigins[0] || "",
    billing_id: null,
  };

  const [userDetails, setUserDetails] = useState(formData);
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscribedCardId, setSubscribedCardId] = useState(null)
  const [priceCard, setPriceCard] = useState([])
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsloading] = useState(false)

  // Billing Table Columns
  const billingColumns = [
    {
      name: 'Name',
      selector: (row) => row.plan_name,
      sortable: true,
      id: 'charge_name',
      style: {
        fontSize: 17,
      },
    },
    {
      name: 'Amount',
      selector: (row) => row.price,
      sortable: true,
      id: 'charge_amount',

      style: {
        fontSize: 17,

      },
    },
    {
      name: 'Charged Date',
      selector: (row) => row.created_at,
      sortable: true,
      id: 'charge_date',
      style: {
        fontSize: 15,
      },
    }
  ]
  console.log(subscribedCardId)

  // Get user Details From DB(if any) and Set Values in States
  useEffect(() => {
    if (data?.length > 0) {
      const mydata = data[0];
      let name = mydata?.username?.split(" ");
      if (name?.length > 0) {
        setUserDetails({ ...mydata, firstname: name[0], lastname: name[1], store_url: mydata?.store_url });
      }
    } else {
      return;
    }
  }, [data, subscribedCardId]);
  console.log(userDetails, "old")

  // Get Current Plan and Set Billing Details in TableData
  useEffect(() => {
    if (billingPlan !== undefined) {
      let cardId = priceData?.find((plan) => plan?.plan_name === billingPlan?.plan_name)
      setPriceCard([{ ...cardId }])
      setSubscribedCardId(cardId?.id)
      setUserDetails({ ...userDetails, billing_id: subscribedCardId })
      setSubscribeMessage(`Subscribed to ${billingPlan?.plan_name} price card. Billed and reset every month on the ${new Date(billingPlan?.created_at).getDate()} at ${new Date(billingPlan?.created_at).getHours()}:${new Date(billingPlan?.created_at).getMinutes()}:${new Date(billingPlan?.created_at).getSeconds()}`)

    }
  }, [billingPlan, priceData])

  useEffect(() => {
    if (billingPlan) {
      let currentPlan = { ...billingPlan, created_at: new Date(billingPlan?.created_at).toLocaleString() }
      setTableData([currentPlan])
    }
  }, [billingPlan])
  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  console.log(userDetails, "new")

  // Save User Account Details

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true)
    if (data?.length > 0) {
      const response = await fetch("/api/userprofile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      })

      if (response.ok) {
        const newUserData = await response.json();
        await dispatch(SaveUser(newUserData));
        setIsloading(false)
      } else {
        return;
      }

    } else {
      await fetch("/api/userprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      })
        .then((res) => res.json())
        .then((data) => dispatch(SaveUser(data)))
        .catch((err) => console.log(err));
      setIsloading(false)
    }
  };

  return (
    <div className="user-container">
      <div className="account-section">
        <div className="account-title">
          <h2>Account Details</h2>
        </div>

        {/* Contact Details Form */}
        <div className="contact-details">
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
        <div className="billing-details">
          <h3>Billing Details</h3>
          <p>{subscribeMessage}</p>

          {priceCard?.length > 0 ? <div className="carousel" >
            <div className="billing-cards" style={{
            }}>
              {priceCard?.length > 0 ? priceCard?.map((card, index) => {
                return (
                  <div key={index}
                    style={{
                    }}
                    className="billing-card">
                    <BillingCard
                      className="card"
                      key={card.id}
                      card={card}
                    />
                  </div>
                );
              }) : <div class="spinner"></div>}
            </div>
            <div className="billing_table">
              <DataTable
                columns={billingColumns}
                data={tableData}
                customStyles={billingStyles}
                pagination
                highlightOnHover
              />
            </div>

          </div> : <div className="spinner"></div>}

          {/* <div className="billing-details-block">
          </div> */}
        </div>

        {/* Save the Data  */}
        <div className="account-save">
          <button type="submit" onClick={handleSubmit} className="btnSave" disabled={userDetails?.billing_id === null}>
            {isLoading ? "Saving..." : " Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
