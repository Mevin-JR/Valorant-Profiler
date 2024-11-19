// Loader hide/unhide
const loaderContainer = document.querySelector(".overlay__loader-container");
const loaderDescription = document.querySelector(
    ".overlay__loader-description"
);

function showLoading(msg = "") {
    loaderContainer.style.display = "flex";
    loaderDescription.textContent = msg;
    loaderDescription.style.display = "block";
}

function hideLoading() {
    loaderContainer.style.display = "none";
    loaderDescription.style.display = "none";
}

function setRankColor(accountRankContainer, rank) {
    if (rank.includes("Iron")) {
        accountRankContainer.style.color = "#FDFDFD";
        accountRankContainer.style.backgroundColor = "#787775";
    } else if (rank.includes("Bronze")) {
        accountRankContainer.style.color = "#54370A";
        accountRankContainer.style.backgroundColor = "#A58642";
    } else if (rank.includes("Silver")) {
        accountRankContainer.style.color = "#FDFDFD";
        accountRankContainer.style.backgroundColor = "#464B4E";
    } else if (rank.includes("Gold")) {
        accountRankContainer.style.color = "#F4EEAE";
        accountRankContainer.style.backgroundColor = "#CC8818";
    } else if (rank.includes("Platinum")) {
        accountRankContainer.style.color = "#29747F";
        accountRankContainer.style.backgroundColor = "#52CDDD";
    } else if (rank.includes("Diamond")) {
        accountRankContainer.style.color = "#F195F4";
        accountRankContainer.style.backgroundColor = "#946BD2";
    } else if (rank.includes("Ascendant")) {
        accountRankContainer.style.color = "#B6FFD7";
        accountRankContainer.style.backgroundColor = "#228052";
    } else if (rank.includes("Immortal")) {
        accountRankContainer.style.color = "#E8C3A8";
        accountRankContainer.style.backgroundColor = "#C3324E";
    } else if (rank.includes("Radiant")) {
        accountRankContainer.style.color = "#E39C41";
        accountRankContainer.style.backgroundColor = "#FFFFB4";
    }
}

// TODO: Complete the fav icon functionality, where the fuck is it
// TODO: Transform div buttons to actual buttons
// TODO: Assign an ID to each button (for faster access)

let renderedUserProfiles = [];

function getCardHTML(profile) {
    return `
            <div class="card__action-required">
                <span>Action Required</span>
                <p>Account name or tag has been changed, if so please update it manually</p>
            </div>
            <div class="card__bg-blur"></div>
            <div class="card__bg-img">
                <img src="${profile.cardImg}">
            </div>
            <div class="card__left-container">
                <span class="card__profile-level">${profile.accLvl}</span>
                <div class="card__profile-img-container">
                    <img src="${profile.cardImg}" alt="${profile.name}'s card">
                </div>
            </div>
            <div class="card__right-container">
                <div class="card__right-text-container">
                    <span class="card__profile-username">${profile.name}<span class="card__profile-tag">#${profile.tag}</span></span>
                    <span class="card__profile-rank">${profile.rank}</span>
                </div>
                <div class="card__right-options-container">
                    <button class="card__options-btn">
                        <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 2H2V16H16V2Z" stroke="#777777" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M38 2H24V16H38V2Z" stroke="#777777" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M38 24H24V38H38V24Z" stroke="#777777" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 24H2V38H16V24Z" stroke="#777777" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="card__options-menu fade-in-up">
                        <button class="card__options-edit-btn">
                            <svg width="13" height="12" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 37H38M29 3.99996C29.7956 3.20432 30.8748 2.75732 32 2.75732C32.5572 2.75732 33.1088 2.86706 33.6236 3.08028C34.1383 3.29349 34.606 3.606 35 3.99996C35.394 4.39393 35.7065 4.86164 35.9197 5.37638C36.1329 5.89112 36.2426 6.44281 36.2426 6.99996C36.2426 7.55712 36.1329 8.10881 35.9197 8.62355C35.7065 9.13829 35.394 9.606 35 9.99996L10 35L2 37L4 29L29 3.99996Z" stroke="#aaaaaa" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Edit
                        </button>
                        <button class="card__options-delete-btn">
                            <svg width="13" height="17" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 10H6M6 10H38M6 10V38C6 39.0609 6.42143 40.0783 7.17157 40.8284C7.92172 41.5786 8.93913 42 10 42H30C31.0609 42 32.0783 41.5786 32.8284 40.8284C33.5786 40.0783 34 39.0609 34 38V10M12 10V6C12 4.93913 12.4214 3.92172 13.1716 3.17157C13.9217 2.42143 14.9391 2 16 2H24C25.0609 2 26.0783 2.42143 26.8284 3.17157C27.5786 3.92172 28 4.93913 28 6V10M16 20V32M24 20V32" stroke="red" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
                <div class="card__copy-container">
                    <span class="card__copy-text">Copy</span>
                    <button class="card__copy-btn">
                        <svg width="20" height="22" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.3158 0H1.47368C0.659474 0 0 0.650909 0 1.45455V11.6364H1.47368V1.45455H10.3158V0ZM12.5263 2.90909H4.42105C3.60684 2.90909 2.94737 3.56 2.94737 4.36364V14.5455C2.94737 15.3491 3.60684 16 4.42105 16H12.5263C13.3405 16 14 15.3491 14 14.5455V4.36364C14 3.56 13.3405 2.90909 12.5263 2.90909ZM12.5263 14.5455H4.42105V4.36364H12.5263V14.5455Z" fill="#777777"/>
                        </svg>
                    </button>
                </div>
            </div>
    `;
}

