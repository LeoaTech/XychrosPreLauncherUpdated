import { Shopify } from "@shopify/shopify-api";
import NewPool from "pg";

const { Pool } = NewPool;
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}`,
});

export const AppInstallations = {
  includes: async function (shopDomain) {
    const shopSessions =
      await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shopDomain);

    if (shopSessions?.length > 0) {
      for (const session of shopSessions) {
        if (session.accessToken) return true;
      }
    }

    return false;
  },

  delete: async function (shopDomain) {
    const shopSessions =
      await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shopDomain);

    if (shopSessions.length > 0) {
      await Shopify.Context.SESSION_STORAGE.deleteSessions(
        shopSessions.map((session) => session.id)
      );

      // Delete All data from db related to shop_url
      try {
        await pool.query(`DELETE FROM subscriptions_list WHERE shop_id = $1`, [
          shopDomain,
        ]);
        await pool.query(
          `DELETE FROM shopify_sessions where shop = $1 Returning *`,
          [shopDomain]
        );

        console.log("Successfully deleted from db");
      } catch (err) {
        console.log(err, "Not deleted");
      }
    }
  },
};
