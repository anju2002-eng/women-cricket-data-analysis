const csvFile = "women_cricket_data.csv";


document.addEventListener("DOMContentLoaded", () => {

    setupTabs();

    loadPlayerProfile();

});


/* =========================
   GET PLAYER NAME
========================= */

function getPlayerNameFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("name");

}


/* =========================
   LOAD PLAYER
========================= */

async function loadPlayerProfile() {

    try {

        const playerName =
            getPlayerNameFromURL();


        if (!playerName) {

            showError(
                "No player selected."
            );

            return;

        }


        const response =
            await fetch(csvFile);


        if (!response.ok) {

            throw new Error(
                "CSV file not found"
            );

        }


        const text =
            await response.text();


        const players =
            parseCSV(text);


        const player =
            players.find(
                p =>
                    p.Player &&
                    p.Player.toLowerCase()
                    === playerName.toLowerCase()
            );


        if (!player) {

            showError(
                "Player not found."
            );

            return;

        }


        displayPlayer(player);

    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to load player profile."
        );

    }

}


/* =========================
   CSV PARSER
========================= */

function parseCSV(text) {

    const lines =
        text
        .trim()
        .split(/\r?\n/);


    const headers =
        lines[0]
        .split(",")
        .map(
            header => header.trim()
        );


    return lines
        .slice(1)
        .map(line => {

            const values =
                line.split(",");

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


/* =========================
   DISPLAY PLAYER
========================= */

function displayPlayer(player) {

    const name =
        player.Player || "Unknown Player";


    const role =
        player.Role || "Cricketer";


    const team =
        player.Team || "India Women";


    const format =
        player.Format || "International";


    /* HERO */

    setText(
        "playerName",
        name
    );


    setText(
        "playerRole",
        role
    );


    setText(
        "playerTeam",
        team
    );


    setText(
        "battingStyle",
        role
    );


    /* INITIALS */

    setText(
        "playerInitials",
        getInitials(name)
    );


    /* QUICK STATS */

    setText(
        "quickMatches",
        player.Matches || "0"
    );


    setText(
        "quickRuns",
        player.Runs || "0"
    );


    setText(
        "quickAverage",
        player.Average || "0"
    );


    setText(
        "quickStrikeRate",
        player.StrikeRate || "0"
    );


    /* OVERVIEW */

    setText(
        "infoName",
        name
    );


    setText(
        "infoTeam",
        team
    );


    setText(
        "infoRole",
        role
    );


    setText(
        "infoFormat",
        format
    );


    setText(
        "infoBatting",
        role
    );


    setText(
        "infoHighest",
        player.HighestScore || "-"
    );


    setText(
        "aboutTitle",
        name
    );


    setText(
        "aboutText",

        `${name} represents ${team}
        as a ${role}. The profile currently
        displays statistics available in the
        cricket database.`
    );


    /* STATS */

    setText(
        "statFormat",
        format
    );


    setText(
        "statMatches",
        player.Matches || "0"
    );


    setText(
        "statInnings",
        player.Innings || "0"
    );


    setText(
        "statRuns",
        player.Runs || "0"
    );


    setText(
        "statAverage",
        player.Average || "0"
    );


    setText(
        "statStrike",
        player.StrikeRate || "0"
    );


    setText(
        "statFifties",
        player.Fifties || "0"
    );


    setText(
        "statHundreds",
        player.Hundreds || "0"
    );


    setText(
        "statHighest",
        player.HighestScore || "0"
    );


    setText(
        "statWickets",
        player.Wickets || "0"
    );


    /* PAGE TITLE */

    document.title =
        `${name} | India Women Cricket`;

}


/* =========================
   TABS
========================= */

function setupTabs() {

    const tabs =
        document.querySelectorAll(
            ".profile-tab"
        );


    const contents =
        document.querySelectorAll(
            ".tab-content"
        );


    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.dataset.tab;


                tabs.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                contents.forEach(
                    content =>
                        content.classList.remove(
                            "active"
                        )
                );


                tab.classList.add(
                    "active"
                );


                const targetContent =
                    document.getElementById(
                        target
                    );


                if (targetContent) {

                    targetContent.classList.add(
                        "active"
                    );

                }

            }
        );

    });

}


/* =========================
   HELPERS
========================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;

    }

}


function getInitials(name) {

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

}


function showError(message) {

    document.querySelector(
        ".profile-page"
    ).innerHTML = `

        <div class="empty-section">

            <div>⚠️</div>

            <h2>
                ${message}
            </h2>

            <p>
                Please go back and select
                a player.
            </p>

            <a
                href="players.html"
                class="profile-button"
            >
                Back to Players
            </a>

        </div>

    `;

}