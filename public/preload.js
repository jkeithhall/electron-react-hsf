const electron = require('electron');
const path = require('path');
const { ipcRenderer, contextBridge } = electron;

ipcRenderer.on('set-autosave-status', (_, status) => {
  ipcRenderer.send('set-autosave-status', status);
});
ipcRenderer.on('set-revert-status', (_, status) => {
  ipcRenderer.send('set-revert-status', status);
});

const api = {
  directorySeparator: process.platform === 'win32' ? '\\' : '/',
  baseSrc: path.join(__dirname, '../Horizon/output'),
  pythonSrc: path.join(__dirname, '../Horizon/samples/Aeolus/pythonScripts'),
  getRelativePath: (from, to) => path.relative(from, to),
  notifyRenderComplete: () => ipcRenderer.send('render-complete'),
  onNewFile: (handleNewFile) => {
    ipcRenderer.removeAllListeners('new-file-click');

    ipcRenderer.on('new-file-click', async (_) => {
      handleNewFile();
    });
  },
  resetCurrentFile: () => {
    ipcRenderer.send('reset-current-file');
  },
  onFileOpen: (handleFileOpen) => {
    ipcRenderer.removeAllListeners('file-open-selected');

    ipcRenderer.on('file-open-selected', async (_, filePath, fileName, content) => {
      handleFileOpen(filePath, fileName, content);
    });
  },
  confirmFileOpened: (filePath, content) => {
    ipcRenderer.send('update-open-file', filePath, content);
  },
  onFileUpload: (handleFileUpload, ...args) => {
    ipcRenderer.removeAllListeners('file-upload-selected');

    ipcRenderer.on('file-upload-selected', async (_, fileType, fileName, content) => {
      handleFileUpload(fileType, fileName, content, ...args);
    });
  },
  onFileDownload: (handleFileDownload, ...args) => {
    ipcRenderer.removeAllListeners('file-download-click');

    ipcRenderer.on('file-download-click', async (_, fileType) => {
      if (fileType === 'CSV') {
        handleFileDownload(fileType, ...args);
      } else {
        const content = await handleFileDownload(fileType, ...args);
        ipcRenderer.send('show-save-dialog', fileType, content);
      }
    });
  },
  onFileUpdate: (handleFileUpdate) => {
    ipcRenderer.removeAllListeners('has-unsaved-changes');

    ipcRenderer.on('has-unsaved-changes', (_, hasUnsavedChanges) => {
      handleFileUpdate(hasUnsavedChanges);
    });
  },
  onDirectorySelect: (handleDirectorySelect) => {
    ipcRenderer.removeAllListeners('directory-selected');

    ipcRenderer.send('show-directory-select-dialog');
    ipcRenderer.on('directory-selected', (_, filePath) => {
      handleDirectorySelect(filePath);
    });
  },
  selectFile: (directory, fileType, handleFileSelected) => {
    ipcRenderer.removeAllListeners('file-selected');

    ipcRenderer.send('show-file-select-dialog', directory, fileType);
    ipcRenderer.on('file-selected', (_, filePath, fileName, content) => {
      handleFileSelected(filePath, fileName, content);
    });
  },
  onSaveFileClick: (handleSaveFile, ...args) => {
    ipcRenderer.removeAllListeners('file-save-click');

    ipcRenderer.on('file-save-click', () => {
      handleSaveFile(...args);
    })
  },
  onAutoSave: (handleSaveFile, ...args) => {
    ipcRenderer.removeAllListeners('autosave');

    ipcRenderer.on('autosave', () => {
      handleSaveFile(...args);
    });
  },
  onRevert: (handleRevert) => {
    ipcRenderer.removeAllListeners('revert-changes');

    ipcRenderer.on('revert-changes', (_, filePath, content) => {
      handleRevert(filePath, content);
    });
  },
  saveCurrentFile: (content, updateCache) => {
    ipcRenderer.invoke('get-current-filepath').then((filePath) => {
      if (filePath === null) {
        ipcRenderer.send('show-save-dialog', 'SIM', content, updateCache);
      } else {
        ipcRenderer.send('save-current-file', filePath, content, updateCache);
      }
    });
  },
  onSaveConfirm: (setFilePath, setHasUnsavedChanges, callback) => {
    ipcRenderer.removeAllListeners('file-save-confirmed');

    ipcRenderer.on('file-save-confirmed', (_, filePath) => {
      setFilePath(filePath);
      setHasUnsavedChanges(false);
      callback();
    });
  },
  onBuildInputFiles: (fileContents, callback) => {
    ipcRenderer.removeAllListeners('build-files-complete');

    ipcRenderer.on('build-files-complete', (_, data) => {
      callback(data);
    });
    ipcRenderer.send('build-input-files', fileContents);
  },
  hasUnsavedChanges: (updateStatus) => {
    ipcRenderer.send('set-revert-status', updateStatus);
  },
  writeToClipboard: (content) => {
    ipcRenderer.send('write-to-clipboard', content);
  },
  copyFromClipboard: (callback) => {
    ipcRenderer.invoke('copy-from-clipboard').then((content) => {
      callback(content);
    });
  },
  checkDockerInstalled: () => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('check-docker-installed').then((error) => {
        if (error) {
          resolve(error);
        } else {
          resolve();
        }
      });
    });
  },
  checkDockerRunning: () => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('check-docker-running').then((error) => {
        if (error) {
          resolve(error);
        } else {
          resolve();
        }
      });
    });
  },
  startDocker: () => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('start-docker').then((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },
  runSimulation: (inputFiles, outputFiles, handleSimulationResults) => {
    ipcRenderer.removeAllListeners('simulation-results');

    ipcRenderer.on('simulation-results', (_, data) => {
      handleSimulationResults(data);
    });
    ipcRenderer.send('run-simulation', inputFiles, outputFiles);
  },
  abortSimulation: (callback) => {
    ipcRenderer.removeAllListeners('abort-message');

    ipcRenderer.on('abort-message', (_, error) => {
      callback(error);
    });
    ipcRenderer.send('abort-simulation');
  },
  saveJDValue: (outputPath, fileName, startJD, callback) => {
    ipcRenderer.removeAllListeners('jd-value-error');

    ipcRenderer.send('save-jd-value', outputPath, fileName, startJD);
    ipcRenderer.on('jd-value-error', (_, error) => {
      callback(error);
    });
  },
  buildCzml: (outputPath, fileName, content, callback) => {
    ipcRenderer.removeAllListeners('build-czml-error');

    ipcRenderer.send('build-czml', outputPath, fileName, content);
    ipcRenderer.on('build-czml-error', (_, error) => {
      callback(error);
    });
  },
  fetchCzmlData: (outputPath, fileName, callback) => {
    ipcRenderer.removeAllListeners('cesium-data');

    ipcRenderer.send('fetch-czml', outputPath, fileName);
    ipcRenderer.on('cesium-data', (_, err, data) => {
      callback(err, data);
    });
  },
  fetchTimelineFiles: async (outputPath, handleOutput) => {
    ipcRenderer.removeAllListeners('timeline-files');

    ipcRenderer.send('fetch-timeline-files', outputPath);
    ipcRenderer.on('timeline-files', (_, data) => {
      handleOutput(data);
    });
  },
  fetchStateDataFiles: async (outputPath, handleOutput) => {
    ipcRenderer.removeAllListeners('state-data-files');

    ipcRenderer.send('fetch-state-data-files', outputPath);
    ipcRenderer.on('state-data-files', (_, data) => {
      handleOutput(data);
    });
  },
  fetchLatestTimelineData: async (outputPath, fileName, handleOutput) => {
    ipcRenderer.removeAllListeners('latest-timeline-data');

    ipcRenderer.send('fetch-latest-timeline-data', outputPath, fileName);
    ipcRenderer.on('latest-timeline-data', (_, data) => {
      handleOutput(data);
    });
  },
  fetchLatestStateData: async (outputPath, fileName, handleOutput) => {
    ipcRenderer.removeAllListeners('latest-state-data');

    ipcRenderer.send('fetch-latest-state-data', outputPath, fileName);
    ipcRenderer.on('latest-state-data', (_, data) => {
      handleOutput(data);
    });
  },
}
/*
  contextBridge exposes methods to the window object (accessed on a given API name).
  This is a security measure to prevent the renderer process from accessing the entire electron API.
 */
contextBridge.exposeInMainWorld('electronApi', api);