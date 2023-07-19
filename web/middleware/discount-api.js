import { Shopify } from '@shopify/shopify-api';
import fetch from 'node-fetch';

const api_version = '2022-10';

// -------------------------- Customers Segments - GraphQL API Call ----------------------------

const segmentApiCalls = async (accessToken, shop, campaignData) => {
    const url = `https://${shop}/admin/api/${api_version}/graphql.json`;

    // Set Headers
    const headers = {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
    };

    // [Update] - Will be retrieved from campaign data
    const desiredTag1 = 'eligibleFirstTier';
    const segment1Name = `"${campaignData.name}-Tier1Segment"`
    const segment1Query = `"customer_tags CONTAINS '${desiredTag1}'"`;
    const mutation1 = `
        mutation {
            segmentCreate(name: ${segment1Name}, query: ${segment1Query}) {
                segment {
                    id
                    name
                    query
                }
                userErrors {
                    message
                    field
                }
            }
        }
    `;
    try {
            const options = {
                method: 'POST',
                headers,
                body: JSON.stringify({ query: mutation.trim() }),
            };

            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok || data.errors) {
                const errors = data.errors || data.data.segmentCreate.userErrors;
                throw new Error(`Failed to create customer segments: ${JSON.stringify(errors)}`);
            }

            const segment = data.data.segmentCreate.segment;
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while creating customer segments');
    }

};

    // Discount type
    let price_rule_type = '';

    if (campaignData.discount_type === 'percent') {
        price_rule_type = 'percentage';
    } else {
        price_rule_type = 'fixed_amount'
    }

    // Tier 1
    const reward_1_tier = campaignData.reward_1_tier;
    const reward_1_discount = campaignData.reward_1_discount;
    const reward_1_code = campaignData.reward_1_code;

    // Tier 2
    const reward_2_tier = campaignData.reward_2_tier;
    const reward_2_discount = campaignData.reward_2_discount;
    const reward_2_code = campaignData.reward_2_code;

    // Tier 3
    const reward_3_tier = campaignData.reward_3_tier;
    const reward_3_discount = campaignData.reward_3_discount;
    const reward_3_code = campaignData.reward_3_code;

    // Tier 4
    const reward_4_tier = campaignData.reward_4_tier;
    const reward_4_discount = campaignData.reward_4_discount;
    const reward_4_code = campaignData.reward_4_code;

    // Overall Tier data
    const tierData = {
        tier1: reward_1_discount,
        tier2: reward_2_discount,
        tier3: reward_3_discount,
        tier4: reward_4_discount,
    };

    // price rule settings
    const priceRulesSettings = [
        {
            title: `${campaignData.name}_Tier_1_Discounts`,
            target_type: "line_item",
            target_selection: "all",
            allocation_method: "across",
            value_type: `${price_rule_type}`,
            value: `-${tierData.tier1}.0`,
            customer_selection: "all",
            once_per_customer: true,
            starts_at: new Date().toISOString(),
        },
        {
            title: `${campaignData.name}_Tier_2_Discounts`,
            target_type: "line_item",
            target_selection: "all",
            allocation_method: "across",
            value_type: `${price_rule_type}`,
            value: `-${tierData.tier2}.0`,
            customer_selection: "all",
            once_per_customer: true,
            starts_at: new Date().toISOString(),
        },
    ];

    // check if tier 3 and 4 are not null

    if (tierData.tier3) {
        const tier3Data = {
            title: `${campaignData.name}_Tier_3_Discounts`,
            target_type: "line_item",
            target_selection: "all",
            allocation_method: "across",
            value_type: `${price_rule_type}`,
            value: `-${tierData.tier3}.0`,
            customer_selection: "all",
            once_per_customer: true,
            starts_at: new Date().toISOString(),
        };
        priceRulesSettings.push(tier3Data);
    }

    if (tierData.tier4) {
        const tier4Data = {
            title: `${campaignData.name}_Tier_4_Discounts`,
            target_type: "line_item",
            target_selection: "all",
            allocation_method: "across",
            value_type: `${price_rule_type}`,
            value: `-${tierData.tier4}.0`,
            customer_selection: "all",
            once_per_customer: true,
            starts_at: new Date().toISOString(),
        };
        priceRulesSettings.push(tier4Data);
    }

    // overall discount data
    const discountData = {
        discount1: reward_1_code,
        discount2: reward_2_code,
        discount3: reward_3_code,
        discount4: reward_4_code
    }

    // discount body
    const discountCodeBody = [
        {
            code: `${discountData.discount1}`
        },
        {
            code: `${discountData.discount2}`
        }
    ];

    // check if tier 3 and 4 are not null
    if (discountData.discount3) {
        const discount3Data = {
            code: `${discountData.discount3}`
        };
        discountCodeBody.push(discount3Data)
    }

    if (discountData.discount4) {
        const discount4Data = {
            code: `${discountData.discount4}`
        };
        discountCodeBody.push(discount4Data)
    }

    // set headers
    const headers = {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
    };

    // create price rules
    const createPriceRules = async () => {
        const priceRuleIds = [];
        const url = `https://${shop}/admin/api/2022-10/price_rules.json`;

        for (const rule of priceRulesSettings) {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ price_rule: rule }),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(`Failed to Create Price Rule: ${data.errors}`);
                }
                console.log(`Price Rule "${rule.title}" Created!`);
                console.log(data);
                priceRuleIds.push(data.price_rule.id);
            }
            catch (error) {
                console.log(error);
            }
        }
        console.log('Generated Price Rules:', priceRuleIds);
        return priceRuleIds;
    }

    // create discount code for each price rule
    const createDiscountCodes = async (priceRuleIds) => {
        const discountCodes = [];
        const url = `https://${shop}/admin/api/2022-10/price_rules/:price_rule_id/discount_codes.json`;

        for (const [index, code] of discountCodeBody.entries()) {
            const priceRuleId = priceRuleIds[index % priceRuleIds.length];
            try {
                const response = await fetch(url.replace(':price_rule_id', priceRuleId), {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ discount_code: code }),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(`Failed to Generate Discount: ${data.errors}`);
                }
                console.log(`Discount Code ${code.code} Created!`);
                console.log(data);
                discountCodes.push(data.discount_code.code);
            } catch (error) {
                console.log(error);
            }
        }
        console.log("Generated Discount Codes: ", discountCodes);
    }

    const priceRuleIds = await createPriceRules();
    await createDiscountCodes(priceRuleIds);
}

// ------------------- API ---------------------
export default function discountApiEndpoint(app) {
    app.post("/api/generate_discount", async (req, res) => {
        try {
            const session = await Shopify.Utils.loadCurrentSession(
                req,
                res,
                app.get("use-online-tokens")
            );
            const { accessToken, shop } = session;
            const { campaignData } = req.body;
            await discountApiCalls(accessToken, shop, campaignData);
            // console.log(campaignData);
            return res.status(200).json({ success: true, message: "Discount Codes Generated Successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to Generate Discount Codes", error: error.message });
        }
    });
}