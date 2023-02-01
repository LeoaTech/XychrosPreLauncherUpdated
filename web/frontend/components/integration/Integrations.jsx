import React from "react";
import { FaFacebook, FaWhatsappSquare, FaTiktok } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { TbBrandSnapchat } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import { BsTwitter } from "react-icons/bs";
import "./integration.css";
// import SocialBlock from "../newcampaign/socialsBlocks/SocialBlock";

const integratelinks = [
  {
    id: 1,
    icon: <FaFacebook />,
    title: "Facebook",
    desc: "Share Referral Link via Facebook ",
  },
  {
    id: 2,
    icon: <AiFillInstagram />,
    title: "Instagram",
    desc: "Share Referral Link via Instagram ",
  },
  {
    id: 3,
    icon: <BsTwitter />,
    title: "Twitter",
    desc: "Share Referral Link via Twitter ",
  },
  {
    id: 4,
    icon: <FaTiktok />,
    title: "TikTok",
    desc: "Share Referral Link via TikTok ",
  },
  {
    id: 5,
    icon: <TbBrandSnapchat />,
    title: "Snapchat",
    desc: "Share Referral Link via Snapchat ",
  },
  {
    id: 6,
    icon: <FaWhatsappSquare />,
    title: "Whatsapp",
    desc: "Share Referral Link via Whatsapp ",
  },
  {
    id: 7,
    icon: <MdEmail />,
    title: "Email",
    desc: "Share Referral Link via Email ",
  },
];

const IntegrationsComponent = () => {
  return (
    <div>
      <div className="integration-container">
        {/* Navbar */}
        <div className="nav">
          <div className="navtitle">
            <h1>Klaviyo Integration</h1>
            <div className="check-input">
              <input type="checkbox" name="" id="" />
              <label htmlFor="">Integrate with Klaviyo</label>
            </div>
          </div>
          <button type="submit" className="saveBtn">
            Save
          </button>
        </div>

        <div className="social-media-section">
          <h1>Social Media Integration</h1>

          <div className="social-links-container">
            {integratelinks.map((link) => (
              <div className="socialblock" key={link.id}>
                {/* <SocialBlock link={link} /> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsComponent;
