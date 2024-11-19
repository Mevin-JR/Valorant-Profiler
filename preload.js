// Module imports (used in render files)
const { contextBridge, ipcRenderer } = require("electron/renderer");
const { shell } = require("electron");
const {
    registerUser,
    loginUser,
    addProfile,
    getUserProfiles,
    liveProfileChanges,
    getLastRefreshed,
    refreshData,
    deleteUserProfile,
    sendFriendRequest,
    liveFriendRequests,
    acceptFriendRequest,
    denyFriendRequest,
    getFriends,
} = require("./backend/db_operations");

// Inter Process Communication (Renderer) module
contextBridge.exposeInMainWorld("ipcRenderer", {
    send: (channel, data) => ipcRenderer.send(channel, data), // Sending data from renderer files to main
    on: (channel, func) =>
        ipcRenderer.on(channel, (event, ...args) => func(...args)), // Receiving data from main to renderer files
});

// User authentication functions (Used in login window)
contextBridge.exposeInMainWorld("auth", {
    registerUser: async (username, password) =>
        await registerUser(username, password),
    loginUser: async (username, password) =>
        await loginUser(username, password),
});

// Shell module for redirection to external sources
contextBridge.exposeInMainWorld("shell", {
    openExternal: async (url) => await shell.openExternal(url), // Opening external links (in client browser)
});

// Database functions
contextBridge.exposeInMainWorld("database", {
    liveProfileChanges: async () => await liveProfileChanges(), // Enabling live profile changes
    liveFriendRequests: async () => await liveFriendRequests(), // Enabling live friend requests
});

// User profile functions
contextBridge.exposeInMainWorld("profile", {
    addProfile: async (nameInput, tagInput) =>
        await addProfile(nameInput, tagInput),
    getUserProfiles: async () => await getUserProfiles(), // Retrieving all saved user profiles from firebase
    deleteUserProfile: async (name) => await deleteUserProfile(name),
    getLastRefreshed: async () => await getLastRefreshed(), // Retrieving last refresh timestamp (usage of refresh button)
    refreshData: async () => await refreshData(), // Refreshing all user profiles
});

// Social functions
contextBridge.exposeInMainWorld("social", {
    sendFriendRequest: async (friendID) => await sendFriendRequest(friendID), // Sending friend request (using friend ID/uid)
    acceptFriendRequest: async (sender) => await acceptFriendRequest(sender), // Accepting friend request (using sender username)
    denyFriendRequest: async (sender) => await denyFriendRequest(sender),
    getFriends: async () => await getFriends(),
});
