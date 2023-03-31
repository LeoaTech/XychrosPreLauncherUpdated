import { Shopify } from '@shopify/shopify-api';
import fetch from 'node-fetch';

// import createApp from '@shopify/app-bridge';
// import { getSessionToken } from '@shopify/app-bridge-utils';
// import { assetForTheme } from '@shopify/koa-shopify-graphql-proxy';


import NewPool from 'pg';
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/prelauncher',

});

// api calls
const admin_apis = async (accessToken) => {
    const shopURL = 'sky2-dev.myshopify.com/';
    const shopOrigin = `https://${shopURL}`
    const headers = {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
    };


  const body1 = {
    sections: {
      '16782598035f2c71dc': {
        type: 'apps',
        blocks: {
          '1f56808c-7911-47a3-b9bd-a3d30ae5a1d9': {
            type: 'shopify://apps/updated-xychros-app/blocks/firstPage/990d48eb-16d0-4af0-b902-f323ed2bbfab',
            settings: {
              show_header_footer: true,
              background_color:
                'linear-gradient(137deg, rgba(0, 0, 0, 0) 100%, rgba(167, 144, 140, 0) 100%)',
              main_color: '#ffffff',
              accent_color: '#000000',
              layout: 'none',
              background: 'shopify://shop_images/nature2.png',
              header_text: 'Designing the Future',
              subheader_text: '',
              cta_tag_text: '',
              email_text: 'Email',
              phone_text: 'Phone Number',
              button_text: 'Take me too!',
              base_font_size: 24,
              text_layout: 'center',
              page: '',
            },
          },
        },
        block_order: ['1f56808c-7911-47a3-b9bd-a3d30ae5a1d9'],
        settings: {},
      },
    },
    order: ['16782598035f2c71dc'],
  };

  const body2 = {
    sections: {
      '16798296089bba316e': {
        type: 'apps',
        blocks: {
          '7efbe0eb-f9b3-4f16-af27-f262dbcc5fbc': {
            type: 'shopify://apps/updated-xychros-app/blocks/secondPage/990d48eb-16d0-4af0-b902-f323ed2bbfab',
            settings: {
              show_header_footer: true,
              background_color:
                'linear-gradient(137deg, rgba(0, 0, 0, 0) 100%, rgba(167, 144, 140, 0) 100%)',
              main_color: '#ffffff',
              accent_color: '#000000',
              layout: 'nonehorizontal',
              background: 'shopify://shop_images/nature2.png',
              preheader_text: '',
              header_text: 'Your Product',
              subheader_text:
                'Share your unique link via email, Facebook or Twitter and earn goodies for each friend who signs up!',
              base_font_size: 24,
              text_layout: 'center',
              icon_dropdown: 'image-9',
            },
          },
        },
        block_order: ['7efbe0eb-f9b3-4f16-af27-f262dbcc5fbc'],
        settings: {},
      },
    },
    order: ['16798296089bba316e'],
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

  // first template
  const createFirstPageTemplate = async (themeid) => {
    const templateName = 'prelaunchTemplate';
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
              value: JSON.stringify(body1),
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

  // second template

  const createSecondPageTemplate = async (themeid) => {
    const templateName = 'rewardsTemplate';
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

  // first page

  const createFirstPage = async (templateSuffix) => {
    const pageName = 'prelaunchPage';
    const randomString = Math.random().toString(36).substring(2, 15); // generate random string
    const uniquePageeName = pageName + '_' + randomString; // concatenate base name and random string
    const pageBody = JSON.stringify({
      page: {
        title: `${uniquePageeName}`,
        template_suffix: templateSuffix,
      },
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

  // second page

  const createSecondPage = async (templateSuffix) => {
    const pageName = 'rewardsPage';
    const randomString = Math.random().toString(36).substring(2, 15); // generate random string
    const uniquePageeName = pageName + '_' + randomString; // concatenate base name and random string
    const pageBody = JSON.stringify({
      page: {
        title: `${uniquePageeName}`,
        template_suffix: templateSuffix,
      },
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
      sections: {
        '16782598035f2c71dc': {
          type: 'apps',
          blocks: {
            '1f56808c-7911-47a3-b9bd-a3d30ae5a1d9': {
              type: 'shopify://apps/updated-xychros-app/blocks/firstPage/990d48eb-16d0-4af0-b902-f323ed2bbfab',
              settings: {
                show_header_footer: true,
                background_color:
                  'linear-gradient(137deg, rgba(0, 0, 0, 0) 100%, rgba(167, 144, 140, 0) 100%)',
                main_color: '#ffffff',
                accent_color: '#000000',
                layout: 'none',
                background: 'shopify://shop_images/nature2.png',
                header_text: 'Designing the Future',
                subheader_text: '',
                cta_tag_text: '',
                email_text: 'Email',
                phone_text: 'Phone Number',
                button_text: 'Take me too!',
                base_font_size: 24,
                text_layout: 'center',
                page: `${pagehandle}`,
              },
            },
          },
          block_order: ['1f56808c-7911-47a3-b9bd-a3d30ae5a1d9'],
          settings: {},
        },
      },
      order: ['16782598035f2c71dc'],
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
      sections: {
        '16798296089bba316e': {
          type: 'apps',
          blocks: {
            '7efbe0eb-f9b3-4f16-af27-f262dbcc5fbc': {
              type: 'shopify://apps/updated-xychros-app/blocks/secondPage/990d48eb-16d0-4af0-b902-f323ed2bbfab',
              settings: {
                show_header_footer: true,
                background_color:
                  'linear-gradient(137deg, rgba(0, 0, 0, 0) 100%, rgba(167, 144, 140, 0) 100%)',
                main_color: '#ffffff',
                accent_color: '#000000',
                layout: 'nonehorizontal',
                background: 'shopify://shop_images/nature2.png',
                preheader_text: '',
                header_text: 'Your Product',
                subheader_text:
                  'Share your unique link via email, Facebook or Twitter and earn goodies for each friend who signs up!',
                base_font_size: 24,
                text_layout: 'center',
                icon_dropdown: 'image-9',
                page: `${pagehandle}`,
              },
            },
          },
          block_order: ['7efbe0eb-f9b3-4f16-af27-f262dbcc5fbc'],
          settings: {},
        },
      },
      order: ['16798296089bba316e'],
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

  // ==== open shopify theme editor-pending ====

  const themeid = await getActiveThemeId();
  const template1 = await createFirstPageTemplate(themeid);
  const template2 = await createSecondPageTemplate(themeid);

  // retrieve the name of the created template from the response
  const templateSuffix1 = await template1.asset.key.split('/')[1].split('.')[1];
  const templateSuffix2 = await template2.asset.key.split('/')[1].split('.')[1];

  // retrive page handles
  const firstpage = await createFirstPage(templateSuffix1);
  const secondpage = await createSecondPage(templateSuffix2);

  // update templates with page handles

  await updateFirstPageTemplate(templateSuffix1, secondpage);
  await updateSecondPageTemplate(templateSuffix2, firstpage);
};

// --------------------------------------- TEMPLATE API ------------------------------------

export default function create_template(app) {
  app.get('/api/create_template', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get('use-online-tokens')
      );
      const { shop } = session;
      const data = await pool.query(
        'SELECT accesstoken FROM shopify_sessions WHERE shop=$1',
        [shop]
      );

      if (data.rows.length > 0) {
        await admin_apis(data.rows[0].accesstoken);
        return res
          .status(200)
          .json({ success: true, message: data.rows[0].accesstoken });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Access token not found' });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: 'Something went wrong' });
    }
  });
}
