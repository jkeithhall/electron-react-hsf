const electron = require('electron');
const { ipcRenderer, contextBridge } = electron;

/*
  contextBridge exposes methods to the window object (accessed on a given API name).
  This is a security measure to prevent the renderer process from accessing the entire electron API.
  Here, we expose onFileSelect, a function that takes a handleFileSelect callback to be supplied by React,
  and calls that function when the "file-selected" event is triggered from the main process.
 */
contextBridge.exposeInMainWorld('electronApi', {
  onFileSelect: (handleFileSelect) => {
    ipcRenderer.on('file-selected', (_, fileType, content, fileName) => {
      handleFileSelect(fileType, content, fileName);
    });
  }
});