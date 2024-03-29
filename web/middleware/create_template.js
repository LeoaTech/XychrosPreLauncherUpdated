import { Shopify } from '@shopify/shopify-api';
import fetch from 'node-fetch';

const api_version = '2022-10';

// api calls
const templateApiCalls = async (
  accessToken,
  shopURL,
  templateData,
  campaignData
) => {
  // [hardcoded] - please update according to your app for dev purpose only

  const app_name = 'Product Prelauncher';
  const extension_uuid = process.env.SHOPIFY_TEMPLATE_CREATE_ID;

  // extract campaign settings and template settings
  const campaign_name = campaignData.name;

  // landing and reward page links
  const first_page = templateData.first_page || '';
  const second_page = templateData.second_page || '';

  // start of landing template settings

  const landing_show_header_footer = templateData.landing_show_header_footer;
  const landing_background_overlay = templateData.landing_background_overlay;
  const landing_main_color = `#${templateData.landing_main_color}`;
  const landing_accent_color = `#${templateData.landing_accent_color}`;
  const landing_divider = templateData.landing_divider;
  const landing_header_text = templateData.landing_header_text || '';
  const landing_pre_header_text = templateData.landing_pre_header_text || '';
  const landing_tagline_text = templateData.landing_tagline_text || '';
  const landing_email_placeholder_text =
    templateData.landing_email_placeholder_text || '';

  // show phone placeholder only if merchant wants to collect phone number
  let landing_phone_placeholder_text = '';
  if (campaignData.collect_phone == true) {
    landing_phone_placeholder_text =
      templateData.landing_phone_placeholder_text;
  }

  const landing_button_text = templateData.landing_button_text;
  const landing_base_font_size = templateData.landing_base_text_size;

  // end of landing template settings

  // start of rewards template settings

  const rewards_show_header_footer = templateData.rewards_show_header_footer;
  const rewards_background_overlay = templateData.rewards_background_overlay;
  const rewards_main_color = `#${templateData.rewards_main_color}`;
  const rewards_accent_color = `#${templateData.rewards_accent_color}`;
  const rewards_divider = templateData.rewards_divider; // need to be updated in database
  const rewards_preheader_text = templateData.rewards_pre_header_text || '';
  const rewards_header_text = templateData.header_text || '';
  const rewards_subheader_text = templateData.rewards_sub_header_text || '';
  const rewards_base_font_size = templateData.rewards_base_text_size;
  const rewards_image = templateData.rewards_rewards_image;

  // end of reward template settings

  // set headers
  const headers = {
    'X-Shopify-Access-Token': accessToken,
    'Content-Type': 'application/json',
  };

  // generate uuid for template and page names
  const uuid = Math.random().toString(36).substring(2, 15);

  // template 1 body

  // first app block unique_id
  const randomHex1 = () => Math.floor(Math.random() * 16).toString(16);
  let firstBlockId = '';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      firstBlockId += randomHex1();
    }
    firstBlockId += '-';
  }
  firstBlockId += Math.random().toString(36).substring(2, 7);

  const body1 = {
    sections: {
      main: {
        type: 'apps',
        blocks: {
          [firstBlockId]: {
            type: `shopify:\/\/apps\/${app_name}\/blocks\/firstPage\/${extension_uuid}`,
            settings: {
              show_header_footer: landing_show_header_footer,
              campaign_name: campaign_name,
              background_overlay: landing_background_overlay,
              main_color: landing_main_color,
              accent_color: landing_accent_color,
              layout: landing_divider,
              header_text: landing_header_text,
              subheader_text: landing_pre_header_text,
              cta_tag_text: landing_tagline_text,
              email_text: landing_email_placeholder_text,
              phone_text: landing_phone_placeholder_text,
              button_text: landing_button_text,
              base_font_size: landing_base_font_size,
              page: second_page,
            },
          },
        },
        block_order: [`${firstBlockId}`],
        settings: {},
      },
    },
    order: ['main'],
  };

  // template 2 body

  // second app block unique_id
  const randomHex2 = () => Math.floor(Math.random() * 16).toString(16);
  let secondBlockId = '';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      secondBlockId += randomHex2();
    }
    secondBlockId += '-';
  }
  secondBlockId += Math.random().toString(36).substring(2, 7);

  const body2 = {
    sections: {
      main: {
        type: 'apps',
        blocks: {
          [secondBlockId]: {
            type: `shopify:\/\/apps\/${app_name}\/blocks\/secondPage\/${extension_uuid}`,
            settings: {
              show_header_footer: rewards_show_header_footer,
              campaign_name: campaign_name,
              background_overlay: rewards_background_overlay,
              main_color: rewards_main_color,
              accent_color: rewards_accent_color,
              layout: rewards_divider,
              preheader_text: rewards_preheader_text,
              header_text: rewards_header_text,
              subheader_text: rewards_subheader_text,
              base_font_size: rewards_base_font_size,
              icon_dropdown: rewards_image,
              page: first_page,
            },
          },
        },
        block_order: [`${secondBlockId}`],
        settings: {},
      },
    },
    order: ['main'],
  };

  // get active theme id
  const getActiveThemeId = async () => {
    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/${api_version}/themes.json`,
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
    const templateName = 'LandingTemplate'; // base name
    const uniqueTemplateName = templateName + '_' + uuid; // concatenate base name and uuid
    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/${api_version}/themes/${themeid}/assets.json`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            asset: {
              key: `templates/page.${uniqueTemplateName}.json`,
              value: JSON.stringify(body1),
            },
          }),
        }
      );

      const data = await response.json();

      // retrieve and return the name of created template from the response
      const templateName = data.asset.key.split('/')[1].split('.')[1];
      console.log(`Template "${templateName}" Created!`);

      if (!response.ok) {
        throw new Error(`Failed to create page template: ${data.errors}`);
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // create second template
  const createSecondPageTemplate = async (themeid) => {
    const templateName = 'RewardsTemplate'; // base name
    const uniqueTemplateName = templateName + '_' + uuid; // concatenate base name and uuid
    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/${api_version}/themes/${themeid}/assets.json`,
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

      // retrieve and return the name of created template from the response
      const templateName = data.asset.key.split('/')[1].split('.')[1];
      console.log(`Template "${templateName}" Created!`);

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
    const pageName = 'LandingPage'; // base name
    const uniquePageeName = pageName + '_' + uuid; // concatenate base name and uuid
    const pageBody = JSON.stringify({
      page: {
        title: uniquePageeName,
        template_suffix: templateSuffix,
      },
    });

    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/${api_version}/pages.json`,
        {
          method: 'POST',
          headers,
          body: pageBody,
        }
      );
      const data = await response.json();
      console.log(`Page "${data.page.handle}" Created!`);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // create second page
  const createSecondPage = async (templateSuffix) => {
    const pageName = 'RewardsPage'; // base name
    const uniquePageeName = pageName + '_' + uuid; // concatenate base name and uuid
    const pageBody = JSON.stringify({
      page: {
        title: uniquePageeName,
        template_suffix: templateSuffix,
      },
    });

    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/${api_version}/pages.json`,
        {
          method: 'POST',
          headers,
          body: pageBody,
        }
      );
      const data = await response.json();
      console.log(`Page "${data.page.handle}" Created!`);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // update template1 with second page handle
  const updateFirstPageTemplate = async (templateSuffix, pagehandle) => {
    const body = {
      sections: {
        main: {
          type: 'apps',
          blocks: {
            [firstBlockId]: {
              type: `shopify:\/\/apps\/${app_name}\/blocks\/firstPage\/${extension_uuid}`,
              settings: {
                show_header_footer: landing_show_header_footer,
                campaign_name: campaign_name,
                background_overlay: landing_background_overlay,
                main_color: landing_main_color,
                accent_color: landing_accent_color,
                layout: landing_divider,
                header_text: landing_header_text,
                subheader_text: landing_pre_header_text,
                cta_tag_text: landing_tagline_text,
                email_text: landing_email_placeholder_text,
                phone_text: landing_phone_placeholder_text,
                button_text: landing_button_text,
                base_font_size: landing_base_font_size,
                page: pagehandle,
              },
            },
          },
          block_order: [`${firstBlockId}`],
          settings: {},
        },
      },
      order: ['main'],
    };

    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/${api_version}/themes/${themeid}/assets.json`,
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
      console.log('Updated Template1 with second Page Handle');
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
      sections: {
        main: {
          type: 'apps',
          blocks: {
            [secondBlockId]: {
              type: `shopify:\/\/apps\/${app_name}\/blocks\/secondPage\/${extension_uuid}`,
              settings: {
                show_header_footer: rewards_show_header_footer,
                campaign_name: campaign_name,
                background_overlay: rewards_background_overlay,
                main_color: rewards_main_color,
                accent_color: rewards_accent_color,
                layout: rewards_divider,
                preheader_text: rewards_preheader_text,
                header_text: rewards_header_text,
                subheader_text: rewards_subheader_text,
                base_font_size: rewards_base_font_size,
                icon_dropdown: rewards_image,
                page: pagehandle,
              },
            },
          },
          block_order: [`${secondBlockId}`],
          settings: {},
        },
      },
      order: ['main'],
    };

    try {
      const response = await fetch(
        `https://${shopURL}/admin/api/${api_version}/themes/${themeid}/assets.json`,
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
      console.log('Updated Template2 with first Page Handle');
      if (!response.ok) {
        throw new Error(`Failed to update page template: ${data.errors}`);
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // call api functions

  // active theme id
  const themeid = await getActiveThemeId();

  // create templates in active themes
  const template1 = await createFirstPageTemplate(themeid);
  const template2 = await createSecondPageTemplate(themeid);

  // pass template suffix to create pages assigned with created templates
  const templateSuffix1 = template1.asset.key.split('/')[1].split('.')[1];
  const templateSuffix2 = template2.asset.key.split('/')[1].split('.')[1];

  const firstpage = await createFirstPage(templateSuffix1);
  const secondpage = await createSecondPage(templateSuffix2);

  // update templates with page handles returned by create page functions
  const firstpage_handle = firstpage.page.handle;
  const secondpage_handle = secondpage.page.handle;

  await updateFirstPageTemplate(templateSuffix1, secondpage_handle);
  await updateSecondPageTemplate(templateSuffix2, firstpage_handle);

  // retrieve template ids
  const landing_template_key = template1.asset.key;
  const rewards_template_key = template2.asset.key;

  // generate template links to be opened in shopify theme editor
  const landingTemplateLink = `https://${shopURL}/admin/themes/${themeid}/editor?previewPath=${encodeURIComponent(
    '/pages/' + firstpage_handle
  )}`;
  const rewardsTemplateLink = `https://${shopURL}/admin/themes/${themeid}/editor?previewPath=${encodeURIComponent(
    '/pages/' + secondpage_handle
  )}`;

  // retrieve page ids
  const landing_page_id = firstpage.page.id;
  const rewards_page_id = secondpage.page.id;

  // generate page links
  const landingPageLink = `https://${shopURL}/pages/${firstpage_handle}`;
  const rewardsPageLink = `https://${shopURL}/pages/${secondpage_handle}`;

  // return campaign details
  const campaignDetails = {
    campaign_name: campaignData.name,
    theme_id: themeid,
    landing_template_key: landing_template_key,
    landing_template_link: landingTemplateLink,
    landing_page_id: landing_page_id,
    landing_page_link: landingPageLink,
    rewards_template_key: rewards_template_key,
    rewards_template_link: rewardsTemplateLink,
    rewards_page_id: rewards_page_id,
    rewards_page_link: rewardsPageLink,
  };

  return campaignDetails;
};

// --------------------------------------- API ------------------------------------

export default function createTemplateApiEndpoint(app) {
  app.post('/api/create_template', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get('use-online-tokens')
      );
      const { accessToken, shop } = session;
      const { templateData, campaignData } = req.body;
      // console.log(accessToken, shop);
      // console.log(templateData);
      // console.log(campaignData);
      const campaign_details = await templateApiCalls(
        accessToken,
        shop,
        templateData,
        campaignData
      );
      return res.status(200).json({
        success: true,
        data: campaign_details,
        message: 'Templates and Pages Created Successfully',
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to Create Templates and Pages',
        error: error.message,
      });
    }
  });
}
