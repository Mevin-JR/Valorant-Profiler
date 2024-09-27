const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
// const { log } = require('./database/db_operations');

let winLogin;
let winMain;

let folder = path.join(os.homedir(), "Valorant_Profiler")
let sessionFile = path.join(folder, 'session.json')
let logFile = path.join(__dirname, 'vpLogs.txt');

function createLoginWindow() {
    winLogin = new BrowserWindow({
        width: 700,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        frame: false,
        resizable: false,
        maximizable: false,
        center: true,
        icon: path.join(__dirname, 'renderer/logos/logo.ico'),
    });

    // winLogin.webContents.openDevTools();
    winLogin.loadFile('./renderer/loginWin/loginWindow.html');
}

function createMainWindow() {
    winMain = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#000',
            symbolColor: '#FFF',
            height: 30
        },
        maximizable: false,
        icon: path.join(__dirname, 'renderer/logos/logo.ico'),
        show: false
    });
    winMain.webContents.openDevTools();
    winMain.loadFile('./renderer/mainMenuWin/mainMenuWindow.html');
}

app.whenReady().then(() => {
    // createLoginWindow();
    createMainWindow();
    winMain.maximize();

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }

    if (!fs.existsSync(sessionFile)) {
        const emptyJSON = {};
        fs.writeFileSync(sessionFile, JSON.stringify(emptyJSON));
    }

    fs.access(logFile, fs.constants.F_OK, (err) => {
        if (err) {
            fs.writeFile(logFile, '', (err) => {
                if (err) {
                    console.error("Error creating log file:", err)
                } else {
                    console.log("Log file created successfully")
                }
            });
        }
    });

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
    // log("Redirecting to login")
})

ipcMain.on('goto:register', () => {
    winLogin.loadFile('./renderer/registerWin/registerWindow.html');
    // log("Redirecting to register")
})

ipcMain.on('goto:mainMenu', () => {
    createMainWindow();
    winMain.maximize();
    winLogin.close();

    // log("Redirecting to main menu")
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