function getFriendListHTML() {
    return `
        <div class="friend-list__header">
            <h2>Friend List</h2>
            <button class="friend-list__requests-btn">
                <div class="friend-list__requests-btn-notif"></div>
                <svg width="28" height="20" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M34 38V34C34 31.8783 33.1571 29.8434 31.6569 28.3431C30.1566 26.8429 28.1217 26 26 26H10C7.87827 26 5.84344 26.8429 4.34315 28.3431C2.84285 29.8434 2 31.8783 2 34V38M46 38V34C45.9987 32.2275 45.4087 30.5055 44.3227 29.1046C43.2368 27.7037 41.7163 26.7031 40 26.26M32 2.26C33.7208 2.7006 35.2461 3.7014 36.3353 5.10462C37.4245 6.50784 38.0157 8.23366 38.0157 10.01C38.0157 11.7863 37.4245 13.5122 36.3353 14.9154C35.2461 16.3186 33.7208 17.3194 32 17.76M26 10C26 14.4183 22.4183 18 18 18C13.5817 18 10 14.4183 10 10C10 5.58172 13.5817 2 18 2C22.4183 2 26 5.58172 26 10Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="friend-list__requests-menu">
                <h2>Friend Requests</h2>
                <div class="friend-list__requests-container"></div>
            </div>
        </div>
        <div class="friend-list__account-container"></div>
        <div class="friend-list__friend-id-container">
            <div class="friend-list__request-confirmation">
                <span>Friend request sent</span>
            </div>
            <input class="friend-list__friend-id-input" type="text" placeholder="Enter friend code" spellcheck="false" maxlength=13>
            <button class="friend-list__request-send-btn">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2V30M2 16H30" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `;
}

function getFriendAccountHTML(friendData) {
    return `
        <img class="friend-list__account-image" src="./imgs/default-profile-img.jpg">
        <div class="friend-list__account-info">
            <span class="friend-list__account-name">${friendData.username}</span>
            <span class="friend-list__account-status">Offline</span>
        </div>
    `;
}

function getFriendRequestHTML(data) {
    return `
        <div class="friend-list__request-account-info">
            <span class="friend-list__request-account-username">${data.username}</span>
            <span class="friend-list__request-account-uid">${data.uid}</span>
        </div>
        <div class="friend-list__request-account-btns">
            <button class="friend-list__request-accept-btn">
                <svg width="24" height="18" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 38V34C32 31.8783 31.1571 29.8434 29.6569 28.3431C28.1566 26.8429 26.1217 26 24 26H10C7.87827 26 5.84344 26.8429 4.34315 28.3431C2.84285 29.8434 2 31.8783 2 34V38M34 18L38 22L46 14M25 10C25 14.4183 21.4183 18 17 18C12.5817 18 9 14.4183 9 10C9 5.58172 12.5817 2 17 2C21.4183 2 25 5.58172 25 10Z" stroke="limegreen" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="friend-list__request-btn-seperator"></div>
            <button class="friend-list__request-deny-btn">
                <svg width="24" height="18" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 38V34C32 31.8783 31.1571 29.8434 29.6569 28.3431C28.1566 26.8429 26.1217 26 24 26H10C7.87827 26 5.84344 26.8429 4.34315 28.3431C2.84285 29.8434 2 31.8783 2 34V38M36 12L46 22M46 12L36 22M25 10C25 14.4183 21.4183 18 17 18C12.5817 18 9 14.4183 9 10C9 5.58172 12.5817 2 17 2C21.4183 2 25 5.58172 25 10Z" stroke="red" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `;
}

