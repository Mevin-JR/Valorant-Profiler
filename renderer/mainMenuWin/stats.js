function getStatsPageLayout() {
    return `
        
    `;
}

function loadStats() {
    const titleContainer = document.querySelector(".main__title-container");
    const title = "<h1>Stats</h1>";
    titleContainer.innerHTML = title;

    const contentContainer = document.querySelector(".main__content");
    contentContainer.innerHTML = "";
}

module.exports = {
    loadStats,
};
