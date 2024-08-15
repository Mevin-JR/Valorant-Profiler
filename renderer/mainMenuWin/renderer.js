const settingsBtn = document.getElementById('settings-btn');
const settingsDropdown = document.getElementById('dropdown');
settingsBtn.addEventListener('click', () => {
    if (settingsDropdown.style.visibility === 'hidden') {
        settingsDropdown.style.visibility = 'visible';
    } else {
        settingsDropdown.style.visibility = 'hidden';
    }
});

const logoutBtn = document.getElementById('log-out');
logoutBtn.addEventListener('click', () => {
    ipcRenderer.send('action:logout');
});

const githubBtn = document.getElementById('github');
githubBtn.addEventListener('click', () => {
    shell.openExternal('https://github.com/Mevin-JR/Valorant-Profiler');
})