import React from "react";
import { useThemeContext } from "../../../contexts/ThemeContext";
import { RewardData } from "../../newcampaign/rewardTier/RewardData";

const RewardSettingsForm = ({
  settingsData,
  rewardTierValidate,
  isFieldDisabled,
  handleDiscountRadioChange,
  handleChange,
}) => {
  const { theme } = useThemeContext();
  return (
    <div className="reward-setting-container">
      <div className={theme == "dark" ? "subheading" : "subheading-light"}>
        <p>
          Set up the Rewards for your customers here! Select the discount type
          and then the reward tiers!
        </p>
        <p>
          {" "}
          Note: Discount will not be applicable on Shipping. Each code can be
          used by a customer only once.
        </p>
      </div>

      <div className="discount-card-block">
        <div className="sub-title">
          <h2>Discount</h2>
        </div>

        <div
          className={
            theme == "dark" ? "discounts_input" : "discounts_input-light"
          }
        >
          <input
            className="social-radioInput"
            type="radio"
            name="discount_type"
            value="percent"
            checked={settingsData?.discount_type === "percent"}
            onChange={handleDiscountRadioChange}
          />
          <label htmlFor="discount_type">% off the entire order</label>
        </div>
        <div
          className={
            theme == "dark" ? "discounts_input" : "discounts_input-light"
          }
        >
          <input
            className="social-radioInput"
            type="radio"
            name="discount_type"
            value="amount"
            checked={settingsData?.discount_type === "amount"}
            onChange={handleDiscountRadioChange}
          />
          <label htmlFor="discount_type">$ off the entire order</label>
        </div>
      </div>

      <div className="rewards-tiers-cardblocks">
        {rewardTierValidate && (
          <h6 className="validation">Reward Tier 1 and Tier 2 must Required</h6>
        )}
        {RewardData?.map((reward) => (
          <div
            key={reward.id}
            className={theme === "dark" ? "reward-card" : "reward-card-light"}
          >
            <div classname="reward-tier-card">
              <div
                className={
                  theme === "dark" ? "reward-title" : "reward-title-light"
                }
              >
                <h2>{reward.title}</h2>
                <span> {reward.is_required === true && "(Required)"}</span>
              </div>
              <div className="reward-content">
                <div className="reward-form">
                  <div
                    className={
                      theme === "dark" ? "inputfield" : "inputfield-light"
                    }
                  >
                    <label htmlFor={`reward_${reward?.id}_tier`}>
                      No of Referrals
                    </label>
                    <input
                      className="small-inputfield"
                      type="number"
                      min={settingsData?.discount_type === "percent" ? 1 : 1}
                      max={
                        settingsData?.discount_type === "percent" ? 100 : null
                      }
                      name={`reward_${reward?.id}_tier`}
                      value={
                        settingsData[`reward_${reward?.id}_tier`] === ""
                          ? null
                          : settingsData[`reward_${reward?.id}_tier`]
                      }
                      onChange={handleChange}
                      disabled={
                        isFieldDisabled(reward?.id) ||
                        (reward?.id > 1 &&
                          !settingsData[`reward_${reward?.id - 1}_discount`])
                      }
                    />
                  </div>
                  <div
                    className={
                      theme === "dark" ? "inputfield" : "inputfield-light"
                    }
                  >
                    <label htmlFor={`reward_${reward?.id}_discount`}>
                      Discount
                    </label>
                    <input
                      className="small-inputfield"
                      type="number"
                      name={`reward_${reward?.id}_discount`}
                      min={settingsData?.discount_type === "percent" ? 1 : 1}
                      max={
                        settingsData?.discount_type === "percent" ? 100 : null
                      }
                      value={
                        settingsData[`reward_${reward?.id}_discount`] === ""
                          ? null
                          : settingsData[`reward_${reward?.id}_discount`]
                      }
                      onChange={handleChange}
                      disabled={
                        isFieldDisabled(reward?.id) ||
                        (reward?.id > 1 &&
                          !settingsData[`reward_${reward?.id - 1}_discount`])
                      }
                    />
                  </div>
                  <div
                    className={
                      theme === "dark" ? "inputfield" : "inputfield-light"
                    }
                  >
                    <label htmlFor={`reward_${reward?.id}_code`}>
                      Discount Code
                    </label>
                    <input
                      className="large-field"
                      type="text"
                      name={`reward_${reward?.id}_code`}
                      value={settingsData[`reward_${reward?.id}_code`]}
                      onChange={handleChange}
                      disabled={
                        isFieldDisabled(reward?.id) ||
                        (reward?.id > 1 &&
                          !settingsData[`reward_${reward?.id - 1}_discount`])
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardSettingsForm;
