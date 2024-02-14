const electron = require('electron');
const { ipcRenderer, contextBridge } = electron;

/*
  onFileUpload takes a handleFileUpload callback (supplied by React) and subscribes it to the 'file-upload-selected' event.
  onFileDownload takes a handleFileDownload callback and subscribes it to the 'file-download-click' event.
  saveFile sends the 'show-save-dialog' event to the main process with the file content.
*/
const api = {
  onFileUpload: (handleFileUpload) => {
    ipcRenderer.on('file-upload-selected', (_, fileType, content, fileName) => {
      handleFileUpload(fileType, content, fileName);
    });
  },
  onFileDownload: (handleFileDownload) => {
    ipcRenderer.on('file-download-click', async (_, fileType) => {
      const content = await handleFileDownload(fileType);
      ipcRenderer.send('show-save-dialog', content);
    });
  },
  saveFile: (content) => ipcRenderer.send('show-save-dialog', content),
}
/*
  contextBridge exposes methods to the window object (accessed on a given API name).
  This is a security measure to prevent the renderer process from accessing the entire electron API.
 */
contextBridge.exposeInMainWorld('electronApi', api);