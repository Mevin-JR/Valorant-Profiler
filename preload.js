const { contextBridge, ipcRenderer } = require('electron/renderer');
const { shell } = require('electron');
const  { registerUser, loginUser, log, accountInputData, getUserProfiles, liveChanges } = require('./database/db_operations');

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
});

contextBridge.exposeInMainWorld('debug', {
    log: (logMessage) => log(logMessage)
});

contextBridge.exposeInMainWorld('auth', {
    registerUser: async (username, email, password) => await registerUser(username, email, password),
    loginUser: async (username, password) => await loginUser(username, password),
});

contextBridge.exposeInMainWorld('account', {
    accountInputData: async (usernameInput, passwordInput) => await accountInputData(usernameInput, passwordInput),
    getUserProfiles: async () => await getUserProfiles()
});

contextBridge.exposeInMainWorld('shell', {
    openExternal: async (url) => await shell.openExternal(url)
});

contextBridge.exposeInMainWorld('db', {
    liveChanges: () => liveChanges()
})