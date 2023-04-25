export default function getUrlApi(app) {
  app.get("/api/geturl", async (req, res) => {
    try {
      const { file } = req.query;
      const imageUrl = `/assets/shopify_assets/${file}`;
      const imagePath = imageUrl?.substring(imageUrl?.indexOf("/web"));
      res.status(200).send({ url: imagePath });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  });
}
