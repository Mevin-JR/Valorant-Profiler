// Module imports (used in render files)
const { contextBridge, ipcRenderer } = require('electron/renderer');
const { shell } = require('electron');
const  { registerUser, loginUser, insertProfileData, getUserProfiles, liveChanges, getLastRefreshed, refreshData, deleteUserProfile } = require('./backend/db_operations');

// Inter Process Communication (Renderer) module
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel, data), // Sending data from renderer files to main
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)), // Recieving data from main to renderer files
});

// Shell module for redirection to external sources
contextBridge.exposeInMainWorld('shell', {
    openExternal: async (url) => await shell.openExternal(url) // Opening external links (in client browser)
});

// User authentication functions
contextBridge.exposeInMainWorld('auth', {
    registerUser: async (username, password) => await registerUser(username, password),
    loginUser: async (username, password) => await loginUser(username, password),
});

// TODO: Shits ugly, give better name
// User profile functions
contextBridge.exposeInMainWorld('account', {
    insertProfileData: async (nameInput, tagInput) => await insertProfileData(nameInput, tagInput), // Player name & tag retrival
});

// Database functions
contextBridge.exposeInMainWorld('db', {
    getUserProfiles: async () => await getUserProfiles(), // Retrieving all saved user profiles from firebase
    liveChanges: async () => await liveChanges(),
    getLastRefreshed: async () => await getLastRefreshed(),
    refreshData: async () => await refreshData(),
    deleteUserProfile: async (name) => await deleteUserProfile(name)
});