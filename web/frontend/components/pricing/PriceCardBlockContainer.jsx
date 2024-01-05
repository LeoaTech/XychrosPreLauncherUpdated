import React from "react";
import PricingBlock from "./pricingBlock/PricingBlock";

const PriceCardBlockContainer = ({
  pricePlans,
  subscribedPlanId,
  handlePlanSubscribe,
  isDiscount,
currentCardIndex,cardWidth,isLoading, isSubscribed}) => {
  return (
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
                isDiscount={isDiscount}
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
  );
};

export default PriceCardBlockContainer;
