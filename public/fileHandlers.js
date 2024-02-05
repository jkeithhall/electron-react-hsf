const { dialog } = require('electron');
const { readFile } = require('fs').promises;

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

const openFile = async (browserWindow, fileType, filePath) => {
  const fileName = filePath.split('/').pop();
  // Read file contents
  const content = await readFile(filePath, { encoding: 'utf-8' });

  // Send file contents to renderer process
  browserWindow.webContents.send('file-selected', fileType, content, fileName);
};

module.exports = { handleOpenFileClick };


