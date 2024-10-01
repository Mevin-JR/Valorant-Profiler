// Module imports (used in render files)
const { contextBridge, ipcRenderer } = require('electron/renderer');
const { shell } = require('electron');
const  { registerUser, loginUser, log, accountInputData, getUserProfiles, liveChanges } = require('./backend/db_operations');

// Inter Process Communication (Renderer) module
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel, data), // Sending data from renderer files to main
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)), // Recieving data from main to renderer files
});

// Shell module for redirection to external sources
contextBridge.exposeInMainWorld('shell', {
    openExternal: async (url) => await shell.openExternal(url) // Opening external links (in client browser)
});

// TODO: Unfinished log feature (entire app)
// Log operation (saved on local file)
contextBridge.exposeInMainWorld('debug', {
    log: (logMessage) => log(logMessage)
});

// User authentication functions
contextBridge.exposeInMainWorld('auth', {
    registerUser: async (username, email, password) => await registerUser(username, email, password),
    loginUser: async (username, password) => await loginUser(username, password),
});

// TODO: Better naming and structure
// User profile functions
contextBridge.exposeInMainWorld('account', {
    accountInputData: async (nameInput, tagInput) => await accountInputData(nameInput, tagInput), // Player name & tag retrival
    getUserProfiles: async () => await getUserProfiles() // Retrieving all saved user profiles from firebase
});

// Database functions
contextBridge.exposeInMainWorld('db', {
    liveChanges: async () => await liveChanges()
})