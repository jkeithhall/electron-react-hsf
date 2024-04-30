const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { join } = require('path');
const isDev = require('electron-is-dev');
const { initializeMenu } = require('./menu');
const { getFilePath, getContent, saveFile, showSaveDialog, showDirectorySelectDialog, updateCurrentFile, checkUnsavedChanges, showFileSelectDialog } = require('./fileHandlers');

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

ipcMain.on('save-current-file', (event, filePath, content) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  saveFile(browserWindow, 'SIM', filePath, content);
});

ipcMain.on('show-directory-select-dialog', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showDirectorySelectDialog(browserWindow);
});

ipcMain.on('show-file-select-dialog', (event, directory, fileType) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showFileSelectDialog(browserWindow, directory, fileType);
});

ipcMain.on('update-open-file', (event, filePath, content) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  updateCurrentFile(browserWindow, filePath, content);
});

ipcMain.on('check-unsaved-changes', (event, content) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  const hasUnsavedChanges = checkUnsavedChanges(content);
  browserWindow.webContents.send('has-unsaved-changes', hasUnsavedChanges);
});

ipcMain.on('reset-current-file', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  updateCurrentFile(browserWindow, null, '');
});

ipcMain.handle('get-current-filepath', async (event) => {
  return await getFilePath();
});
ipcMain.handle('get-current-filecontent', async (event) => {
  return await getContent();
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