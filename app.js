let players = [];

document.addEventListener("DOMContentLoaded", () => {
    loadPlayers();
});

async function loadPlayers() {
    try {
        const response = await fetch("players.json");

        if (!response.ok) {
            throw new Error("Unable to load players.json");
        }

        players = await response.json();

        displayPlayers(players);
        setupSearch();
        setupRoleFilter();

    } catch (error) {
        console.error("Player loading error:", error);

        const grid = document.getElementById("playersGrid");

        if (grid) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h3>Unable to load players</h3>
                    <p>Please make sure players.json is available.</p>
                </div>
            `;
        }
    }
}


function displayPlayers(playerList) {
function displayPlayers(playerList) {

    const grid = document.getElementById("playersGrid");

    if (!grid) return;

    grid.innerHTML = "";

    if (playerList.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>No players found</h3>
                <p>Try another search or role.</p>
            </div>
        `;
        return;
    }

    playerList.forEach(player => {

        const playerName =
            player.name ||
            player.Player ||
            "Unknown Player";

        const team =
            player.team ||
            player.Team ||
            "India Women";

        const role =
            player.role ||
            player.Role ||
            "Cricketer";

        const battingStyle =
            player.battingStyle ||
            player.BattingStyle ||
            "Not Available";

        const profileURL =
            `player.html?name=${encodeURIComponent(playerName)}`;

        const initials = getInitials(playerName);


        const card = document.createElement("div");

        card.className = "player-card";

        card.innerHTML = `
            <div class="player-card-image">

                <div class="player-initials">
                    ${initials}
                </div>

                <span class="player-country">
                    🇮🇳 India
                </span>

            </div>

            <div class="player-card-body">

                <span class="player-role">
                    ${role}
                </span>

                <h3>
                    ${playerName}
                </h3>

                <p class="player-style">
                    ${battingStyle}
                </p>

                <div class="player-card-footer">

                    <span class="player-team">
                        ${team}
                    </span>

                    <a
                        href="${profileURL}"
                        class="profile-btn"
                    >
                        View Profile →
                    </a>

                </div>

            </div>
        `;

        grid.appendChild(card);

    });
}

    updatePlayerCount(playerList.length);
}


function getInitials(name) {

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}


function updatePlayerCount(count) {

    const element =
        document.getElementById("playerCount");

    if (element) {
        element.textContent = count;
    }
}


function setupSearch() {

    const searchInput =
        document.getElementById("playerSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", filterPlayers);
}


function setupRoleFilter() {

    const roleFilter =
        document.getElementById("roleFilter");

    if (!roleFilter) return;

    roleFilter.addEventListener("change", filterPlayers);
}


function filterPlayers() {

    const searchInput =
        document.getElementById("playerSearch");

    const roleFilter =
        document.getElementById("roleFilter");

    const searchText =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";

    const selectedRole =
        roleFilter
            ? roleFilter.value.toLowerCase()
            : "all";

    const filteredPlayers =
        players.filter(player => {

            const name =
                (
                    player.name ||
                    player.Player ||
                    ""
                ).toLowerCase();

            const role =
                (
                    player.role ||
                    player.Role ||
                    ""
                ).toLowerCase();

            const matchesSearch =
                name.includes(searchText);

            const matchesRole =
                selectedRole === "all" ||
                role.includes(selectedRole);

            return matchesSearch && matchesRole;
        });

    displayPlayers(filteredPlayers);
}