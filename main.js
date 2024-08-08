const { app, BrowserWindow } = require('electron')
const path = require('node:path')

function createWindow() {
    const win = new BrowserWindow({
        width: 700,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        // frame: false,
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

    win.loadFile('./renderer/loginWin/loginWindow.html')
}

app.whenReady().then(() => {
    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})