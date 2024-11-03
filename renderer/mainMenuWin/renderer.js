// Loader hide/unhide
const loaderContainer = document.querySelector('.loader-container');
const loaderDescription = document.querySelector('.loader-description');
function showLoading(msg = '') {
    loaderContainer.style.display = 'flex';
    loaderDescription.textContent = msg;
    loaderDescription.style.display = 'block';
}

function hideLoading() {
    loaderContainer.style.display = 'none';
    loaderDescription.style.display = 'none';
}

function setRankColor(accountRankContainer, rank) {
    if (rank.includes('Iron')) {
        accountRankContainer.style.color = '#FDFDFD';
        accountRankContainer.style.backgroundColor = '#787775';
    } else if (rank.includes('Bronze')) {
        accountRankContainer.style.color = '#54370A';
        accountRankContainer.style.backgroundColor = '#A58642';
    } else if (rank.includes('Silver')) {
        accountRankContainer.style.color = '#FDFDFD';
        accountRankContainer.style.backgroundColor = '#464B4E';
    } else if (rank.includes('Gold')) {
        accountRankContainer.style.color = '#F4EEAE';
        accountRankContainer.style.backgroundColor = '#CC8818';
    } else if (rank.includes('Platinum')) {
        accountRankContainer.style.color = '#29747F';
        accountRankContainer.style.backgroundColor = '#52CDDD';
    } else if (rank.includes('Diamond')) {
        accountRankContainer.style.color = '#F195F4';
        accountRankContainer.style.backgroundColor = '#946BD2';
    } else if (rank.includes('Ascendant')) {
        accountRankContainer.style.color = '#B6FFD7';
        accountRankContainer.style.backgroundColor = '#228052';
    } else if (rank.includes('Immortal')) {
        accountRankContainer.style.color = '#E8C3A8';
        accountRankContainer.style.backgroundColor = '#C3324E';
    } else if (rank.includes('Radiant')) {
        accountRankContainer.style.color = '#E39C41';
        accountRankContainer.style.backgroundColor = '#FFFFB4';
    }
}

// TODO: Complete the fav icon functionality, where the fuck is it
const cardContainer = document.querySelector('.card-section');
async function setCards(userProfiles) {
    userProfiles.forEach((profile) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("account-card");
        cardDiv.innerHTML = `
            <div class="card-left">
                <span class="account-level">${profile.accLvl}</span>
                <div class="cardImg-container">
                    <img src="${profile.cardImg}" alt="Profile Card">
                </div>
            </div>
            <div class="card-right">
                <div class="card-text-container">
                    <span class="account-username">${profile.name}<span class="account-tag">#${profile.tag}</span></span>
                    <span class="account-rank">${profile.rank}</span>
                </div>
                <div class="options-container">
                    <svg class="options-icon" width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 2H2V16H16V2Z" stroke="#777777" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M38 2H24V16H38V2Z" stroke="#777777" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M38 24H24V38H38V24Z" stroke="#777777" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 24H2V38H16V24Z" stroke="#777777" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div class="dropdown-container fade-in-up">
                        <a id="edit-btn">
                            <svg width="13" height="12" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 37H38M29 3.99996C29.7956 3.20432 30.8748 2.75732 32 2.75732C32.5572 2.75732 33.1088 2.86706 33.6236 3.08028C34.1383 3.29349 34.606 3.606 35 3.99996C35.394 4.39393 35.7065 4.86164 35.9197 5.37638C36.1329 5.89112 36.2426 6.44281 36.2426 6.99996C36.2426 7.55712 36.1329 8.10881 35.9197 8.62355C35.7065 9.13829 35.394 9.606 35 9.99996L10 35L2 37L4 29L29 3.99996Z" stroke="#aaaaaa" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Edit
                        </a>
                        <a id="delete-btn">
                            <svg width="13" height="17" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 10H6M6 10H38M6 10V38C6 39.0609 6.42143 40.0783 7.17157 40.8284C7.92172 41.5786 8.93913 42 10 42H30C31.0609 42 32.0783 41.5786 32.8284 40.8284C33.5786 40.0783 34 39.0609 34 38V10M12 10V6C12 4.93913 12.4214 3.92172 13.1716 3.17157C13.9217 2.42143 14.9391 2 16 2H24C25.0609 2 26.0783 2.42143 26.8284 3.17157C27.5786 3.92172 28 4.93913 28 6V10M16 20V32M24 20V32" stroke="red" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Delete
                        </a>
                    </div>
                </div>
                <div class="copy-container">
                    <span class="copy-text">Copy</span>
                    <svg class="copy-icon" id="copy-btn" width="20" height="22" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.3158 0H1.47368C0.659474 0 0 0.650909 0 1.45455V11.6364H1.47368V1.45455H10.3158V0ZM12.5263 2.90909H4.42105C3.60684 2.90909 2.94737 3.56 2.94737 4.36364V14.5455C2.94737 15.3491 3.60684 16 4.42105 16H12.5263C13.3405 16 14 15.3491 14 14.5455V4.36364C14 3.56 13.3405 2.90909 12.5263 2.90909ZM12.5263 14.5455H4.42105V4.36364H12.5263V14.5455Z" fill="#777777"/>
                    </svg>
                </div>
            </div>
            <div class="card-bg-blur"></div>
            <div class="card-bg-img">
                <img src="${profile.cardImg}">
            </div>
        `;
        
        cardContainer.appendChild(cardDiv);

        const accountRankContainer = cardDiv.querySelector('.account-rank');
        setRankColor(accountRankContainer, profile.rank);

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
        return `Just now`
    }
}

