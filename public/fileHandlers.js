const { dialog } = require('electron');
const { readFile, writeFile } = require('fs').promises;

const handleOpenFileClick = async (browserWindow, fileType) => {
  const fileObj = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })
  // If file selected open it
  if (fileObj) {
    const filePath = fileObj.filePaths[0];
    openFile(browserWindow, fileType, filePath);
  }
}

const handleSaveFileClick = async (browserWindow, fileType) => {
  browserWindow.webContents.send('file-download-click', fileType);
};

const showSaveDialog = async (browserWindow, content) => {
  const result = await dialog.showSaveDialog(browserWindow, {
    properties: ['showOverwriteConfirmation'],
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });

  if (result.canceled) return;

  const { filePath } = result;

  if (!filePath) return;


  saveFile(browserWindow, content, filePath);
};

const openFile = async (browserWindow, fileType, filePath) => {
  const fileName = filePath.split('/').pop();
  // Read file contents
  const content = await readFile(filePath, { encoding: 'utf-8' });

  // Send file contents to renderer process
  browserWindow.webContents.send('file-upload-selected', fileType, content, fileName);
};

const saveFile = async (browserWindow, content, filePath) => {
  console.log(`Saving file to ${filePath} with content: ${content}`);
  await writeFile(filePath, content);
};

module.exports = { handleOpenFileClick, handleSaveFileClick, showSaveDialog };


