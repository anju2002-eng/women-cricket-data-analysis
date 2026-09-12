const csvFile = "women_cricket_data.csv";

let players = [];


document.addEventListener("DOMContentLoaded", () => {

    loadPlayerData();

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

        displayStatistics(players);

        displayTopPerformer(players);

    }

    catch (error) {

        console.error(
            "Data loading error:",
            error
        );

    }

}



function parseCSV(text) {

    const lines =
        text.trim().split(/\r?\n/);

    const headers =
        lines[0]
        .split(",")
        .map(h => h.trim());


    return lines.slice(1).map(line => {

        const values = line.split(",");

        const player = {};

        headers.forEach(
            (header, index) => {

                player[header] =
                    values[index]
                    ? values[index].trim()
                    : "";

            }
        );

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
                (runs / dismissals)
                .toFixed(2);

        }
        else {

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
        document.getElementById(
            "playerTableBody"
        );


    if (!tableBody) return;


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



function displayStatistics(data) {

    const totalPlayers =
        data.length;


    const totalRuns =
        data.reduce(
            (total, player) =>
                total +
                (Number(player.Runs) || 0),
            0
        );


    const totalWickets =
        data.reduce(
            (total, player) =>
                total +
                (Number(player.Wickets) || 0),
            0
        );


    document.getElementById(
        "totalMatches"
    ).textContent = totalPlayers;


    document.getElementById(
        "totalRuns"
    ).textContent = totalRuns;


    document.getElementById(
        "totalWickets"
    ).textContent = totalWickets;

}



function displayTopPerformer(data) {

    if (data.length === 0) return;


    const sorted =
        [...data].sort(
            (a, b) =>
                (Number(b.Runs) || 0) -
                (Number(a.Runs) || 0)
        );


    const top =
        sorted[0];


    document.getElementById(
        "topPlayer"
    ).textContent =
        top.Player.split(" ")[0];


    document.getElementById(
        "performerName"
    ).textContent =
        top.Player;


    document.getElementById(
        "performerRuns"
    ).textContent =
        top.Runs;


    document.getElementById(
        "performerAverage"
    ).textContent =
        top.Average;


    document.getElementById(
        "performerSR"
    ).textContent =
        top.StrikeRate;

}



function scrollToPlayers() {

    document.getElementById(
        "players"
    ).scrollIntoView({
        behavior: "smooth"
    });

}