function addFriendAccount(data) {
    const friendListContainer = document.querySelector(
        ".friend-list__account-container"
    );

    const friendAccount = document.createElement("div");
    friendAccount.classList.add("friend-list__account");
    friendAccount.id = data.username;
    friendAccount.innerHTML = getFriendAccountHTML(data);

    friendListContainer.append(friendAccount);

    //TODO: Add a drag feature to delete friend accounts (similar to steam)
}

function updateRequestsNotif() {
    const requestsNotif = document.querySelector(
        ".friend-list__requests-btn-notif"
    );
    if (Number(requestsNotif.innerHTML) === 1) {
        requestsNotif.style.display = "none";
    } else {
        requestsNotif.innerHTML = Number(requestsNotif.innerHTML) - 1;
    }
}

async function setupRequestInteractions(requestAccount) {
    const acceptBtn = requestAccount.querySelector(
        ".friend-list__request-accept-btn"
    );
    acceptBtn.addEventListener("click", () => {
        social.acceptFriendRequest(requestAccount.id).catch((err) => {
            console.error("Error accepting friend req:", err);
            return;
        });
        requestAccount.remove();
        updateRequestsNotif();
    });

    const denyBtn = requestAccount.querySelector(
        ".friend-list__request-deny-btn"
    );
    denyBtn.addEventListener("click", () => {
        social.denyFriendRequest(requestAccount.id).catch((err) => {
            console.error("Error denying friend req:", err);
            return;
        });
        requestAccount.remove();
        updateRequestsNotif();
    });
}

async function setCards(userProfiles) {
    userProfiles.forEach((profile) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.innerHTML = getCardHTML(profile);
        cardDiv.id = `${profile.name}#${profile.tag}`;
        cardContainer.appendChild(cardDiv);

        setupCardOptionsListener(cardDiv);

        const accountRankContainer = cardDiv.querySelector(
            ".card__profile-rank"
        );
        setRankColor(accountRankContainer, profile.rank);

        renderedUserProfiles.push(`${profile.name}#${profile.tag}`);
    });
    renderedUserProfiles = [...new Set(renderedUserProfiles)];
}

async function insertHomeSubtitle() {
    const subtitleContainer = document.querySelector(
        ".main__subtitle-container"
    );
    subtitleContainer.innerHTML = "";

    const subtitleLeft = document.createElement("div");
    subtitleLeft.classList.add("main__subtitle-left");
    const lastRefreshTImestamp = await profile.getLastRefreshed();
    const refreshTimer = calculateElapsedTime(lastRefreshTImestamp);
    let subtitle = `
    <p>Saved Accounts <span class="h-divider">|</span> Last Refreshed: <span class="main__subtitle-timer">${refreshTimer}</span></p> 
    <button class="main__subtitle-refresh-btn">
        <svg viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M42 4.00003V16M42 16H30M42 16L32.74 7.28003C29.9812 4.5195 26.4 2.7304 22.5359 2.18231C18.6719 1.63423 14.7343 2.35686 11.3167 4.24131C7.89907 6.12575 5.18649 9.06993 3.58772 12.6302C1.98895 16.1904 1.59061 20.1738 2.45273 23.9801C3.31484 27.7865 5.39071 31.2095 8.36751 33.7334C11.3443 36.2573 15.0608 37.7453 18.9568 37.9732C22.8529 38.2011 26.7175 37.1566 29.9683 34.997C33.2191 32.8375 35.6799 29.6799 36.98 26" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>`;
    subtitleLeft.innerHTML = subtitle;
    subtitleContainer.appendChild(subtitleLeft);

    const subtitleRight = document.createElement("div");
    subtitleRight.classList.add("main__subtitle-right");
    subtitle = `
    <button class="main__subtitle-profile-button">
        <span class="main__subtitle-profile-button_lg">
            <span class="main__subtitle-profile-button_sl"></span>
            <span class="main__subtitle-profile-button_text">Add Account</span>
        </span>
    </button>`;
    subtitleRight.innerHTML = subtitle;
    subtitleContainer.appendChild(subtitleRight);

    // FIXME: Move refresh button init here

    const bgBlur = document.querySelector(".overlay__bg-blur");
    const profilePopup = document.querySelector(".overlay__popup-container");
    const profileBtn = document.querySelector(".main__subtitle-profile-button");
    profileBtn.addEventListener("click", () => {
        bgBlur.style.display = "block";
        profilePopup.style.display = "flex";
    });
}

