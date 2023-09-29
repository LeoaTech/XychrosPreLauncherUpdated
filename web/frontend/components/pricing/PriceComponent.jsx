import React, { Fragment, useEffect, useState } from "react";
import { useAppBridge, useNavigate } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions/index.js";
import "./price.css";
import PricingBlock from "./pricingBlock/PricingBlock";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllpricing } from "../../app/features/pricing/pricing";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import { useAuthenticatedFetch } from "../../hooks";
import {
  fetchCurrentPlan,
  fetchSavePlan,
} from "../../app/features/current_plan/current_plan";

const PriceComponent = () => {
  const priceData = useSelector(fetchAllpricing); //Get all Pricing Details Cards
  const activePlan = useSelector(fetchCurrentPlan); //Current Active Plan

  const [pricePlans, setPricePlans] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedPlanId, setSubscribedPlanId] = useState(null); //handle Biiling Card subscription ID
  const [collectNumbers, setCollectNumbers] = useState(false);
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchAuth = useAuthenticatedFetch();

  useEffect(() => {
    if (activePlan) {
      let planId;
      if (activePlan?.plan_name?.includes("Add-on")) {
        const charged_name = activePlan?.plan_name?.split(" + ");
        const tierName = charged_name[0]; // Extract "Tier Name"

        planId = priceData?.find((plan) => plan?.plan_name === tierName);
      } else {
        planId = priceData?.find(
          (plan) => plan?.plan_name === activePlan?.plan_name
        );
      }
      setSubscribedPlanId(planId?.id);
      setCollectNumbers(activePlan?.collecting_phones);
    }
  }, [activePlan, priceData]);

  useEffect(() => {
    if (priceData.length > 0) {
      setPricePlans([...priceData]);
    }
  }, [priceData]);

  // Handle Card Next and Prev events
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const maxCardIndex = pricePlans?.length - 1;
  const cardWidth = 300;

  const handleClickNext = () => {
    if (currentCardIndex < maxCardIndex) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };
  const handleClickPrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleCollectNumbersInput = (e) => {
    setCollectNumbers(e.target.checked);
  };

  const handleConfirmAddOn = async () => {
    setIsSubscribing(true);

    let chargeAmount =
      activePlan?.plan_name === "Free" ? "0.0" : activePlan?.price;
    const subscribeAddOns = {
      ...activePlan,
      price: chargeAmount,
      billing_required: true, //Billing required true for Free plan with add-ons selected
    };
    const response = await fetchAuth("/api/confirm-add-ons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...subscribeAddOns,
        currency_code: "USD",
        collecting_phones: collectNumbers,
      }),
    });
    if (response.ok) {
      const subscribe_data = await response.json();
      if (subscribe_data?.confirmationUrl) {
        redirect.dispatch(Redirect.Action.REMOTE, {
          url: subscribe_data.confirmationUrl,
          newContext: false,
        });
      }
      setIsSubscribing(false);
    } else {
      return "No plan subscribed";
    }
  };

  const handleCancelAddOnSubscription = async () => {
    setIsSubscribing(true);

    const charged_name = activePlan?.plan_name.split(" + ");
    const tierName = charged_name[0]; // Extract "Tier Name"

    let planId = priceData?.find((plan) => plan?.plan_name === tierName);
    let charged_amount = planId?.price;
    let requiredBilling = planId?.plan_name === "Free" ? false : true;
    const subscribeAddOns = {
      ...activePlan,
      plan_name: planId?.plan_name,
      price: charged_amount,
      billing_required: requiredBilling,
    };
    const response = await fetchAuth("/api/confirm-add-ons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...subscribeAddOns,
        currency_code: "USD",
        collecting_phones: false,
      }),
    });
    if (response.ok) {
      const subscribe_data = await response.json();
      if (subscribe_data?.confirmationUrl) {
        redirect.dispatch(Redirect.Action.REMOTE, {
          url: subscribe_data.confirmationUrl,
          newContext: false,
        });
        setIsSubscribing(false);
      } else {
        dispatch(fetchSavePlan(subscribe_data));
        setIsSubscribing(false);
        navigate("/");
      }
    } else {
      return;
    }
  };

  // Handle Subscription plan Event
  const handlePlanSubscribe = async (id) => {
    setIsloading(true);
    setSubscribedPlanId(id);

    if (pricePlans) {
      const data = pricePlans?.find((price) => price.id === id);

      setIsSubscribed(true);

      // Subscribed To Paid Tiers
      if (data?.plan_name !== "Free") {
        const response = await fetchAuth("/api/subscribe-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            billing_required: true,
            collecting_phones: collectNumbers,
          }),
        });
        if (response.ok) {
          const subscribe_data = await response.json();
          redirect.dispatch(Redirect.Action.REMOTE, {
            url: subscribe_data.confirmationUrl,
            newContext: false,
          });
          setSubscribedPlanId(id);
          setIsloading(false);
        } else {
          return;
        }
      } else {
        //Subscribed to Free Tier
        const response = await fetchAuth("/api/subscribe-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, collecting_phones: collectNumbers }),
        });
        if (response.ok) {
          const subscribe_data = await response.json();
          if (subscribe_data?.confirmationUrl) {
            redirect.dispatch(Redirect.Action.REMOTE, {
              url: subscribe_data.confirmationUrl,
              newContext: false,
            });
            setSubscribedPlanId(id);
            setIsloading(false);
          } else {
            dispatch(fetchSavePlan(subscribe_data));
            setSubscribedPlanId(id);
            setIsloading(false);
            navigate("/");
          }
        } else {
          return "No plan subscribed";
        }
      }
    }
  };

  return (
    <div className="pricing-container">
      <div className="pricing-title">
        <h2>Select Your Plan</h2>
      </div>
      <div className="price-details-container">
        {priceData?.length > 0 && (
          <div className="action-click-btn">
            <button className="clickPrev" onClick={handleClickPrev}>
              <AiOutlineArrowLeft style={{ height: 19, width: 19 }} />
            </button>
            <button className="clickNext" onClick={handleClickNext}>
              <AiOutlineArrowRight style={{ height: 19, width: 19 }} />
            </button>
          </div>
        )}
        <div className="price-block">
          {pricePlans?.length ? (
            pricePlans?.map((price, index) => {
              const isCurrentSubscribedPlan = price.id === subscribedPlanId;

              return (
                <div
                  key={index}
                  // style={{
                  //   transform: `translateX(-${
                  //     currentCardIndex * (cardWidth + 10)
                  //   }px)`,
                  // }}
                  // className={`pricing-card ${
                  //   index === subscribedPlanId - 1 ? "" : "active"
                  // }`}
                  style={{
                    transform: `translateX(-${
                      currentCardIndex * (cardWidth + 10)
                    }px)`,
                  }}
                  className={`pricing-card ${
                    isCurrentSubscribedPlan ? "active" : ""
                  }`}
                >
                  <PricingBlock
                    id={price?.id}
                    key={price?.id}
                    title={price?.plan_name}
                    features={price?.features}
                    price={price?.price}
                    isLoading={isLoading}
                    handlePlanSubscribe={handlePlanSubscribe}
                    isSubscribed={price.id === subscribedPlanId}
                    subscribedPlanId={subscribedPlanId}
                  />
                </div>
              );
            })
          ) : (
            <div class="spinner"></div>
          )}
        </div>
      </div>
      {priceData?.length > 0 && (
        <div className="pricing-add-ons">
          <div className="add-on-card">
            <div>
              <label>Select Add-ons</label>
              <label>price</label>
            </div>
            <div>
              <input
                id="collect-numbers"
                name="collect-numbers"
                type="checkbox"
                checked={collectNumbers}
                onChange={handleCollectNumbersInput}
              />
              <label htmlFor="collect-numbers">Collecting phone numbers</label>
              <h4 className="price-tag">$5</h4>
            </div>
            <div className="confirmation-btn">
              {collectNumbers && (
                <button
                  disabled={isSubscribing || activePlan?.collecting_phones}
                  className={
                    activePlan?.collecting_phones || isSubscribing
                      ? "btn-confirmed disabled"
                      : "btn-confirmed"
                  }
                  onClick={handleConfirmAddOn}
                >
                  Confirm Add-Ons
                </button>
              )}
              {activePlan?.collecting_phones && (
                <button
                  className="btn-confirmed"
                  onClick={handleCancelAddOnSubscription}
                >
                  Cancel Add-on
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceComponent;
