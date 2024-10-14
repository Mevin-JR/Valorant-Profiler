const { app, BrowserWindow, ipcMain, autoUpdater } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Development mode check
const isDev = true;

// Windows (Login & Main window)
let winLogin;
let winMain;

// File paths
let iconFile = path.join(__dirname, 'renderer/logo/logo.ico');
let preloadFile = path.join(__dirname, 'preload.js');
let folder = path.join(os.homedir(), "Valorant_Profiler"); // Root folder (C://Users//user1//Valorant_Profiler)
let sessionFile = path.join(folder, 'session.json'); // Session file (stores user data temporarily)

// Login window
function createLoginWindow() {
    winLogin = new BrowserWindow({
        width: 900,
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
        winMain.webContents.openDevTools();
    }
    winMain.loadFile(path.join(__dirname, 'renderer/mainMenuWin/mainMenuWindow.html'));
}

app.whenReady().then(() => {
    createLoginWindow();
    // createMainWindow();
    // winMain.maximize();


    // FIXME: Fix auto update
    const server = 'https://github.com';
    const url = `${server}/Mevin-JR/Valorant-Profiler/releases/download/${app.getVersion()}`;
    autoUpdater.setFeedURL({ url });
    autoUpdater.checkForUpdates();

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

});

// AutoUpdater event listeners
autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
    winLogin.webContents.send('checking-for-update');
});

autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info);
    winLogin.webContents.send('update-available', info);
});

autoUpdater.on('update-not-available', (info) => {
    console.log('No updates available:', info);
    winLogin.webContents.send('update-not-available', info);
});

autoUpdater.on('error', (err) => {
    console.log('Error during update check:', err);
    winLogin.webContents.send('error', err);
});

autoUpdater.on('download-progress', (progressObj) => {
    console.log(`Download progress: ${progressObj.percent}%`);
});

autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded, restarting app...');
    autoUpdater.quitAndInstall();
});

// IPC
ipcMain.on('goto:login', () => {
    winLogin.loadFile('renderer/loginWin/loginWindow.html');
})

ipcMain.on('goto:mainMenu', () => {
    if (winLogin && !winLogin.isDestroyed()) {
        winLogin.close();
        winLogin = null;
    }

    if (!winMain) {
        createMainWindow();
        winMain.webContents.once('did-finish-load', () => {
            winMain.webContents.send('load-home');
        });
    } else {
        winMain.webContents.send('load-home');
    }

    winMain.maximize();
});

ipcMain.on('action:logout', () => {
    if (winMain && !winMain.isDestroyed()) {
        winMain.close();
        winMain = null;
    }

    if (!winLogin) {
        createLoginWindow()
    }
})

ipcMain.on('action:close', () => {
    app.quit();
});

ipcMain.on('userProfile-update', (event, data) => {
    winMain.webContents.send('userProfile-update-forward', data);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});