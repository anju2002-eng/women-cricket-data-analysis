const csvFile = "women_cricket_data.csv";

let players = [];

document.addEventListener("DOMContentLoaded", () => {

    loadPlayers();

    const searchBox =
        document.getElementById("searchPlayer");

    const roleFilter =
        document.getElementById("roleFilter");


    searchBox.addEventListener("input", filterPlayers);

    roleFilter.addEventListener("change", filterPlayers);

});


/* =========================
   LOAD CSV
========================= */

async function loadPlayers() {

    try {

        const response = await fetch(csvFile);

        if (!response.ok) {
            throw new Error("CSV file not found");
        }

        const text = await response.text();

        players = parseCSV(text);

        displayPlayers(players);

    }

    catch (error) {

        console.error(error);

        document.getElementById("playersGrid").innerHTML = `
            <div class="error-message">
                Unable to load player data.
            </div>
        `;

    }

}


/* =========================
   CSV PARSER
========================= */

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


/* =========================
   DISPLAY PLAYERS
========================= */

function displayPlayers(data) {

    const grid =
        document.getElementById("playersGrid");

    const count =
        document.getElementById("playerCount");

    const noResult =
        document.getElementById("noResult");


    grid.innerHTML = "";

    count.textContent = data.length;


    if (data.length === 0) {

        noResult.style.display = "block";

        return;

    }

    noResult.style.display = "none";


    data.forEach(player => {

        const card =
            document.createElement("article");

        card.className = "player-card";


        const playerName =
            player.Player || "Unknown Player";


        const initials =
            getInitials(playerName);


        const profileURL =
            `player.html?name=${encodeURIComponent(playerName)}`;


        card.innerHTML = `

            <div class="player-photo">

                <div class="player-initials">
                    ${initials}
                </div>

                <span class="country-badge">
                    🇮🇳
                </span>

            </div>


            <div class="player-info">

                <span class="player-role">
                    ${player.Role || "India Women"}
                </span>

                <h3>
                    ${playerName}
                </h3>

                <p>
                    ${player.Team || "India"}
                </p>


                <div class="mini-stats">

                    <div>
                        <strong>
                            ${player.Matches || 0}
                        </strong>

                        <span>
                            Matches
                        </span>
                    </div>


                    <div>
                        <strong>
                            ${player.Runs || 0}
                        </strong>

                        <span>
                            Runs
                        </span>
                    </div>


                    <div>
                        <strong>
                            ${player.Wickets || 0}
                        </strong>

                        <span>
                            Wickets
                        </span>
                    </div>

                </div>


                <a
                    href="${profileURL}"
                    class="profile-button">

                    View Profile
                    <span>→</span>

                </a>

            </div>

        `;


        grid.appendChild(card);

    });

}


/* =========================
   SEARCH + FILTER
========================= */

function filterPlayers() {

    const search =
        document
        .getElementById("searchPlayer")
        .value
        .toLowerCase();


    const role =
        document
        .getElementById("roleFilter")
        .value;


    const filtered =
        players.filter(player => {

            const name =
                (player.Player || "")
                .toLowerCase();


            const playerRole =
                player.Role || "";


            const matchesSearch =
                name.includes(search);


            const matchesRole =
                role === "all" ||
                playerRole === role;


            return matchesSearch &&
                   matchesRole;

        });


    displayPlayers(filtered);

}


/* =========================
   INITIALS
========================= */

function getInitials(name) {

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

}