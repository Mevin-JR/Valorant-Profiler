const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
// const { log } = require('./database/db_operations');

let winLogin;
let winMain;

let logFile = path.join(__dirname, 'vpLogs.txt');

function createLoginWindow() {
    winLogin = new BrowserWindow({
        width: 700,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        frame: false,
        resizable: false,
        maximizable: false,
        center: true,
        icon: path.join(__dirname, 'renderer/logos/logo.ico'),
    });

    winLogin.webContents.openDevTools();
    winLogin.loadFile('./renderer/loginWin/loginWindow.html');
}

function createMainWindow() {
    winMain = new BrowserWindow({
        fullscreen: true,
        show: false
    });
    winMain.loadFile('./renderer/mainMenuWin/mainMenuWindow.html');
}

app.whenReady().then(() => {
    createLoginWindow();
    createMainWindow();

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
    winMain.show();
    winLogin.close();
    // log("Redirecting to main menu")
})

ipcMain.on('action:close', () => {
    app.quit();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})