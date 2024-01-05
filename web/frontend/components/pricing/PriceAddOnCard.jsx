import React from "react";

const PriceAddOnCard = ({
  handleCancelAddOnSubscription,
  handleCollectNumbersInput,
  handleConfirmAddOn,
  isSubscribing,
  activePlan,
  collectNumbers
}) => {
  return (
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
  );
};

export default PriceAddOnCard;
