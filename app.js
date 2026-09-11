const csvFile = "women_cricket_data.csv";

let players = [];

document.addEventListener("DOMContentLoaded", () => {
    loadPlayerData();
});

async function loadPlayerData() {
    try {
        console.log("Loading CSV...");

        const response = await fetch(csvFile);

        if (!response.ok) {
            throw new Error("CSV file not found");
        }

        const csvText = await response.text();

        console.log("CSV loaded successfully");
        console.log(csvText);

        players = parseCSV(csvText);

        console.log("Players:", players);

        calculateStatistics(players);
        displayPlayers(players);
        displayTeamStatistics(players);

    } catch (error) {
        console.error("Data loading error:", error);
    }
}


function parseCSV(text) {

    const lines = text
        .trim()
        .split(/\r?\n/);

    const headers = lines[0]
        .split(",")
        .map(header => header.trim());

    return lines.slice(1).map(line => {

        const values = line.split(",");

        const player = {};

        headers.forEach((header, index) => {

            player[header] =
                values[index]
                    ? values[index].trim()
                    : "";

        });

        return player;
    });
}


function calculateStatistics(data) {

    data.forEach(player => {

        const runs =
            Number(player.Runs) || 0;

        const innings =
            Number(player.Innings) || 0;

        const notOut =
            Number(player.NotOut) || 0;

        const dismissals =
            innings - notOut;

        if (dismissals > 0) {

            player.Average =
                (runs / dismissals).toFixed(2);

        } else {

            player.Average =
                runs.toFixed(2);
        }

        player.Matches =
            Number(player.Matches) || 0;

        player.Wickets =
            Number(player.Wickets) || 0;
    });
}


function displayPlayers(data) {

    const tableBody =
        document.getElementById("playerTableBody");

    if (!tableBody) {

        console.error(
            "playerTableBody not found"
        );

        return;
    }

    tableBody.innerHTML = "";

    data.forEach(player => {

        const row =
            document.createElement("tr");

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

    const matchesElement =
        document.getElementById("totalMatches");

    const runsElement =
        document.getElementById("totalRuns");

    const wicketsElement =
        document.getElementById("totalWickets");


    const runs =
        data.reduce(
            (total, player) =>
                total + (Number(player.Runs) || 0),
            0
        );


    const wickets =
        data.reduce(
            (total, player) =>
                total + (Number(player.Wickets) || 0),
            0
        );


    const matches =
        data.length;


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