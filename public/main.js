const { app, BrowserWindow } = require('electron');
const path = require('path');
const { join } = require('path');
const isDev = require('electron-is-dev');
const { initializeMenu } = require('./menu');
const { ipcMain } = require('electron');

ipcMain.on('get-data', (event) => {
  event.reply('get-data', 'Data from main process');
})

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    fullscreen: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: isDev,
      preload: join(__dirname, 'preload.js'),
    }
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  // Initialize menu
  initializeMenu(win);
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});