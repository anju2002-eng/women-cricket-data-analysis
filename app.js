const csvFile = "women_cricket_data.csv";

let players = [];

document.addEventListener("DOMContentLoaded", () => {
    loadPlayerData();

    // Refresh dashboard every 30 seconds
    setInterval(loadPlayerData, 30000);
});

async function loadPlayerData() {
    try {
        const response = await fetch(csvFile);

        if (!response.ok) {
            throw new Error("CSV file not found");
        }

        const csvText = await response.text();

        players = parseCSV(csvText);

        calculateStatistics(players);
        displayPlayers(players);
        displayTeamStatistics(players);

    } catch (error) {
        console.error("Data loading error:", error);
    }
}

function parseCSV(text) {
    const lines = text.trim().split("\n");

    const headers = lines[0]
        .split(",")
        .map(header => header.trim());

    return lines.slice(1).map(line => {

        const values = line.split(",");

        const player = {};

        headers.forEach((header, index) => {
            player[header] = values[index]
                ? values[index].trim()
                : "";
        });

        return player;
    });
}

function calculateStatistics(data) {

    data.forEach(player => {

        const runs = Number(player.Runs) || 0;
        const innings = Number(player.Innings) || 0;
        const notOut = Number(player.NotOut) || 0;

        const dismissals = innings - notOut;

        if (dismissals > 0) {
            player.Average = (runs / dismissals).toFixed(2);
        } else {
            player.Average = runs.toFixed(2);
        }

        player.Matches = Number(player.Matches) || 0;
        player.Wickets = Number(player.Wickets) || 0;

    });
}

function displayPlayers(data) {

    const tableBody = document.getElementById("playerTableBody");

    if (!tableBody) {
        console.warn("playerTableBody not found");
        return;
    }

    tableBody.innerHTML = "";

    data.forEach(player => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${player.Player}</td>
            <td>${player.Format}</td>
            <td>${player.Matches}</td>
            <td>${player.Runs}</td>
            <td>${player.Wickets}</td>
            <td>${player.Average}</td>
            <td>${player.StrikeRate}</td>
        `;

        tableBody.appendChild(row);
    });
}

function displayTeamStatistics(data) {

    const matches = data.reduce(
        (total, player) => total + (Number(player.Matches) || 0),
        0
    );

    const runs = data.reduce(
        (total, player) => total + (Number(player.Runs) || 0),
        0
    );

    const wickets = data.reduce(
        (total, player) => total + (Number(player.Wickets) || 0),
        0
    );

    const matchesElement = document.getElementById("totalMatches");
    const runsElement = document.getElementById("totalRuns");
    const wicketsElement = document.getElementById("totalWickets");

    if (matchesElement) {
        matchesElement.textContent = matches;
    }

    if (runsElement) {
        runsElement.textContent = runs;
    }

    if (wicketsElement) {
        wicketsElement.textContent = wickets;
    }
}