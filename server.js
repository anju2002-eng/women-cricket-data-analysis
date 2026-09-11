const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = 3000;

app.use(express.static(__dirname));

app.get("/api/live", async (req, res) => {

    try {

        const response = await axios.get(
            "https://api.cricapi.com/v1/currentMatches",
            {
                params: {
                    apikey: process.env.CRICKET_API_KEY,
                    offset: 0
                }
            }
        );

        const matches = response.data.data || [];

        const indiaWomenMatches = matches.filter(match => {

            const team1 = match.teamInfo?.[0]?.name || "";
            const team2 = match.teamInfo?.[1]?.name || "";

            return (
                team1.toLowerCase().includes("india") ||
                team2.toLowerCase().includes("india")
            );
        });

        res.json({
            success: true,
            matches: indiaWomenMatches
        });

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch live cricket data"
        });
    }
});

app.listen(PORT, () => {

    console.log("--------------------------------");
    console.log("India Women Cricket Dashboard");
    console.log("--------------------------------");
    console.log(`Server running at: http://localhost:${PORT}`);
});