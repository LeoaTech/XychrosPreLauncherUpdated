  app.get("/api/lastSixmonthsdata", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { id, shop } = session;
      const data = await pool.query(
        "SELECT COUNT(id),date_trunc('month', created_at) AS created_month from clicks where created_at >  CURRENT_DATE - INTERVAL '6 months' AND shop=$1 GROUP BY created_month ORDER BY created_month ASC",
        [shop]
      );
      return res.status(200).json({ success: true, data: data.rows });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Server error occurred" });
    }
  });