function setupCardOptionsListener(cardDiv) {
    const optionsBtn = cardDiv.querySelector(".card__options-btn");
    const optionsDropdown = cardDiv.querySelector(".card__options-menu");
    optionsBtn.addEventListener("click", () => {
        if (optionsDropdown.style.display === "flex") {
            optionsDropdown.style.display = "none";
        } else {
            optionsDropdown.style.display = "flex";
        }
    });

    const deleteBtn = cardDiv.querySelector(".card__options-delete-btn");
    deleteBtn.addEventListener("click", () => {
        const rawId = cardDiv.id;
        const name = rawId.substring(0, rawId.indexOf("#"));
        profile.deleteUserProfile(name).then(() => {
            const accIndex = renderedUserProfiles.indexOf(rawId);
            renderedUserProfiles.splice(accIndex, 1);
            cardDiv.remove();
            noAccountDisplayCheck();
        });
    });
}

function calculateElapsedTime(lastRefresh) {
    if (lastRefresh === -1) {
        return "No Data"; // New accounts
    }

    const now = Date.now();
    const elapsedTime = now - lastRefresh;

    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day(s) ago`;
    } else if (hours > 0) {
        return `${hours} hour(s) ago`;
    } else if (minutes > 0) {
        return `${minutes} minute(s) ago`;
    } else {
        return `Just now`;
    }
}

async function updateRefreshTimer() {
    const timer = document.querySelector(".main__subtitle-timer");
    const lastRefreshTImestamp = await profile.getLastRefreshed();
    const refreshTimer = calculateElapsedTime(lastRefreshTImestamp);
    timer.innerHTML = refreshTimer;
}

const contentContainer = document.querySelector(".main__content");

function loadFriendsList() {
    const friendListContainer = document.createElement("div");
    friendListContainer.classList.add("friend-list");
    friendListContainer.innerHTML = getFriendListHTML();

    contentContainer.appendChild(friendListContainer);

    social.getFriends().then((friendsList) => {
        friendsList.forEach((friendData) => {
            addFriendAccount(friendData);
        });
    });

    const addFriendBtn = document.querySelector(
        ".friend-list__request-send-btn"
    );
    addFriendBtn.addEventListener("click", () => {
        const addFriendField = document.querySelector(
            ".friend-list__friend-id-input"
        );
        const friendID = addFriendField.value;

        if (friendID === "") {
            return;
        }

        social.sendFriendRequest(friendID).then((status) => {
            switch (status) {
                case 200:
                    const reqSentTooltip = document.querySelector(
                        ".friend-list__request-confirmation"
                    );
                    reqSentTooltip.style.visibility = "visible";
                    setTimeout(() => {
                        reqSentTooltip.style.visibility = "hidden";
                    }, 5000);
                    addFriendField.value = "";
                    break;
                case 404:
                    displayError("Could not find friend, check friend ID");
                    break;
                case 400:
                    displayError("Go get some friends buddy....");
                    break;
                case 409:
                    displayError("Already friends with that user");
                    break;
                default:
                    displayError("Something went wrong, try again");
                    break;
            }
        });
    });
}

function loadContentLayout() {
    const homeLayout = `
        <div class="main__outer-container">
            <div class="main__no-account-prompt">
                <h2>No account(s) found....</h2>
                <p>Insert accounts using "Add Account" button</p>
            </div>
            <div class="main__subtitle-container"></div>
            <div class="main__inner-container"></div>
        </div>
    `;
    contentContainer.innerHTML = homeLayout;
}

let cardContainer;
async function loadHome() {
    showLoading("Setting up the good stuff...");
    const titleContainer = document.querySelector(".main__title-container");
    const title = "<h1>Home</h1>";
    titleContainer.innerHTML = title;

    loadContentLayout();

    await insertHomeSubtitle();
    setInterval(updateRefreshTimer, 60000); // 60s

    const innerContentContainer = document.querySelector(
        ".main__inner-container"
    );
    cardContainer = document.createElement("div");
    cardContainer.classList.add("main__card-container");
    innerContentContainer.appendChild(cardContainer);

    profile
        .getUserProfiles()
        .then((userProfiles) => {
            setCards(userProfiles).then(() => {
                setupRefresh();
                noAccountDisplayCheck();
            });
            hideLoading();
        })
        .catch((err) => {
            console.error("Error setting profile cards:", err);
            hideLoading();
        });

    database.liveProfileChanges().catch((err) => {
        console.error("Error enabling live changes:", err);
    });

    loadFriendsList();

    database
        .liveFriendRequests()
        .then(() => {
            const requestsIcon = document.querySelector(
                ".friend-list__requests-btn"
            );
            requestsIcon.addEventListener("click", () => {
                const requestsDropdownContainer = document.querySelector(
                    ".friend-list__requests-menu"
                );
                if (
                    requestsDropdownContainer.classList.contains(
                        "friend-list__requests-menu--show"
                    )
                ) {
                    requestsDropdownContainer.classList.remove(
                        "friend-list__requests-menu--show"
                    );
                    requestsDropdownContainer.style.zIndex = 1;
                } else {
                    requestsDropdownContainer.classList.add(
                        "friend-list__requests-menu--show"
                    );
                    requestsDropdownContainer.style.zIndex = 200;
                }
            });
        })
        .catch((err) => {
            console.error("Error enabling live friend requests:", err);
        });
}

ipcRenderer.on("userProfile-update-forward", (userProfiles) => {
    userProfiles.forEach((profile) => {
        if (!renderedUserProfiles.includes(`${profile.name}#${profile.tag}`)) {
            setCards([profile]);
        }
    });
});

