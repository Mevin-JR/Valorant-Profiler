const { contextBridge, ipcRenderer } = require('electron/renderer');
const  { registerUser, loginUser, log } = require('./database/db_operations');

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
});

contextBridge.exposeInMainWorld('debug', {
    log: (logMessage) => log(logMessage)
});

contextBridge.exposeInMainWorld('auth', {
    registerUser: async (username, email, password) => await registerUser(username, email, password),
    loginUser: async (username, password) => await loginUser(username, password)
})