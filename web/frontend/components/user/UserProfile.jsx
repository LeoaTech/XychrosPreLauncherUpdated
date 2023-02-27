import React from "react";
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
                  <input type="text" name="firstname" id="firstname" />
                </div>
                <div className="inputfield">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    // value={""}
                    // onChange={""}
                  />
                </div>
              </div>
              <div className="form-input-group">
                <div className="inputfield">
                  <label htmlFor="email">Contact Email</label>
                  <input type="text" name="email" id="email" />
                </div>

                <div className="inputfield">
                  <label htmlFor="storelink">Store URL</label>
                  <input
                    type="text"
                    name="storelink"
                    id="storelink"
                    // sssdd
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
