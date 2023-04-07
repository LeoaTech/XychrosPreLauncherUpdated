import axios from "axios";

// Axios to make API Call for Klaviyo-list-keys
export default function integrationApi(app) {
  app.get("/api/lists", async (req, res) => {
    const apiKey = req.query.apiKey;
    if (!apiKey) {
      res.status(400).send("Missing API key");
      return;
    }

    try {
      const list = await axios.get(
        `https://a.klaviyo.com/api/v2/lists?api_key=${apiKey}`
      );
      res.status(200).send(list?.data);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  });
}
