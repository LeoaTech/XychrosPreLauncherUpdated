import { Shopify } from '@shopify/shopify-api';
export default function getrevenuedetails(app) {
  app.get("/api/totalrevenue", async (req, res, next) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { accessToken, shop } = session;
      const response = await fetch(
        `https://${shop}/admin/api/2023-04/orders.json?fields=created_at,id,name,total-price`,
        {
          method: "GET",
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      const totalrevenue = 0;
      data.orders.forEach((element) => {
        totalrevenue += element.total_price;
      });
      return res.status(200).json({ success: true, message: totalrevenue });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server error occurred" });
    }
  });
}
