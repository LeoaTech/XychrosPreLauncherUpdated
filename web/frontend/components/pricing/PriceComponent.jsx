import React, { Fragment, useEffect, useState } from "react";
import "./price.css";
import PricingBlock from "./pricingBlock/PricingBlock";
import { useSelector } from "react-redux";
import { fetchAllpricing } from "../../app/features/pricing/pricing";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai'
import { useAuthenticatedFetch } from "../../hooks";

const PriceComponent = () => {
  const priceData = useSelector(fetchAllpricing);
  const [pricePlans, setPricePlans] = useState();
  const [isLoading, setIsloading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscribedPlanId, setSubscribedPlanId] = useState(null);  //handle Biiling Card subscription ID

  const fetchAuth = useAuthenticatedFetch();

  useEffect(() => {
    if (priceData.length > 0) {
      setPricePlans(priceData);
    }
  }, [priceData])

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const maxCardIndex = pricePlans?.length - 1;
  const cardWidth = 280;

  const handleClickNext = () => {
    if (currentCardIndex < maxCardIndex) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  }
  const handleClickPrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  }

  const handlePlanSubscribe = async (id) => {
    // setIsloading(true);
    if (pricePlans) {
      const data = pricePlans?.find((price) => price.id === id)
      // console.log(data, "handle function")
      setSubscribedPlanId(id);
      setIsSubscribed(true)
      if (data?.plan_name !== "Free") {
        const response = await fetchAuth("/api/subscribe-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, billing_required: true }),
        });
        if (response.ok) {

          const subscribe_data = await response.json();
          console.log(subscribe_data, "Client Selected Paln")
          // await dispatch(SavePlan(subscribe_data));
          // setIsloading(false)
        } else {
          return;
        }
      } else {
        const response = await fetchAuth("/api/subscribe-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {

          const subscribe_data = await response.json();
          console.log(subscribe_data, "Client selected already")

          // await dispatch(SavePlan(subscribe_data));
          setIsloading(false)
          
        } else {
          return;
        }
      }
    }
  }

  return (
    <div className="pricing-container">
      <div className="pricing-title">
        <h2>Pricing & Billing</h2>
      </div>

      <div className="price-details-container" >
        {priceData?.length > 0 && <div className="action-click-btn">
          <button className="clickPrev" onClick={handleClickPrev}><AiOutlineArrowLeft style={{ height: 19, width: 19 }} /></button>
          <button className="clickNext" onClick={handleClickNext}><AiOutlineArrowRight style={{ height: 19, width: 19 }} /></button>
        </div>}
        <div className="price-block">

          {pricePlans?.map((price, index) => {
            return (
              <div key={index} style={{
                transform: `translateX(-${currentCardIndex * (cardWidth + 10)}px)`,
              }}
                className={`pricing-card ${index === currentCardIndex ? 'active' : ''}`}
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
                />
              </div>
            )
          })}
        </div>
      </div>

    </div>
  );
};

export default PriceComponent;
