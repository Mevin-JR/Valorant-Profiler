const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 700,
        height: 600,
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
        resizable: false,
        maximizable: false,
        icon: path.join(__dirname, 'renderer/logos/logo.ico'),
    });
    
    // win.webContents.openDevTools()
    win.loadFile('./renderer/loginWin/loginWindow.html');
}

app.whenReady().then(() => {
    createWindow();
})

ipcMain.on('goto:login', () => {
    win.loadFile('./renderer/loginWin/loginWindow.html');
})

ipcMain.on('goto:register', () => {
    win.loadFile('./renderer/registerWin/registerWindow.html');
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})