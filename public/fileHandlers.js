const { app, dialog } = require('electron');
const { readFile, writeFile } = require('fs').promises;
const { basename } = require('path');

const currentFile = { content: '', filePath: null };
const directorySeparator = process.platform === 'win32' ? '\\' : '/';
let autosaveIntervalId = null;
let autosaveStatus = 'disabled';

const getFilePath = () => {
  return currentFile.filePath;
};
const getContent = () => {
  return currentFile.content;
};

const filters = {
  JSON: { name: 'JSON', extensions: ['json'] },
  CSV: { name: 'CSV', extensions: ['csv'] },
  SIM: { name: 'Sim File', extensions: ['sim'] },
  Python: { name: 'Python', extensions: ['py'] },
};

const updateCurrentFile = (browserWindow, filePath, content) => {
  currentFile.filePath = filePath;
  currentFile.content = content;
  if (autosaveStatus === 'disabled') {
    browserWindow.webContents.send('set-autosave-status', 'inactive');
  }

  if (filePath === null) {
    browserWindow.setRepresentedFilename('');
    browserWindow.setTitle(app.name);
    browserWindow.webContents.send('set-autosave-status', 'disabled');
  } else {
    browserWindow.setRepresentedFilename(filePath);
    browserWindow.setTitle(`${basename(filePath)} - ${app.name}`);
  }

  browserWindow.webContents.send('has-unsaved-changes', false);
};

const checkUnsavedChanges = (content) => {
  return content !== currentFile.content;
};

const handleNewFileClick = async (browserWindow) => {
  browserWindow.webContents.send('new-file-click');
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
};

const handleSaveFileClick = async (browserWindow) => {
  browserWindow.webContents.send('file-save-click');
};

const handleAutosaveClick = async (browserWindow) => {
  if (!autosaveIntervalId) {
    autosaveIntervalId = setInterval(() => { browserWindow.webContents.send('autosave'); }, 30000);
    autosaveStatus = 'active';
    browserWindow.webContents.send('set-autosave-status', 'active');
  } else {
    clearInterval(autosaveIntervalId);
    autosaveStatus = 'inactive';
    browserWindow.webContents.send('set-autosave-status', 'inactive');
  }
};


const handleFileDownloadClick = async (browserWindow, fileType) => {
  browserWindow.webContents.send('file-download-click', fileType);
};

const showSaveDialog = async (browserWindow, fileType, content, updateCache) => {
  const result = await dialog.showSaveDialog(browserWindow, {
    properties: ['showOverwriteConfirmation'],
    filters: [filters[fileType]],
  });

  if (result.canceled) return;

  const { filePath } = result;

  if (!filePath) return;

  saveFile(browserWindow, fileType, filePath, content, updateCache);
};

const showFileSelectDialog = async (browserWindow, directory, fileType) => {
  const result = await dialog.showOpenDialog(browserWindow, {
    defaultPath: directory,
    properties: ['openFile'],
    filters: [filters[fileType]],
  });

  if (result.canceled) return;

  const { filePaths } = result;
  if (!filePaths) return;

  const filePath = filePaths[0];
  const fileName = filePath.split(directorySeparator).pop();
  // Read file contents
  const content = await readFile(filePath, { encoding: 'utf-8' });

  browserWindow.webContents.send('file-selected', filePath, fileName, content);
}

const showDirectorySelectDialog = async (browserWindow) => {
  const result = await dialog.showOpenDialog(browserWindow, {
    properties: ['openDirectory']
  });

  if (result.canceled) return;

  const { filePaths } = result;

  if (!filePaths) return;

  browserWindow.webContents.send('directory-selected', filePaths[0]);
};

const openFile = async (browserWindow, fileType, filePath) => {
  const fileName = filePath.split(directorySeparator).pop();
  // Read file contents
  const content = await readFile(filePath, { encoding: 'utf-8' });

  if (fileType === 'SIM') {
    browserWindow.webContents.send('file-open-selected', filePath, fileName, content);
  } else {
    browserWindow.webContents.send('file-upload-selected', fileType, fileName, content);
  }
};

const saveFile = async (browserWindow, fileType, filePath, content, updateCache = false) => {
  await writeFile(filePath, content);
  browserWindow.webContents.send('file-save-confirmed');

  if (fileType === 'SIM' && updateCache) {
    updateCurrentFile(browserWindow, filePath, content);
  }
};

module.exports = {
  getFilePath,
  getContent,
  saveFile,
  handleNewFileClick,
  handleOpenFileClick,
  handleSaveFileClick,
  handleAutosaveClick,
  handleFileDownloadClick,
  showSaveDialog,
  showDirectorySelectDialog,
  updateCurrentFile,
  checkUnsavedChanges,
  showFileSelectDialog,
};


