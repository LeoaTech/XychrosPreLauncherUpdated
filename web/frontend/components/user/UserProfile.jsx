import React, { useState } from "react";
import BillingCard from "./BillingCard";
import "./user.css";

const PriceDetails = [
  {
    id: 1,
    title: "Basic",
    feature: [
      {
        id: 1,
        title: "1 Campaign Created",
      },
      {
        id: 2,
        title: "Used 300/1000 Email Captures",
      },
    ],
    price: 3000,
    btnText: "Subscribed",
  },
  {
    id: 2,
    title: "Business",
    slug: "view Details",
    price: 3000,
    btnText: "Update",
  },
  {
    id: 3,
    title: "Enterprise",
    slug: "view Details",
    price: 3000,
    btnText: "Update",
  },
];
const UserProfile = () => {
  const formData = {
    firstname: "",
    lastname: "",
    email: "",
    store_url: "",
    billing_id: 1,
  };

  const [userDetails, setUserDetails] = useState(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubit = async (e) => {
    e.preventDefault();

    await fetch("/api/userprofile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    // dispatch(saveUserDetails(data))
  };

  return (
    <div className="home-container">
      <div className="account-section">
        <div className="account-title">
          <h2>Account Details</h2>
        </div>

        <div className="contact-details">
          <h3>Contact Details</h3>

          <div className="form-section">
            <form>
              <div className="form-input-group">
                <div className="inputfield">
                  <label htmlFor="firstname">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
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
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="billing-details">
          <h3>Billing Details</h3>
          <p>
            Subscribed to Basic package. Billed and reset every month on the 5th
            at 00.01 AM.{" "}
          </p>
          <div className="billing-cards">
            {PriceDetails?.map((card) => {
              return (
                <div className="billing-card">
                  <BillingCard key={card.id} card={card} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="account-save">
          <button className="btnSave">Save</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
