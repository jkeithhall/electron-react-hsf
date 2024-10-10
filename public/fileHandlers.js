const { app, dialog } = require('electron');
const { existsSync, mkdirSync } = require('fs');
const { readFile, writeFile, readdir, appendFile } = require('fs').promises;
const { join, basename } = require('path');

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

const handleRevertClick = async (browserWindow) => {
  browserWindow.webContents.send('revert-changes', currentFile.filePath, currentFile.content);
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

const buildOutputDir = () => {
  const output = join(__dirname, '../Horizon/output');
  if (!existsSync(output)) {
    mkdirSync(output);
  }
}

const fetchTimelineFiles = async (outputPath) => {
  try {
    const fileContents = await readdir(outputPath);
    return fileContents.filter((file) => file.startsWith('output')).reverse();
  } catch (error) {
    console.error('Error fetching timeline files:', error);
    throw error;
  }
}

const fetchStateDataFiles = async (outputPath) => {
  try {
    // outputpath/HorizonLog
    const fileContents = await readdir(join(outputPath, 'HorizonLog'));
    return fileContents.filter((file) => file.endsWith('.csv') && file.startsWith('Scratch\\'));
  } catch (error) {
    console.error('Error fetching state data files:', error);
    throw error;
  }
}

const fetchLatestTimelineData = async (filePath, fileName) => {
  try {
    const content = await readFile(join(filePath, fileName), { encoding: 'utf-8' });
    const startJDContent = await readFile(join(filePath, 'jdValues.csv'), { encoding: 'utf-8' });
    const startJD = startJDContent.split('\n').filter((line) => line.includes(fileName))[0].split(',')[1];
    return { content, startJD };
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    throw error;
  }
}

const fetchLatestStateData = async (filePath, fileName) => {
  try {
    const content = await readFile(join(filePath, 'HorizonLog', fileName), { encoding: 'utf-8' });
    const startJDContent = await readFile(join(filePath, 'jdValues.csv'), { encoding: 'utf-8' });
    const startJD = startJDContent.split('\n').findLast((line) => line !== '').split(',')[1];
    return { content, startJD };
  } catch (error) {
    console.error('Error fetching state data:', error);
    throw error;
  }
}

const buildInputFiles = async (browserWindow, fileContents) => {
  const baseSrc = join(__dirname, '../Horizon/output');
  const { simulationJSON, tasksJSON, modelJSON } = fileContents;
  const fileNames = {
    simulationFile: join(baseSrc, 'scenario.json'),
    tasksFile: join(baseSrc, 'tasks.json'),
    modelFile: join(baseSrc, 'model.json'),
  };
  // Save files
  try {
    await writeFile(fileNames.simulationFile, simulationJSON);
    await writeFile(fileNames.tasksFile, tasksJSON);
    await writeFile(fileNames.modelFile, modelJSON);
    browserWindow.webContents.send('build-files-complete', fileNames);
  } catch (error) {
    console.error(error);
    browserWindow.webContents.send('build-files-complete', error);
    return;
  }
};

const saveJDValue = async (outputPath, fileName, startJD) => {
  const line = `${fileName},${startJD}\n`;
  console.log(`Saving JD value: ${line} to ${join(outputPath, 'jdValues.csv')}`);
  appendFile(join(outputPath, 'jdValues.csv'), line, (err) => {
    console.error(err);
    throw err;
  });
}

const saveFile = async (browserWindow, fileType, filePath, content, updateCache = false) => {
  await writeFile(filePath, content);
  browserWindow.webContents.send('file-save-confirmed', filePath);

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
  buildOutputDir,
  fetchTimelineFiles,
  fetchStateDataFiles,
  fetchLatestTimelineData,
  fetchLatestStateData,
  buildInputFiles,
  saveJDValue,
  updateCurrentFile,
  checkUnsavedChanges,
  showFileSelectDialog,
  handleRevertClick,
};


