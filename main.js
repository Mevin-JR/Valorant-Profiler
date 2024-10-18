const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

const log = require('electron-log');
log.info('App starting...');

// Development mode check
const isDev = false;

// Windows (Login & Main window)
let winLogin;
let winMain;

// File paths
const iconFile = path.join(__dirname, 'renderer/logo/logo.ico');
const preloadFile = path.join(__dirname, 'preload.js');
let folder;
let sessionFile;

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


// TODO: Setup auto updater with Github Release
app.whenReady().then(() => {
    createLoginWindow();
    
    folder = path.join(app.getPath('appData'), "Valorant Profiler"); // Root folder
    sessionFile = path.join(folder, 'session.json'); // Session file

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

// Check active session
function checkActiveSession() {
    try {
        const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));

        if (Object.keys(sessionData).length === 0) {
            winLogin.webContents.send('no-active-session');
        } else {
            winLogin.webContents.send('active-session-found', sessionData);
        }

    } catch (error) {
        console.error('Error reading session file:', error);
    }
}

// IPC
ipcMain.on('check-active-session', () => {
    checkActiveSession();
})

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
            // Auto adjust zoom (based on screen size)
            const primaryDisplay = screen.getPrimaryDisplay();
            const scaleFactor = primaryDisplay.size.width / 1920;
            winMain.webContents.setZoomFactor(scaleFactor);
            
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

    const emptyJSON = {};
    fs.writeFileSync(sessionFile, JSON.stringify(emptyJSON));

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