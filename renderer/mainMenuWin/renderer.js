const headerContainer = document.querySelector('.header-container');
const contentContainer = document.querySelector('.content-container');
let header = ''

function setCards(userProfiles) {
    const cardContainer = document.querySelector('.card-section');
    userProfiles.forEach((profile) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("account-card");
        cardDiv.innerHTML = `
            <div class="card-left">
                <span class="account-level">Level: <span>${profile.accLvl}</span></span>
                <svg class="fav-icon" id="fav-empty-icon" width="24" height="23" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.99992 13.2526L13.759 15.7188L12.8501 10.4952L16.7003 6.79589L11.3795 6.03378L8.99992 1.28123L6.62037 6.03378L1.29953 6.79589L5.14972 10.4952L4.24082 15.7188L8.99992 13.2526ZM4.84554 16.8526C4.21027 17.1818 3.42454 16.9411 3.09056 16.3149C2.95757 16.0655 2.91168 15.7799 2.95999 15.5023L3.7534 10.9424L0.392443 7.71316C-0.121499 7.21935 -0.132015 6.40837 0.368955 5.90177C0.568444 5.70005 0.829834 5.56877 1.11266 5.52826L5.75739 4.86299L7.83458 0.714329C8.15221 0.0799358 8.93145 -0.180531 9.57504 0.132561C9.83133 0.257236 10.0388 0.461711 10.1652 0.714329L12.2424 4.86299L16.8872 5.52826C17.5974 5.62999 18.0895 6.27999 17.9863 6.98009C17.9452 7.25887 17.812 7.51652 17.6074 7.71316L14.2464 10.9424L15.0398 15.5023C15.1612 16.1995 14.6861 16.8617 13.9787 16.9813C13.697 17.0289 13.4073 16.9837 13.1543 16.8526L8.99992 14.6997L4.84554 16.8526Z" fill="white"/>
                </svg>
                <div class="cardImg-container">
                    <img src="${profile.cardImg}" alt="Profile Card">
                </div>
            </div>
            <div class="card-right">
                <div class="card-text-container">
                    <span class="account-username">${profile.name}<span class="account-tag">#${profile.tag}</span></span>
                    <span class="account-rank">${profile.rank}</span>
                </div>
                <svg class="options-icon" id="options-btn" width="5" height="21" viewBox="0 0 3 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 8.01205C0.671562 8.01205 0 8.67822 0 9.5C0 10.3218 0.671562 10.988 1.5 10.988C2.32842 10.988 3 10.3218 3 9.5C3 8.67822 2.32842 8.01205 1.5 8.01205ZM1.5 16.0241C0.671562 16.0241 0 16.6903 0 17.512C0 18.3339 0.671562 19 1.5 19C2.32842 19 3 18.3339 3 17.512C3 16.6903 2.32842 16.0241 1.5 16.0241ZM1.5 0C0.671562 0 0 0.666167 0 1.48795C0 2.30971 0.671562 2.9759 1.5 2.9759C2.32842 2.9759 3 2.30974 3 1.48795C3 0.666167 2.32842 0 1.5 0Z" fill="black"/>
                </svg>
                <svg class="copy-icon" id="copy-btn" width="20" height="22" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.3158 0H1.47368C0.659474 0 0 0.650909 0 1.45455V11.6364H1.47368V1.45455H10.3158V0ZM12.5263 2.90909H4.42105C3.60684 2.90909 2.94737 3.56 2.94737 4.36364V14.5455C2.94737 15.3491 3.60684 16 4.42105 16H12.5263C13.3405 16 14 15.3491 14 14.5455V4.36364C14 3.56 13.3405 2.90909 12.5263 2.90909ZM12.5263 14.5455H4.42105V4.36364H12.5263V14.5455Z" fill="#777777"/>
                </svg>
            </div>
        `;

        cardContainer.appendChild(cardDiv);
    });
    
    const accountRank = document.querySelectorAll('.account-rank');
    accountRank.forEach((rank) => {
        const rankText = rank.textContent;
        if (rankText.includes('Iron')) {
            rank.style.color = '#FDFDFD';
            rank.style.backgroundColor = '#787775';
        } else if (rankText.includes('Bronze')) {
            rank.style.color = '#54370A';
            rank.style.backgroundColor = '#A58642';
        } else if (rankText.includes('Silver')) {
            rank.style.color = '#FDFDFD';
            rank.style.backgroundColor = '#464B4E';
        } else if (rankText.includes('Gold')) {
            rank.style.color = '#F4EEAE';
            rank.style.backgroundColor = '#CC8818';
        } else if (rankText.includes('Platinum')) {
            rank.style.color = '#29747F';
            rank.style.backgroundColor = '#52CDDD';
        } else if (rankText.includes('Diamond')) {
            rank.style.color = '#F195F4';
            rank.style.backgroundColor = '#946BD2';
        } else if (rankText.includes('Ascendant')) {
            rank.style.color = '#B6FFD7';
            rank.style.backgroundColor = '#228052';
        } else if (rankText.includes('Immortal')) {
            rank.style.color = '#E8C3A8';
            rank.style.backgroundColor = '#C3324E';
        } else if (rankText.includes('Radiant')) {
            rank.style.color = '#E39C41';
            rank.style.backgroundColor = '#FFFFB4';
        }
    });

    const accounAddBtnContainer = document.querySelector('.account-add-btn');
    cardContainer.appendChild(accounAddBtnContainer);
}

function loadHome() {
    header = '<h1>Valorant Profiler</h1>';
    headerContainer.innerHTML = header;

    db.liveChanges();
    // Toastify({
    //     text: "Something went wrong",
    //     duration: 5000,
    //     gravity: "bottom",
    //     position: "center",
    //     offset: {
    //         y: 50,
    //     },
    //     className: "unknown-error"
    // }).showToast();
    return;
}

ipcRenderer.on('userProfile-update-forward', (userProfiles) => {
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


const addPopupOpen = document.getElementById('add-popup-open');
const bgBlur = document.querySelector('.bg-blur');
const accountAddPopup = document.querySelector('.add-popup-container');
addPopupOpen.addEventListener('click', () => {
    bgBlur.style.display = 'block';
    accountAddPopup.style.display = 'flex';
});

const closePopupBtn = document.getElementById('popup-close-btn');
function closepopup() {
    const nameInput = document.getElementById('name');
    const tagInput = document.getElementById('tag');
    const bgBlur = document.querySelector('.bg-blur');
    const accountAddPopup = document.querySelector('.add-popup-container');

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

const addAccount = document.getElementById('add-account');
addAccount.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const tag = document.getElementById('tag').value; // TODO: Constraints
    account.accountInputData(name, tag);
    closepopup();
});

document.addEventListener('DOMContentLoaded', () => {
    loadHome();
    
});
