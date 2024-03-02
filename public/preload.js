const electron = require('electron');
const { ipcRenderer, contextBridge } = electron;
const { currentFile } = require('./fileHandlers');

/*
  onFileOpen takes a handleFileOpen callback (supplied by React), subscribes it to the 'file-open-selected' event, and sets the filePath to be updated on 'file-open-confirmed'.
  confirmFileOpened triggers the 'file-open-confirmed' event.
  onFileUpload takes a handleFileUpload callback and subscribes it to the 'file-upload-selected' event.
  onFileDownload takes a handleFileDownload callback and subscribes it to the 'file-download-click' event.
  saveFile sends the 'show-save-dialog' event to the main process with the file content.
*/
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
      if (fileType !== 'SIM' || !currentFile.filePath) {
        ipcRenderer.send('show-save-dialog', fileType, content);
      } else {
        ipcRenderer.send('save-current-file', content, currentFile.filePath);
      }
    });
  },
  onDirectorySelect: (handleDirectorySelect) => {
    ipcRenderer.send('show-directory-select-dialog');
    ipcRenderer.on('directory-selected', (_, absolutePath) => {
      handleDirectorySelect(absolutePath);
    });
  },
  saveFile: (fileType, content) => ipcRenderer.send('show-save-dialog', fileType, content),
}
/*
  contextBridge exposes methods to the window object (accessed on a given API name).
  This is a security measure to prevent the renderer process from accessing the entire electron API.
 */
contextBridge.exposeInMainWorld('electronApi', api);