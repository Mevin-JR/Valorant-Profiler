const settingsBtn = document.getElementById('settings-btn');
const settingsDropdown = document.querySelector('.dropdown');
settingsBtn.addEventListener('click', (event) => {
    event.stopPropagation();
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