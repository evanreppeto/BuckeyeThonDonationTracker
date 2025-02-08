import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

let lastRequestTime = 0;

app.get("/api/donations", async (req, res) => {
    const now = Date.now();

    if (now - lastRequestTime < 10000) {
        return res.status(429).json({ error: "Rate limit hit, please wait" });
    }

    lastRequestTime = now;

    try {
        const response = await fetch("https://events.dancemarathon.com/api/events/6102/donations?limit=5");
        if (response.status === 429) {
            return res.status(429).json({ error: "API rate limit reached" });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch donations" });
    }
});

app.listen(5000, () => console.log("✅ Proxy server running on port 5000"));