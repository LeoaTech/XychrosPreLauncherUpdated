import { Shopify } from '@shopify/shopify-api';
import fetch from 'node-fetch';

// api calls
const templateApiCalls = async (accessToken, shopURL, templateData, campaignData) => {

  // [hardcoded] - please update according to your app for dev purpose only

  const app_name = "updated-xychros-app";
  const extension_uuid = "990d48eb-16d0-4af0-b902-f323ed2bbfab";

  // extract campaign settings and template settings
  const campaign_name = campaignData.name;
  const template_name = templateData.campaign_name;

  // landing and reward page links
  const first_page = templateData.first_page || '';
  const second_page = templateData.second_page || '';

  // landing template settings
  const landing_show_header_footer = templateData.landing_show_header_footer;
  const landing_background_overlay = templateData.landing_background_overlay; // gradient values need to be updated in database
  const landing_main_color = `#${templateData.landing_main_color}`;
  const landing_accent_color = `#${templateData.landing_accent_color}`;
  const landing_divider = templateData.landing_divider;
  const landing_background_image = `${templateData.landing_background_image}.png`; // need to add .png/jpg or file path in database
  const landing_header_text = templateData.landing_header_text || '';
  const landing_pre_header_text = templateData.landing_pre_header_text || '';
  const landing_tagline_text = templateData.landing_tagline_text || '';
  const landing_email_placeholder_text = templateData.landing_email_placeholder_text || '';

  // show phone placeholder only if merchant wants to collect phone number
  let landing_phone_placeholder_text = '';
  if (campaignData.collect_phone == true) {
    landing_phone_placeholder_text = templateData.landing_phone_placeholder_text;
  }

  // store's social links
  let landing_facebook_link = '';
  let landing_instagram_link = '';
  let landing_twitter_link = '';
  let landing_tiktok_link = '';
  let landing_snapchat_link = '';
  let landing_discord_link = '';

  // we have to show only checked social icons on landing page, hence:
  if (campaignData.show_facebook_link == true) {
    landing_facebook_link = campaignData.facebook_link;
  }
  if (campaignData.show_instagram_link == true) {
    landing_instagram_link = campaignData.instagram_link;
  }
  if (campaignData.show_twitter_link == true) {
    landing_twitter_link = campaignData.twitter_link;
  }
  if (campaignData.show_tiktok_link == true) {
    landing_tiktok_link = campaignData.tiktok_link;
  }
  if (campaignData.show_snapchat_link == true) {
    landing_snapchat_link = campaignData.snapchat_link;
  }
  if (campaignData.show_discord_link == true) {
    landing_discord_link = campaignData.discord_link;
  }
  const landing_button_text = templateData.landing_button_text;
  const landing_base_font_size = templateData.landing_base_text_size;

  // rewards template settings
  const rewards_background_image = `${templateData.rewards_background_image}.png`; // need to be updated in database
  const rewards_show_header_footer = templateData.rewards_show_header_footer;
  const rewards_background_overlay = templateData.rewards_background_overlay; // need to be updated in database
  const rewards_main_color = `#${templateData.rewards_main_color}`;
  const rewards_accent_color = `#${templateData.rewards_accent_color}`;
  const rewards_divider = templateData.rewards_divider; // need to be updated in database
  const rewards_preheader_text = templateData.rewards_pre_header_text || '';
  const rewards_header_text = templateData.header_text || '';
  const rewards_subheader_text = templateData.rewards_sub_header_text || '';
  const rewards_base_font_size = templateData.rewards_base_text_size;
  const rewards_image = templateData.rewards_rewards_image;
  const referral_position = templateData.rewards_referral_position;
  const reward_position = templateData.reward_position;

  // set headers
  const headers = {
    'X-Shopify-Access-Token': accessToken,
    'Content-Type': 'application/json',
  };

  // template 1 body

  // first app block unique_id
  const randomHex1 = () => Math.floor(Math.random() * 16).toString(16);
  let firstBlockId = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      firstBlockId += randomHex1();
    }
    firstBlockId += "-";
  }
  firstBlockId += Math.random().toString(36).substring(2, 7);

  const body1 = {
    "sections": {
      "main": {
        "type": "apps",
        "blocks": {
          [firstBlockId]: {
            "type": `shopify:\/\/apps\/${app_name}\/blocks\/firstPage\/${extension_uuid}`,
            "settings": {
              "show_header_footer": landing_show_header_footer,
              "campaign_name": campaign_name,
              "background_overlay": landing_background_overlay,
              "main_color": landing_main_color,
              "accent_color": landing_accent_color,
              "layout": landing_divider,
              "background_image": `shopify:\/\/shop_images\/${landing_background_image}`,
              "header_text": landing_header_text,
              "subheader_text": landing_pre_header_text,
              "cta_tag_text": landing_tagline_text,
              "email_text": landing_email_placeholder_text,
              "phone_text": landing_phone_placeholder_text,
              "button_text": landing_button_text,
              "facebook_link": landing_facebook_link,
              "instagram_link": landing_instagram_link,
              "twitter_link": landing_twitter_link,
              "tiktok_link": landing_tiktok_link,
              "snapchat_link": landing_snapchat_link,
              "discord_link": landing_discord_link,
              "base_font_size": landing_base_font_size,
              "page": second_page
            }
          }
        },
        "block_order": [
          `${firstBlockId}`
        ],
        "settings": {
        }
      }
    },
    "order": [
      "main"
    ]
  };

  // template 2 body

  // second app block unique_id
  const randomHex2 = () => Math.floor(Math.random() * 16).toString(16);
  let secondBlockId = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      secondBlockId += randomHex2();
    }
    secondBlockId += "-";
  }
  secondBlockId += Math.random().toString(36).substring(2, 7);

  const body2 = {
    "sections": {
      "main": {
        "type": "apps",
        "blocks": {
          [secondBlockId]: {
            "type": `shopify:\/\/apps\/${app_name}\/blocks\/secondPage\/${extension_uuid}`,
            "settings": {
              "show_header_footer": rewards_show_header_footer,
              "campaign_name": campaign_name,
              "background_overlay": rewards_background_overlay,
              "main_color": rewards_main_color,
              "accent_color": rewards_accent_color,
              "layout": rewards_divider,
              "background_image": `shopify:\/\/shop_images\/${rewards_background_image}`,
              "preheader_text": rewards_preheader_text,
              "header_text": rewards_header_text,
              "subheader_text": rewards_subheader_text,
              "base_font_size": rewards_base_font_size,
              "icon_dropdown": rewards_image,
              "page": first_page
            }
          }
        },
        "block_order": [
          `${secondBlockId}`
        ],
        "settings": {
        }
      }
    },
    "order": [
      "main"
    ],
  };

  // get active theme id
  const getActiveThemeId = async () => {
    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/2022-10/themes.json`,
        {
          method: 'GET',
          headers,
        }
      );
      const data = await response.json();
      const activeThemeId = data.themes.find(
        (theme) => theme.role === 'main'
      ).id;
      if (activeThemeId) {
        return activeThemeId;
      } else {
        console.log('Theme id not found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // create first template
  const createFirstPageTemplate = async (themeid) => {
    const templateName = "LandingTemplate"; // base name
    const randomString = Math.random().toString(36).substring(2, 15); // generate random string
    const uniqueTemplateName = templateName + "_" + randomString; // concatenate base name and random string
    try {
      const response = await fetch(`https://${shopURL}/admin/api/2022-10/themes/${themeid}/assets.json`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          asset: {
            key: `templates/page.${uniqueTemplateName}.json`,
            value: JSON.stringify(body1),
          },
        }),
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(`Failed to create page template: ${data.errors}`);
      }
      return data;
    }
    catch (error) {
      console.error(error);
    }
  };

  // create second template
  const createSecondPageTemplate = async (themeid) => {
    const templateName = 'RewardsTemplate'; // base name
    const randomString = Math.random().toString(36).substring(2, 15); // generate random string
    const uniqueTemplateName = templateName + '_' + randomString; // concatenate base name and random string
    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/2022-10/themes/${themeid}/assets.json`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            asset: {
              key: `templates/page.${uniqueTemplateName}.json`,
              value: JSON.stringify(body2),
            },
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(`Failed to create page template: ${data.errors}`);
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // create first page 
  const createFirstPage = async (templateSuffix) => {
    const pageName = "LandingPage"; // base name
    const randomString = Math.random().toString(36).substring(2, 15); // generate random string
    const uniquePageeName = pageName + "_" + randomString; // concatenate base name and random string
    const pageBody = JSON.stringify({
      "page": {
        "title": uniquePageeName,
        "template_suffix": templateSuffix,
      }
    });

    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/2023-01/pages.json`,
        {
          method: 'POST',
          headers,
          body: pageBody,
        }
      );
      const data = await response.json();
      console.log(data);
      return data.page.handle;
    } catch (error) {
      console.error(error);
    }
  };

  // create second page
  const createSecondPage = async (templateSuffix) => {
    const pageName = "RewardsPage"; // base name
    const randomString = Math.random().toString(36).substring(2, 15); // generate random string
    const uniquePageeName = pageName + "_" + randomString; // concatenate base name and random string
    const pageBody = JSON.stringify({
      "page": {
        "title": uniquePageeName,
        "template_suffix": templateSuffix,
      }
    });

    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/2023-01/pages.json`,
        {
          method: 'POST',
          headers,
          body: pageBody,
        }
      );
      const data = await response.json();
      console.log(data);
      return data.page.handle;
    } catch (error) {
      console.error(error);
    }
  };

  // update template1 with second page handle
  const updateFirstPageTemplate = async (templateSuffix, pagehandle) => {
    const body = {
      "sections": {
        "main": {
          "type": "apps",
          "blocks": {
            [firstBlockId]: {
              "type": `shopify:\/\/apps\/${app_name}\/blocks\/firstPage\/${extension_uuid}`,
              "settings": {
                "show_header_footer": landing_show_header_footer,
                "campaign_name": campaign_name,
                "background_overlay": landing_background_overlay,
                "main_color": landing_main_color,
                "accent_color": landing_accent_color,
                "layout": landing_divider,
                "background_image": `shopify:\/\/shop_images\/${landing_background_image}`,
                "header_text": landing_header_text,
                "subheader_text": landing_pre_header_text,
                "cta_tag_text": landing_tagline_text,
                "email_text": landing_email_placeholder_text,
                "phone_text": landing_phone_placeholder_text,
                "button_text": landing_button_text,
                "facebook_link": landing_facebook_link,
                "instagram_link": landing_instagram_link,
                "twitter_link": landing_twitter_link,
                "tiktok_link": landing_tiktok_link,
                "snapchat_link": landing_snapchat_link,
                "discord_link": landing_discord_link,
                "base_font_size": landing_base_font_size,
                "page": pagehandle
              }
            }
          },
          "block_order": [
            `${firstBlockId}`
          ],
          "settings": {
          }
        }
      },
      "order": [
        "main"
      ],
    };

    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/2022-10/themes/${themeid}/assets.json`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            asset: {
              key: `templates/page.${templateSuffix}.json`,
              value: JSON.stringify(body),
            },
          }),
        }
      );
      const data = await response.json();
      console.log('Updated template with page handle');
      if (!response.ok) {
        throw new Error(`Failed to update page template: ${data.errors}`);
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // update template2 with first page handle
  const updateSecondPageTemplate = async (templateSuffix, pagehandle) => {
    const body = {
      "sections": {
        "main": {
          "type": "apps",
          "blocks": {
            [secondBlockId]: {
              "type": `shopify:\/\/apps\/${app_name}\/blocks\/secondPage\/${extension_uuid}`,
              "settings": {
                "show_header_footer": rewards_show_header_footer,
                "campaign_name": campaign_name,
                "background_overlay": rewards_background_overlay,
                "main_color": rewards_main_color,
                "accent_color": rewards_accent_color,
                "layout": rewards_divider,
                "background_image": `shopify:\/\/shop_images\/${rewards_background_image}`,
                "preheader_text": rewards_preheader_text,
                "header_text": rewards_header_text,
                "subheader_text": rewards_subheader_text,
                "base_font_size": rewards_base_font_size,
                "icon_dropdown": rewards_image,
                "page": pagehandle
              }
            }
          },
          "block_order": [
            `${secondBlockId}`
          ],
          "settings": {
          }
        }
      },
      "order": [
        "main"
      ],
    };

    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/2022-10/themes/${themeid}/assets.json`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            asset: {
              key: `templates/page.${templateSuffix}.json`,
              value: JSON.stringify(body),
            },
          }),
        }
      );
      const data = await response.json();
      console.log('Updated template with page handle');
      if (!response.ok) {
        throw new Error(`Failed to update page template: ${data.errors}`);
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // ==== open shopify theme editor - pending ====

  // call api functions

  // active theme id
  const themeid = await getActiveThemeId();

  // create templates in active themes
  const template1 = await createFirstPageTemplate(themeid);
  const template2 = await createSecondPageTemplate(themeid);

  // retrieve the name of the created template from the response
  const templateSuffix1 = await template1.asset.key.split('/')[1].split('.')[1];
  const templateSuffix2 = await template2.asset.key.split('/')[1].split('.')[1];

  // pass template suffix to create pages assigned with created templates
  const firstpage_handle = await createFirstPage(templateSuffix1);
  const secondpage_handle = await createSecondPage(templateSuffix2);

  // update templates with page handles returned by create page functions
  await updateFirstPageTemplate(templateSuffix1, secondpage_handle);
  await updateSecondPageTemplate(templateSuffix2, firstpage_handle);
};

// --------------------------------------- API ------------------------------------

export default function createTemplateApiEndpoint(app) {
  app.post("/api/create_template", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { accessToken, shop } = session;
      const { templateData, campaignData } = req.body;
      // console.log(accessToken, shop);
      // console.log(templateData);
      // console.log(campaignData);
      await templateApiCalls(accessToken, shop, templateData, campaignData);
      return res.status(200).json({ success: true, message: "Templates and Pages Created Successfully" });
    } catch (error) {
      return res.status(400).json({ success: false, message: "Failed to Create Templates and Pages", error: error.message });
    }
  });
}
