const { app, dialog } = require('electron');
const { readFile, writeFile } = require('fs').promises;
const { basename } = require('path');

const currentFile = { content: '', filePath: null };

const filters = {
  JSON: { name: 'JSON', extensions: ['json'] },
  CSV: { name: 'CSV', extensions: ['csv'] },
  SIM: { name: 'Sim File', extensions: ['sim'] },
};

const updateCurrentFile = (browserWindow, filePath, content) => {
  browserWindow.setRepresentedFilename(filePath);

  currentFile.filePath = filePath;
  currentFile.content = content;

  browserWindow.setTitle(`${basename(filePath)} - ${app.name}`);
  browserWindow.webContents.send('file-updated', currentFile.filePath, currentFile.content);
  browserWindow.webContents.send('has-unsaved-changes', false);
};

const checkUnsavedChanges = (content) => {
  return content !== currentFile.content;
}

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

const handleSaveFileClick = async (browserWindow) => {
  browserWindow.webContents.send('file-save-click');
}

const handleFileDownloadClick = async (browserWindow, fileType) => {
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
    updateCurrentFile(browserWindow, filePath, content);
  }
};

module.exports = { saveFile, handleOpenFileClick, handleSaveFileClick, handleFileDownloadClick, showSaveDialog, showDirectorySelectDialog, updateCurrentFile, checkUnsavedChanges };


