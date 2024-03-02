const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { join } = require('path');
const isDev = require('electron-is-dev');
const { initializeMenu } = require('./menu');
const { saveFile, showSaveDialog, showDirectorySelectDialog, updateCurrentFile } = require('./fileHandlers');

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

ipcMain.on('show-save-dialog', (event, fileType, content) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showSaveDialog(browserWindow, fileType, content);
});

ipcMain.on('save-current-file', (event, content, filePath) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  saveFile(browserWindow, 'SIM', content, filePath);
});

ipcMain.on('show-directory-select-dialog', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showDirectorySelectDialog(browserWindow);
});

ipcMain.on('update-open-file', (event, filePath) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  updateCurrentFile(browserWindow, filePath);
});

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