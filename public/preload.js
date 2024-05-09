const electron = require('electron');
const { ipcRenderer, contextBridge } = electron;

ipcRenderer.on('set-autosave-status', (_, status) => {
  ipcRenderer.send('set-autosave-status', status);
});
ipcRenderer.on('set-revert-status', (_, status) => {
  ipcRenderer.send('set-revert-status', status);
});

const api = {
  directorySeparator: process.platform === 'win32' ? '\\' : '/',
  onNewFile: (handleNewFile) => {
    ipcRenderer.on('new-file-click', async (_) => {
      handleNewFile();
    })
  },
  resetCurrentFile: () => {
    ipcRenderer.send('reset-current-file');
  },
  onFileOpen: (handleFileOpen) => {
    ipcRenderer.on('file-open-selected', async (_, filePath, fileName, content) => {
      handleFileOpen(filePath, fileName, content);
    });
  },
  confirmFileOpened: (filePath, content) => {
    ipcRenderer.send('update-open-file', filePath, content);
  },
  onFileUpload: (handleFileUpload) => {
    ipcRenderer.on('file-upload-selected', async (_, fileType, fileName, content) => {
      handleFileUpload(fileType, fileName, content);
    });
  },
  onFileDownload: (handleFileDownload) => {
    ipcRenderer.on('file-download-click', async (_, fileType) => {
      if (fileType === 'CSV') {
        handleFileDownload(fileType);
      } else {
        const content = await handleFileDownload(fileType);
        ipcRenderer.send('show-save-dialog', fileType, content);
      }
    });
  },
  onFileUpdate: (handleFileUpdate) => {
    ipcRenderer.on('has-unsaved-changes', (_, hasUnsavedChanges) => {
      handleFileUpdate(hasUnsavedChanges);
    });
  },
  onDirectorySelect: (handleDirectorySelect) => {
    ipcRenderer.send('show-directory-select-dialog');
    ipcRenderer.on('directory-selected', (_, filePath) => {
      handleDirectorySelect(filePath);
    });
  },
  selectFile: (directory, fileType, handleFileSelected) => {
    ipcRenderer.send('show-file-select-dialog', directory, fileType);
    ipcRenderer.on('file-selected', (_, filePath, fileName, content) => {
      handleFileSelected(filePath, fileName, content);
    });
  },
  onSaveFileClick: (handleSaveFile) => {
    ipcRenderer.on('file-save-click', () => {
      handleSaveFile(() => {}, true); // true indicates to update the cache
    })
  },
  onAutoSave: (handleSaveFile) => {
    ipcRenderer.on('autosave', () => {
      handleSaveFile(() => {}, false); // false indicates to not update the cache
    });
  },
  onRevert: (handleRevert) => {
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
    ipcRenderer.on('file-save-confirmed', (_, filePath) => {
      setFilePath(filePath);
      setHasUnsavedChanges(false);
      callback();
    });
  },
  hasUnsavedChanges: (updateStatus) => {
    ipcRenderer.send('set-revert-status', updateStatus);
  }
}
/*
  contextBridge exposes methods to the window object (accessed on a given API name).
  This is a security measure to prevent the renderer process from accessing the entire electron API.
 */
contextBridge.exposeInMainWorld('electronApi', api);