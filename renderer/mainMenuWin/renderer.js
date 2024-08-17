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

document.addEventListener('DOMContentLoaded', loadHome);

const contentSection = document.querySelector('.content-section')
const headerContainer = document.querySelector('.header-container');
const contentContainer = document.querySelector('.content-container');
let header = '';

function loadHome() {
    header = '<h1>Valorant Profiler</h1>'
    headerContainer.innerHTML = header;
    return;
}

const addPopupOpen = document.getElementById('add-popup-open');
const bgBlur = document.querySelector('.bg-blur');
const accountAddPopup = document.querySelector('.add-popup-container');
addPopupOpen.addEventListener('click', () => {
    bgBlur.style.display = 'block';
    accountAddPopup.style.display = 'flex';
});

const closePopupBtn = document.getElementById('popup-close-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
closePopupBtn.addEventListener('click', () => {
    accountAddPopup.style.animation = 'zoomOut 0.4s ease';
    usernameInput.value = '';
    passwordInput.value = '';
    hidePassword();
    setTimeout(() => {
        bgBlur.style.display = 'none';
        accountAddPopup.style.display = 'none';
        accountAddPopup.style.animation = 'zoomIn 0.4s ease-in-out';
    }, 300);
});

const passwordHidden = document.getElementById('password-hidden');
const passwordShown = document.getElementById('password-shown');
passwordHidden.addEventListener('click', showPassword);
passwordShown.addEventListener('click', hidePassword);

function hidePassword() {
    passwordShown.style.display = 'none';
    passwordInput.type = 'password';
    passwordHidden.style.display = 'block';
}

function showPassword() {
    passwordHidden.style.display = 'none';
    passwordInput.type = 'text';
    passwordShown.style.display = 'block';
}