async function insertHomeSubtitle() {
    const subtitleContainer = document.querySelector('.subtitle-container');
    subtitleContainer.innerHTML = '';
    const homeSubtitleContainer = document.createElement('div');
    homeSubtitleContainer.classList.add('home-subtitle-container');

    const subtitleLeft = document.createElement('div');
    subtitleLeft.classList.add('subtitle-left');
    const lastRefreshTImestamp = await db.getLastRefreshed();
    const refreshTimer = calculateElapsedTime(lastRefreshTImestamp);
    let subtitle = `
    <p>Saved Accounts <span class="h-divider">|</span> Last Refreshed: <span class="timer">${refreshTimer}</span></p> 
    <svg class="refresh-btn" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M42 4.00003V16M42 16H30M42 16L32.74 7.28003C29.9812 4.5195 26.4 2.7304 22.5359 2.18231C18.6719 1.63423 14.7343 2.35686 11.3167 4.24131C7.89907 6.12575 5.18649 9.06993 3.58772 12.6302C1.98895 16.1904 1.59061 20.1738 2.45273 23.9801C3.31484 27.7865 5.39071 31.2095 8.36751 33.7334C11.3443 36.2573 15.0608 37.7453 18.9568 37.9732C22.8529 38.2011 26.7175 37.1566 29.9683 34.997C33.2191 32.8375 35.6799 29.6799 36.98 26" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    subtitleLeft.innerHTML = subtitle;
    homeSubtitleContainer.appendChild(subtitleLeft);

    const subtitleRight = document.createElement('div');
    subtitleRight.classList.add('subtitle-right');
    subtitle = `
    <div class="add-account-button" id="add-popup-open">
        <div class="icon">
            <svg viewBox="0 0 208 208" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                <path d="M104 52C112.702 52 121.209 54.5806 128.445 59.4154C135.681 64.2502 141.32 71.122 144.651 79.162C147.981 87.2019 148.852 96.0488 147.155 104.584C145.457 113.119 141.266 120.959 135.113 127.113C128.959 133.266 121.119 137.457 112.584 139.155C104.049 140.852 95.2019 139.981 87.1619 136.651C79.122 133.32 72.2501 127.681 67.4153 120.445C62.5806 113.209 60 104.702 60 96C60 90.2219 61.1381 84.5003 63.3493 79.1619C65.5605 73.8236 68.8015 68.9731 72.8873 64.8873C76.973 60.8015 81.8236 57.5605 87.1619 55.3493C92.5002 53.1381 98.2218 52 104 52ZM152 40H168V56C168 58.1218 168.843 60.1566 170.343 61.6569C171.843 63.1572 173.878 64 176 64C178.122 64 180.157 63.1572 181.657 61.6569C183.157 60.1566 184 58.1218 184 56V40H200C202.122 40 204.157 39.1572 205.657 37.6569C207.157 36.1566 208 34.1218 208 32C208 29.8783 207.157 27.8435 205.657 26.3432C204.157 24.8429 202.122 24 200 24H184V8.00004C184 5.87831 183.157 3.84347 181.657 2.34318C180.157 0.842892 178.122 3.74156e-05 176 3.74156e-05C173.878 3.74156e-05 171.843 0.842892 170.343 2.34318C168.843 3.84347 168 5.87831 168 8.00004V24H152C149.878 24 147.843 24.8429 146.343 26.3432C144.843 27.8435 144 29.8783 144 32C144 34.1218 144.843 36.1566 146.343 37.6569C147.843 39.1572 149.878 40 152 40ZM197.56 80.9561C195.465 81.2883 193.587 82.4394 192.34 84.156C191.093 85.8727 190.579 88.0143 190.911 90.1099C191.637 94.7044 192.001 99.3487 192 104C192.017 125.542 184.099 146.335 169.758 162.41C163.336 153.106 155.008 145.274 145.327 139.436C134.195 150.067 119.394 156 104 156C88.6065 156 73.8051 150.067 62.6729 139.436C52.9919 145.274 44.6639 153.106 38.2417 162.41C26.9666 149.737 19.5969 134.074 17.0204 117.308C14.444 100.543 16.7708 83.3894 23.7206 67.9159C30.6704 52.4423 41.9465 39.3086 56.1902 30.0974C70.4339 20.8861 87.0374 15.9904 104 16C108.652 15.9996 113.296 16.3636 117.891 17.0889C118.928 17.2534 119.988 17.212 121.01 16.9669C122.032 16.7217 122.995 16.2778 123.845 15.6603C124.695 15.0429 125.415 14.264 125.964 13.3682C126.513 12.4725 126.88 11.4773 127.045 10.4396C127.209 9.40193 127.168 8.34201 126.922 7.32039C126.677 6.29877 126.233 5.33546 125.616 4.48547C124.998 3.63548 124.219 2.91545 123.323 2.36652C122.427 1.81758 121.432 1.45047 120.395 1.28617C105.539 -1.07107 90.35 -0.180682 75.872 3.89601C61.3941 7.97271 47.9717 15.1388 36.5292 24.901C25.0867 34.6631 15.8959 46.7892 9.58978 60.4443C3.28363 74.0994 0.01194 88.9591 8.26596e-06 104C-0.00575188 118.431 2.99902 132.704 8.8223 145.907C14.6456 159.111 23.1593 170.954 33.8193 180.681C34.2155 181.126 34.6603 181.525 35.1456 181.87C54.1318 198.705 78.6276 208.001 104.002 208C129.377 207.999 153.873 198.703 172.858 181.867C173.34 181.524 173.781 181.128 174.175 180.686C184.837 170.959 193.352 159.115 199.176 145.911C205 132.706 208.006 118.432 208 104C208 98.51 207.57 93.0283 206.714 87.6055C206.55 86.5677 206.183 85.5724 205.634 84.6765C205.085 83.7806 204.365 83.0016 203.515 82.3841C202.665 81.7666 201.701 81.3226 200.68 81.0776C199.658 80.8326 198.598 80.7913 197.56 80.9561Z" fill="black"/>
            </svg>
        </div>
        <p>Add Account</p>
    </div>`;
    subtitleRight.innerHTML = subtitle;
    homeSubtitleContainer.appendChild(subtitleRight);

    subtitleContainer.appendChild(homeSubtitleContainer);

    const addPopupOpen = document.getElementById('add-popup-open');
    const bgBlur = document.querySelector('.bg-blur');
    const accountAddPopup = document.querySelector('.popup-container');
    addPopupOpen.addEventListener('click', () => {
        bgBlur.style.display = 'block';
        accountAddPopup.style.display = 'flex';
    });
}

async function updateRefreshTimer() {
    const timer = document.querySelector('.timer');
    const lastRefreshTImestamp = await db.getLastRefreshed();
    const refreshTimer = calculateElapsedTime(lastRefreshTImestamp);
    timer.innerHTML = refreshTimer;
}

async function loadHome() {
    const titleContainer = document.querySelector('.title-container');
    const title = '<h1>Home</h1>';
    titleContainer.innerHTML = title;

    await insertHomeSubtitle();
    setInterval(updateRefreshTimer, 60000); // 60s

    showLoading('Setting up the good stuff...')
    db.getUserProfiles()
    .then((userProfiles) => {
        setCards(userProfiles);
        hideLoading();
        
        const optionsBtns = document.querySelectorAll('.options-icon');
        optionsBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const optionsParentContainer = btn.closest('.options-container');
                const optionsDropdown = optionsParentContainer.querySelector('.dropdown-container');
                if (optionsDropdown.style.display === 'flex') {
                    optionsDropdown.style.display = 'none';
                } else {
                    optionsDropdown.style.display = 'flex';
                }
            });
        });
    })
    .catch((err) => {
        console.error('Error setting profile cards:', err);
        hideLoading();
    })

    // FIXME: Fix this shit
    db.liveChanges()
    .catch((err) => {
        console.error(`Error enabling live changes:${err}`);
    });
}


ipcRenderer.on('userProfile-update-forward', (userProfiles) => {
    console.log('Recieved'); // FIXME: Wtf is this
    setCards(userProfiles);
});


ipcRenderer.on('userProfile-refresh-forward', (userProfiles) => {
    cardContainer.innerHTML = '';
    setCards(userProfiles);
});

const settingsBtn = document.getElementById('settings-btn');
const settingsDropdown = document.querySelector('.dropdown');
settingsBtn.addEventListener('click', () => {
    const currentVisibility = getComputedStyle(settingsDropdown).visibility;
    if (currentVisibility === 'hidden') {
        settingsDropdown.classList.add('show')
    } else if (currentVisibility === 'visible') {
        settingsDropdown.classList.remove('show')
    }
});

document.addEventListener('click', (event) => {
    if (!settingsDropdown.contains(event.target) && 
        !settingsBtn.contains(event.target)) {
        settingsDropdown.classList.remove('show');
    }
});

const logoutBtn = document.getElementById('log-out');
logoutBtn.addEventListener('click', () => {
    ipcRenderer.send('action:logout');
});

const githubBtn = document.getElementById('github');
githubBtn.addEventListener('click', () => {
    shell.openExternal('https://github.com/Mevin-JR/Valorant-Profiler');
});

const closePopupBtn = document.getElementById('popup-close-btn');
function closepopup() {
    const nameInput = document.getElementById('name');
    const tagInput = document.getElementById('tag');
    const bgBlur = document.querySelector('.bg-blur');
    const accountAddPopup = document.querySelector('.popup-container');

    accountAddPopup.style.animation = 'zoomOut 0.4s ease';
    nameInput.value = '';
    tagInput.value = '';
    setTimeout(() => {
        bgBlur.style.display = 'none';
        accountAddPopup.style.display = 'none';
        accountAddPopup.style.animation = 'zoomIn 0.4s ease-in-out';
    }, 300);
}

closePopupBtn.addEventListener('click', () => {
    closepopup();
});

const addAccount = document.getElementById('account-add-btn');
addAccount.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const tag = document.getElementById('tag').value; // TODO: Fuck the constraints
    showLoading('Retrieving account data...');
    account.insertProfileData(name, tag).then(() => {
        hideLoading();
    });
    closepopup();
});

// TODO: Set a cooldown on refresh button to stop the api from bitching
ipcRenderer.on('load-home', () => {
    loadHome().then(() => {
        const refreshButton = document.querySelector('.refresh-btn');
        refreshButton.addEventListener('click', () => {
            showLoading('Refreshing data... (May take some time)');
            db.refreshData().then(() => {
                updateRefreshTimer();
                hideLoading();
            });
        });
    });
});

function displayError(errorText) {
    Toastify({
        text: `<svg width="11" height="11" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.7612 9.99893L19.6305 2.14129C19.8657 1.90606 19.9979 1.58701 19.9979 1.25434C19.9979 0.921668 19.8657 0.602622 19.6305 0.367388C19.3953 0.132153 19.0763 0 18.7437 0C18.411 0 18.092 0.132153 17.8568 0.367388L10 8.23752L2.14319 0.367388C1.90799 0.132153 1.58897 2.95361e-07 1.25634 2.97839e-07C0.923701 3.00318e-07 0.604689 0.132153 0.36948 0.367388C0.134271 0.602622 0.00213201 0.921668 0.002132 1.25434C0.002132 1.58701 0.134271 1.90606 0.36948 2.14129L8.23878 9.99893L0.36948 17.8566C0.252404 17.9727 0.159479 18.1109 0.0960643 18.2631C0.0326494 18.4153 0 18.5786 0 18.7435C0 18.9084 0.0326494 19.0717 0.0960643 19.224C0.159479 19.3762 0.252404 19.5143 0.36948 19.6305C0.4856 19.7476 0.623751 19.8405 0.775965 19.9039C0.928178 19.9673 1.09144 20 1.25634 20C1.42123 20 1.5845 19.9673 1.73671 19.9039C1.88892 19.8405 2.02708 19.7476 2.14319 19.6305L10 11.7603L17.8568 19.6305C17.9729 19.7476 18.1111 19.8405 18.2633 19.9039C18.4155 19.9673 18.5788 20 18.7437 20C18.9086 20 19.0718 19.9673 19.224 19.9039C19.3763 19.8405 19.5144 19.7476 19.6305 19.6305C19.7476 19.5143 19.8405 19.3762 19.9039 19.224C19.9674 19.0717 20 18.9084 20 18.7435C20 18.5786 19.9674 18.4153 19.9039 18.2631C19.8405 18.1109 19.7476 17.9727 19.6305 17.8566L11.7612 9.99893Z" fill="red"/>
            </svg>&nbsp;&nbsp;${errorText}`,
        duration: 3000,
        gravity: "top",
        position: "center",
        className: 'popup-error',
        escapeMarkup: false,
        stopOnFocus: false,
        close: false,
    }).showToast();
}

ipcRenderer.on('error-code-forward', (err) => {
    displayError(err.data);
});