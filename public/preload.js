const electron = require('electron');
const { ipcRenderer, contextBridge } = electron;

const currentFile = { content: '', filePath: null };
ipcRenderer.on('file-updated', (_, filePath, content) => {
  currentFile.filePath = filePath;
  currentFile.content = content;
});

const api = {
  onFileOpen: (handleFileOpen) => {
    ipcRenderer.on('file-open-selected', async (_, content, fileName, filePath) => {
      handleFileOpen('SIM', content, fileName);
      ipcRenderer.on('file-open-confirmed', () => {
        ipcRenderer.send('update-open-file', filePath);
      });
    });
  },
  confirmFileOpened: () => {
    ipcRenderer.send('file-open-confirmed');
  },
  onFileUpload: (handleFileUpload) => {
    ipcRenderer.on('file-upload-selected', async (_, fileType, content, fileName) => {
      handleFileUpload(fileType, content, fileName);
    });
  },
  onFileDownload: (handleFileDownload) => {
    ipcRenderer.on('file-download-click', async (_, fileType) => {
      const content = await handleFileDownload(fileType);
      const filePath = currentFile.filePath;
      if (fileType !== 'SIM' || filePath === null) {
        ipcRenderer.send('show-save-dialog', fileType, content);
      } else {
        ipcRenderer.send('save-current-file', content, filePath);
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
    ipcRenderer.on('directory-selected', (_, absolutePath) => {
      handleDirectorySelect(absolutePath);
    });
  },
  onSaveFileClick: (handleSaveFile) => {
    ipcRenderer.on('file-save-click', () => {
      handleSaveFile();
    })
  },
  saveCurrentFile: (content) => {
    const filePath = currentFile.filePath;
    if (filePath === null) {
      ipcRenderer.send('show-save-dialog', 'SIM', content);
    } else {
      ipcRenderer.send('save-current-file', content, filePath);
    }
  },
  getCurrentFileContent: () => {
    return currentFile.content;
  }
}
/*
  contextBridge exposes methods to the window object (accessed on a given API name).
  This is a security measure to prevent the renderer process from accessing the entire electron API.
 */
contextBridge.exposeInMainWorld('electronApi', api);