ipcRenderer.on("userProfile-refresh-forward", (userProfiles) => {
    cardContainer.innerHTML = "";
    setCards(userProfiles);
});

const settingsBtn = document.querySelector(".nav__settings-btn");
const settingsDropdown = document.querySelector(".nav__settings-menu");
settingsBtn.addEventListener("click", () => {
    settingsDropdown.classList.toggle("nav__settings-menu--show");
});

document.addEventListener("click", (event) => {
    if (
        !settingsDropdown.contains(event.target) &&
        !settingsBtn.contains(event.target)
    ) {
        settingsDropdown.classList.remove("nav__settings-menu--show");
    }
});

const logoutBtn = document.querySelector(".nav__settings-logout");
logoutBtn.addEventListener("click", () => {
    ipcRenderer.send("action:logout");
});

const githubBtn = document.querySelector(".nav__settings-github");
githubBtn.addEventListener("click", () => {
    shell.openExternal("https://github.com/Mevin-JR/Valorant-Profiler");
});

const closePopupBtn = document.querySelector(".overlay__popup-close-btn");
function closepopup() {
    const nameInput = document.querySelector(".overlay__popup-username-input");
    const tagInput = document.querySelector(".overlay__popup-tag-input");
    const bgBlur = document.querySelector(".overlay__bg-blur");
    const accountAddPopup = document.querySelector(".overlay__popup-container");

    accountAddPopup.style.animation = "zoomOut 0.4s ease";
    nameInput.value = "";
    tagInput.value = "";
    setTimeout(() => {
        bgBlur.style.display = "none";
        accountAddPopup.style.display = "none";
        accountAddPopup.style.animation = "zoomIn 0.4s ease-in-out";
    }, 300);
}

closePopupBtn.addEventListener("click", () => {
    closepopup();
});

const addAccount = document.querySelector(".overlay__profile-add-btn");
addAccount.addEventListener("click", () => {
    const name = document.querySelector(".overlay__popup-username-input").value;
    const tag = document.querySelector(".overlay__popup-tag-input").value;

    if (name === "" || tag === "") {
        displayError("Required field is empty");
        return;
    }

    const maxAccountCount = 9;
    if (renderedUserProfiles.length === maxAccountCount) {
        displayError("Cannot add any more profiles (max. 9)");
        return;
    }

    const nameTagCheck = `${name}#${tag}`;
    if (renderedUserProfiles.includes(nameTagCheck)) {
        displayError("Account already exists");
        return;
    }

    showLoading("Retrieving account information...");
    profile.addProfile(name, tag).then(() => {
        hideLoading();
        noAccountDisplayCheck();
    });
    closepopup();
});

