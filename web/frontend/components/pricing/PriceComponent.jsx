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
      let planId = priceData?.find(
        (plan) => plan?.plan_name === activePlan?.plan_name
      );
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
              return (
                <div
                  key={index}
                  style={{
                    transform: `translateX(-${
                      currentCardIndex * (cardWidth + 10)
                    }px)`,
                  }}
                  className={`pricing-card ${
                    index === currentCardIndex ? "active" : ""
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
            <h2>Select Add-Ons</h2>

            <div>
              {" "}
              <input
                id="collect-numbers"
                name="collect-numbers"
                type="checkbox"
                checked={collectNumbers}
                onChange={handleCollectNumbersInput}
              />
              <label htmlFor="collect-numbers">Collecting phone numbers</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceComponent;
