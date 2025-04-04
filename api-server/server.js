const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const app = express();
app.use(cors());

const USERS = {
  "user-free": { plan: "free", limit: 50 },
  "user-pro": { plan: "pro", limit: 500 },
  "user-enterprise": { plan: "enterprise", limit: Infinity }
};

const apiLimiter = rateLimit({
  windowMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  max: (req) => USERS[req.headers["x-api-key"]]?.limit || 0,
  message: "Upgrade your plan to continue using the service."
});

app.post("/generate", apiLimiter, async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  if (!USERS[apiKey]) return res.status(403).json({ error: "Invalid API Key" });

  // Call AI function here
  res.json({ message: "Generated AI commit message" });
});

app.listen(3000, () => console.log("API running on port 3000"));