function setupRefresh() {
    const refreshButton = document.querySelector(".main__subtitle-refresh-btn");
    refreshButton.addEventListener("click", () => {
        if (renderedUserProfiles.length === 0) {
            displayError("No account(s) found");
            return;
        }

        const cooldownSeconds = 60;
        if (refreshButton.classList.contains("cooldown")) {
            displayError(
                `Refresh is in cooldown for ${cooldownSeconds} seconds`
            );
            return;
        }

        refreshButton.classList.add("cooldown");
        setTimeout(() => {
            refreshButton.classList.remove("cooldown");
        }, cooldownSeconds * 1000);

        showLoading("Refreshing data... (May take some time)");
        profile.refreshData().then(() => {
            updateRefreshTimer();
            hideLoading();
        });
    });
}

function noAccountDisplayCheck() {
    const noAccountPageContainer = document.querySelector(
        ".main__no-account-prompt"
    );
    if (renderedUserProfiles.length > 0) {
        noAccountPageContainer.style.display = "none";
    } else {
        noAccountPageContainer.style.display = "flex";
    }
}

ipcRenderer.on("load-home", () => {
    loadHome();
});

function displayError(errorText) {
    Toastify({
        text: `<svg width="11" height="11" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.7612 9.99893L19.6305 2.14129C19.8657 1.90606 19.9979 1.58701 19.9979 1.25434C19.9979 0.921668 19.8657 0.602622 19.6305 0.367388C19.3953 0.132153 19.0763 0 18.7437 0C18.411 0 18.092 0.132153 17.8568 0.367388L10 8.23752L2.14319 0.367388C1.90799 0.132153 1.58897 2.95361e-07 1.25634 2.97839e-07C0.923701 3.00318e-07 0.604689 0.132153 0.36948 0.367388C0.134271 0.602622 0.00213201 0.921668 0.002132 1.25434C0.002132 1.58701 0.134271 1.90606 0.36948 2.14129L8.23878 9.99893L0.36948 17.8566C0.252404 17.9727 0.159479 18.1109 0.0960643 18.2631C0.0326494 18.4153 0 18.5786 0 18.7435C0 18.9084 0.0326494 19.0717 0.0960643 19.224C0.159479 19.3762 0.252404 19.5143 0.36948 19.6305C0.4856 19.7476 0.623751 19.8405 0.775965 19.9039C0.928178 19.9673 1.09144 20 1.25634 20C1.42123 20 1.5845 19.9673 1.73671 19.9039C1.88892 19.8405 2.02708 19.7476 2.14319 19.6305L10 11.7603L17.8568 19.6305C17.9729 19.7476 18.1111 19.8405 18.2633 19.9039C18.4155 19.9673 18.5788 20 18.7437 20C18.9086 20 19.0718 19.9673 19.224 19.9039C19.3763 19.8405 19.5144 19.7476 19.6305 19.6305C19.7476 19.5143 19.8405 19.3762 19.9039 19.224C19.9674 19.0717 20 18.9084 20 18.7435C20 18.5786 19.9674 18.4153 19.9039 18.2631C19.8405 18.1109 19.7476 17.9727 19.6305 17.8566L11.7612 9.99893Z" fill="red"/>
            </svg>&nbsp;&nbsp;${errorText}`,
        duration: 3000,
        gravity: "top",
        position: "center",
        className: "popup-error",
        escapeMarkup: false,
        stopOnFocus: false,
        close: false,
    }).showToast();
}

ipcRenderer.on("error-message-forward", (err) => {
    displayError(err);
});

ipcRenderer.on("action-required-accounts-forward", (err) => {
    const actionRequiredAccounts = err;

    actionRequiredAccounts.forEach((accountID) => {
        const card = document.getElementById(accountID);
        const actionRequiredContainer = card.querySelector(
            ".action-required-container"
        );

        actionRequiredContainer.style.display = "flex";
    });
});

ipcRenderer.on("received-friend-request-forward", (data) => {
    const requestsNotif = document.querySelector(
        ".friend-list__requests-btn-notif"
    );
    requestsNotif.innerHTML = `${data.receivedCount}`;
    requestsNotif.style.display = "flex";

    const requestsDropdownContainer = document.querySelector(
        ".friend-list__requests-container"
    );
    const requestAccount = document.createElement("div");
    requestAccount.classList.add("friend-list__request-account");
    requestAccount.id = data.info.username;
    requestAccount.innerHTML = getFriendRequestHTML(data.info);

    requestsDropdownContainer.appendChild(requestAccount);
    setupRequestInteractions(requestAccount);
});

ipcRenderer.on("add-friend-forward", (data) => {
    addFriendAccount(data);
});
