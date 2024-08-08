const { contextBridge, ipcRenderer } = require('electron/renderer');
const  { registerUser, loginUser, getUserData } = require('./database/db_operations')

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
});

contextBridge.exposeInMainWorld('auth', {
    registerUser: async (username, email, password) => { 
        try {
            await registerUser(username, email, password);
            console.log("Preload register done");
        } catch (error) {
            console.log("Preload register error:", error);
        }
    },
    getUserData: async (username) => {
        try {
            const profile = await getUserData(username);
            return profile;
            } catch (error) {
            console.error('Preload -> Error fetching user profile:', error);
            return null;
        }
    }
})