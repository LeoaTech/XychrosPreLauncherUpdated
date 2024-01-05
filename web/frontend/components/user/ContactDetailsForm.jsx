import React from "react";
import "./user.css";


const ContactDetailsForm = ({userDetails}) => {
  return (
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
              readOnly
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
              readOnly
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
              readOnly
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
              readOnly
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsForm;
