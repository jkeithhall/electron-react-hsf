const { app, dialog } = require('electron');
const { readFile, writeFile } = require('fs').promises;
const { basename } = require('path');

const currentFile = {};

const filters = {
  JSON: { name: 'JSON', extensions: ['json'] },
  CSV: { name: 'CSV', extensions: ['csv'] },
  SIM: { name: 'Sim File', extensions: ['sim'] },
};

const updateCurrentFile = (browserWindow, filePath) => {
  browserWindow.setRepresentedFilename(filePath);
  currentFile.filePath = filePath;
  basename(filePath);
  browserWindow.setTitle(`${basename(filePath)} - ${app.name}`);
};

const handleOpenFileClick = async (browserWindow, fileType) => {
  const fileObj = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [filters[fileType]],
  })
  // If file selected open it
  if (fileObj) {
    const filePath = fileObj.filePaths[0];
    openFile(browserWindow, fileType, filePath);
  }
}

const handleSaveFileClick = async (browserWindow, fileType) => {
  browserWindow.webContents.send('file-download-click', fileType);
};

const showSaveDialog = async (browserWindow, fileType, content) => {
  const result = await dialog.showSaveDialog(browserWindow, {
    properties: ['showOverwriteConfirmation'],
    filters: [filters[fileType]],
  });

  if (result.canceled) return;

  const { filePath } = result;

  if (!filePath) return;

  saveFile(browserWindow, fileType, content, filePath);
};

const showDirectorySelectDialog = async (browserWindow) => {
  const result = await dialog.showOpenDialog(browserWindow, {
    properties: ['openDirectory']
  });

  if (result.canceled) return;

  const { filePaths } = result;

  if (!filePaths) return;

  browserWindow.webContents.send('directory-selected', filePaths[0]);
}

const openFile = async (browserWindow, fileType, filePath) => {
  const fileName = filePath.split('/').pop();
  // Read file contents
  const content = await readFile(filePath, { encoding: 'utf-8' });

  if (fileType === 'SIM') {
    browserWindow.webContents.send('file-open-selected', content, fileName, filePath);
  } else {
    // Send file contents to renderer process
    browserWindow.webContents.send('file-upload-selected', fileType, content, fileName);
  }
};

const saveFile = async (browserWindow, fileType, content, filePath) => {
  await writeFile(filePath, content);
  browserWindow.webContents.emit('file-saved', filePath);
  if (fileType === 'SIM') {
    updateCurrentFile(browserWindow, filePath);
  }
};

module.exports = { saveFile, handleOpenFileClick, handleSaveFileClick, showSaveDialog, showDirectorySelectDialog, updateCurrentFile, currentFile };


