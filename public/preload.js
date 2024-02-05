const electron = require('electron');
const { ipcRenderer, contextBridge } = electron;

/*
  contextBridge exposes methods to the window object accessed on window.electronApi.
  This is a security measure to prevent the renderer process from accessing the entire electron API.
  Here, we expose the initalizeFileReaders method to the renderer process, which allows the renderer process
  to listen for the various '*-file-opened' events from the main process. When one of these events is received,
  the file contents are parsed and the relevant state variables are updated.
 */
contextBridge.exposeInMainWorld('electronApi', {
  initializeFileReaders: (parseJSONFile, setStateMethods) => {
    ipcRenderer.on('file-opened', (_, fileType, content, filePath) => {
      parseJSONFile(fileType, content, setStateMethods);
    });
  },
});