const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Development mode check
const isDev = true;

// Windows (Login & Main window)
let winLogin;
let winMain;

// File paths
let iconFile = path.join(__dirname, 'renderer/logos/logo.ico');
let preloadFile = path.join(__dirname, 'preload.js');
let folder = path.join(os.homedir(), "Valorant_Profiler"); // Root folder (C://Users//user1//Valorant_Profiler)
let sessionFile = path.join(folder, 'session.json'); // Session file (stores user data temporarily)

// Login window
function createLoginWindow() {
    winLogin = new BrowserWindow({
        width: 700,
        height: 600,
        frame: false,
        resizable: false,
        maximizable: false,
        center: true,
        icon: iconFile,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: preloadFile,
        }
    });

    if (isDev) {
        winLogin.webContents.openDevTools();
    }
    winLogin.loadFile(path.join(__dirname, 'renderer/loginWin/loginWindow.html'));
}

// Main window
function createMainWindow() {
    winMain = new BrowserWindow({
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#000',
            symbolColor: '#FFF',
            height: 30
        },
        maximizable: false,
        icon: iconFile,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: preloadFile
        }
    });

    if (isDev) {
        winLogin.webContents.openDevTools();
    }
    winMain.loadFile(path.join(__dirname, 'renderer/mainMenuWin/mainMenuWindow.html'));
}

app.whenReady().then(() => {
    createLoginWindow();
    // createMainWindow();
    // winMain.maximize();

    // Check for root folder
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder); // Create new if it dosn't exist
    }

    // Check for session file
    if (!fs.existsSync(sessionFile)) {
        const emptyJSON = {};
        fs.writeFileSync(sessionFile, JSON.stringify(emptyJSON));
    }

    winLogin.on('closed', () => (winLogin = null));
    winMain.on('closed', () => (winMain = null));

    app.on('activate', () => {
        if (BrowserWindow().getAllWindows().length === 0) {
            createLoginWindow();
            createMainWindow();
        }
    });
})

// IPC
ipcMain.on('goto:login', () => {
    winLogin.loadFile('./renderer/loginWin/loginWindow.html');
})

ipcMain.on('goto:register', () => {
    winLogin.loadFile('./renderer/registerWin/registerWindow.html');
})

ipcMain.on('goto:mainMenu', () => {
    createMainWindow();
    winMain.maximize();
    winLogin.close();
})

ipcMain.on('action:logout', () => {
    winMain.close();
    if (winLogin === null) {
        createLoginWindow();
    } else {
        winLogin.show();
    }
})

ipcMain.on('action:close', () => {
    app.quit();
})

ipcMain.on('userProfile-update', (event, data) => {
    winMain.webContents.send('userProfile-update-forward', data);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})