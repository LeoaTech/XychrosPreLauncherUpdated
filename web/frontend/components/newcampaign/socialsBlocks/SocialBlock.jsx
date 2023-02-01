import React from "react";
import "./social.css";
const SocialBlock = ({ link }) => {
  return (
    <div>
      <div className="social-section">
        <div className="social-title">
          <span className="social-icons">{link.icon}</span>
          <h3>{link.title}</h3>
        </div>

        <div className="check-input">
          <input type="checkbox" name="" id="" />
          <label htmlFor="">{link.desc}</label>
        </div>

        <div className="message-input">
          <textarea className="issue-textarea" rows={4} />
        </div>
      </div>
    </div>
  );
};

export default SocialBlock;
