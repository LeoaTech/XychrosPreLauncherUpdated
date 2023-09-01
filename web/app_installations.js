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
      try {
        let deletedSession = await pool.query(
          `DELETE FROM shopify_sessions where shop = $1 Returning *`,
          [shopDomain]
        );

        console.log(deletedSession, "Recently deleted");
      } catch (err) {
        console.log(err, "Not deleted");
      }
    }
  },
};
