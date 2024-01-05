import React, { useEffect, useState } from "react";
import "./user.css";
import { fetchUserDetails, SaveUser } from "../../app/features/users/userSlice";
import { useSelector } from "react-redux";
import { fetchCurrentPlan } from "../../app/features/current_plan/current_plan";
import { fetchAllpricing } from "../../app/features/pricing/pricing";
import ContactDetailsForm from "./ContactDetailsForm";
import BillingDetailsCard from "./BillingDetailsCard";

const UserProfile = () => {
  const data = useSelector(fetchUserDetails);
  const priceData = useSelector(fetchAllpricing);
  const billingPlan = useSelector(fetchCurrentPlan);
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [userDetails, setUserDetails] = useState();
  const [subscribedCardId, setSubscribedCardId] = useState(null);
  const [priceCard, setPriceCard] = useState([]);
  const [tableData, setTableData] = useState([]);

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
      setPriceCard([{ ...cardId, discountPrice: billingPlan?.price }]);
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

  return (
    <div className="user-container">
      <div className="account-section">
        <div className="account-title">
          <h2>Account Details</h2>
        </div>

        {/* Contact Details Form */}
        <ContactDetailsForm userDetails={userDetails} />

        {/* Billing Details with All Pricing Cards */}
        <BillingDetailsCard
          subscribeMessage={subscribeMessage}
          priceCard={priceCard}
          tableData={tableData}
        />
      </div>
    </div>
  );
};

export default UserProfile;
