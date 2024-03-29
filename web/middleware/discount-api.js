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
    const desiredTag1 = `${campaignData.name}-tier_1_unlocked`;
    const desiredTag2 = `${campaignData.name}-tier_2_unlocked`;
    const desiredTag3 = `${campaignData.name}-tier_3_unlocked`;
    const desiredTag4 = `${campaignData.name}-tier_4_unlocked`;

    // tier data from campaign details
    const tierData = {
        tier1: campaignData.reward_1_tier,
        tier2: campaignData.reward_2_tier,
        tier3: campaignData.reward_3_tier,
        tier4: campaignData.reward_4_tier,
    };

    // check for active tiers and create queries accordingly
    const mutations = [];

    // Query for Tier 1 Segment
    const segment1Name = `"${campaignData.name}-Tier1"`
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
    mutations.push(mutation1);

    // Query for Tier 2 Segment
    const segment2Name = `"${campaignData.name}-Tier2"`
    const segment2Query = `"customer_tags CONTAINS '${desiredTag2}'"`;
    const mutation2 = `
        mutation {
            segmentCreate(name: ${segment2Name}, query: ${segment2Query}) {
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
    mutations.push(mutation2);

    // Query for Tier 3 Segment
    if (tierData.tier3) {
        const segment3Name = `"${campaignData.name}-Tier3"`
        const segment3Query = `"customer_tags CONTAINS '${desiredTag3}'"`;
        const mutation3 = `
            mutation {
                segmentCreate(name: ${segment3Name}, query: ${segment3Query}) {
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
        mutations.push(mutation3);
    }

    // Query for Tier 4 Segment
    if (tierData.tier4) {
        const segment4Name = `"${campaignData.name}-Tier4"`
        const segment4Query = `"customer_tags CONTAINS '${desiredTag4}'"`;
        const mutation4 = `
            mutation {
                segmentCreate(name: ${segment4Name}, query: ${segment4Query}) {
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
        mutations.push(mutation4);
    }

    const createdSegmentIds = [];

    try {
        for (const mutation of mutations) {
            const options = {
                method: 'POST',
                headers,
                body: JSON.stringify({ query: mutation.trim() }),
            };

            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok || data.errors) {
                const errors = data.errors || data.data.segmentCreate.userErrors;
                throw new Error(`Failed to Create Customer Segments: ${JSON.stringify(errors)}`);
            }

            const segment = data.data.segmentCreate.segment;
            if (segment) {
                console.log(`Customer Segment "${segment.name}" Created!`);
                let segment_id = segment.id.match(/\d+/)[0];
                createdSegmentIds.push(parseInt(segment_id, 10));
            }
        }
    } catch (error) {
        throw new Error(`An Error Occurred While Creating Customer Segments ${error?.message}`);
    }

    // console.log('Created Segment Ids:', createdSegmentIds);
    return createdSegmentIds;
};


// ------------------------- Price Rules and Dicounts - Rest API Call --------------------------

const discountApiCalls = async (accessToken, shop, campaignData, customerSegmentIds) => {

    // Set Headers
    const headers = {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
    };

    // extract rewards settings from campaign data

    // Discount type
    let price_rule_type = '';

    if (campaignData.discount_type === 'percent') {
        price_rule_type = 'percentage';
    } else {
        price_rule_type = 'fixed_amount'
    }

    // Tier 1
    const reward_1_discount = campaignData.reward_1_discount;
    const reward_1_code = campaignData.reward_1_code;

    // Tier 2
    const reward_2_discount = campaignData.reward_2_discount;
    const reward_2_code = campaignData.reward_2_code;

    // Tier 3
    const reward_3_discount = campaignData.reward_3_discount;
    const reward_3_code = campaignData.reward_3_code;

    // Tier 4
    const reward_4_discount = campaignData.reward_4_discount;
    const reward_4_code = campaignData.reward_4_code;

    // Overall Tier data
    const priceRules_tierData = {
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
            value: `-${priceRules_tierData.tier1}.0`,
            customer_selection: "prerequisite",
            customer_segment_prerequisite_ids: [customerSegmentIds[0]],
            once_per_customer: true,
            starts_at: new Date().toISOString(),
        },
        {
            title: `${campaignData.name}_Tier_2_Discounts`,
            target_type: "line_item",
            target_selection: "all",
            allocation_method: "across",
            value_type: `${price_rule_type}`,
            value: `-${priceRules_tierData.tier2}.0`,
            customer_selection: "prerequisite",
            customer_segment_prerequisite_ids: [customerSegmentIds[1]],
            once_per_customer: true,
            starts_at: new Date().toISOString(),
        },
    ];

    // check if tier 3 and 4 are not null

    if (priceRules_tierData.tier3) {
        const tier3Data = {
            title: `${campaignData.name}_Tier_3_Discounts`,
            target_type: "line_item",
            target_selection: "all",
            allocation_method: "across",
            value_type: `${price_rule_type}`,
            value: `-${priceRules_tierData.tier3}.0`,
            customer_selection: "prerequisite",
            customer_segment_prerequisite_ids: [customerSegmentIds[2]],
            once_per_customer: true,
            starts_at: new Date().toISOString(),
        };
        priceRulesSettings.push(tier3Data);
    }

    if (priceRules_tierData.tier4) {
        const tier4Data = {
            title: `${campaignData.name}_Tier_4_Discounts`,
            target_type: "line_item",
            target_selection: "all",
            allocation_method: "across",
            value_type: `${price_rule_type}`,
            value: `-${priceRules_tierData.tier4}.0`,
            customer_selection: "prerequisite",
            customer_segment_prerequisite_ids: [customerSegmentIds[3]],
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

    // Create Price Rules
    const createPriceRules = async () => {
        const priceRuleIds = [];
        const url = `https://${shop}/admin/api/${api_version}/price_rules.json`;

        for (const rule of priceRulesSettings) {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ price_rule: rule }),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(`Failed to Create Price Rule: ${data?.errors?.message}`);
                }
                console.log(`Price Rule "${rule?.title}" Created!`);
                priceRuleIds.push(data?.price_rule?.id);
            }
            catch (error) {
                throw new Error(`Failed to Create Price Rule: ${error?.message}`);
            }
        }
        // console.log('Generated Price Rule Ids:', priceRuleIds);
        return priceRuleIds;
    }

    // Create Discount Codes
    const createDiscountCodes = async (priceRuleIds) => {
        const discountCodes = [];
        const url = `https://${shop}/admin/api/${api_version}/price_rules/:price_rule_id/discount_codes.json`;

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
                    throw new Error(`Failed to Generate Discount: ${data?.errors?.message}`);
                }
                console.log(`Discount Code ${code?.code} Created!`);
                discountCodes.push(data?.discount_code?.code);
            } catch (error) {
                throw new Error(`Failed to Generate Discount Codes: ${error?.message}`);
            }
        }
        // console.log("Generated Discount Codes: ", discountCodes);
        return discountCodes;
    }

    // price rules
    const priceRuleIds = await createPriceRules();

    // pass price rule ids to generate discount codes
    const discountcodes = await createDiscountCodes(priceRuleIds);

    const discountDetails = {
        tier1_price_rule_id: priceRuleIds[0],
        tier2_price_rule_id: priceRuleIds[1],
        tier3_price_rule_id: priceRuleIds[2] || null,
        tier4_price_rule_id: priceRuleIds[3] || null,
        discount_code_1: discountcodes[0] || null,
        discount_code_2: discountcodes[1] || null,
        discount_code_3: discountcodes[2] || null,
        discount_code_4: discountcodes[3] || null,
    };

    return discountDetails;
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

            // customer segments function call
            let customer_segment_ids;
            try {
                customer_segment_ids = await segmentApiCalls(accessToken, shop, campaignData);
            } catch (segmentError) {
                return res.status(500).json({ success: false, message: "Failed to Create Customer Segments", error: segmentError.message });
            }

            // discount and price rule function call
            let discount_details;
            try {
                discount_details = await discountApiCalls(accessToken, shop, campaignData, customer_segment_ids);
            } catch (discountError) {
                return res.status(500).json({ success: false, message: "Failed to Generate Discounts", error: discountError.message });
            }

            const campaignDetails = {
                ...discount_details,
                tier1_segment_id: customer_segment_ids[0] || null,
                tier2_segment_id: customer_segment_ids[1] || null,
                tier3_segment_id: customer_segment_ids[2] || null,
                tier4_segment_id: customer_segment_ids[3] || null,
            }

            return res.status(200).json({ success: true, data: campaignDetails, message: "Discount Codes Generated Successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to Generate Discount Codes", error: error.message });
        }
    });
}