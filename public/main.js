const { app, BrowserWindow, ipcMain, Menu, clipboard } = require('electron');
const path = require('path');
const { join } = require('path');
const isDev = require('electron-is-dev');
const { createMenu } = require('./menu');
const { exec, spawn } = require('child_process');
const {
  getFilePath,
  getContent,
  saveFile,
  showSaveDialog,
  showDirectorySelectDialog,
  buildInputFiles,
  updateCurrentFile,
  checkUnsavedChanges,
  showFileSelectDialog } = require('./fileHandlers');

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    fullscreen: true,
    backgroundColor: '#1f2330',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: isDev,
      preload: join(__dirname, 'preload.js'),
    }
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Initialize menu
  createMenu(mainWindow);
}

app.on('ready', createWindow);

ipcMain.on('show-save-dialog', (event, fileType, content, updateCache) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showSaveDialog(browserWindow, fileType, content, updateCache);
});

ipcMain.on('save-current-file', (event, filePath, content, updateCache) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  saveFile(browserWindow, 'SIM', filePath, content, updateCache);
});

ipcMain.on('show-directory-select-dialog', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showDirectorySelectDialog(browserWindow);
});

ipcMain.on('show-file-select-dialog', (event, directory, fileType) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showFileSelectDialog(browserWindow, directory, fileType);
});

ipcMain.on('build-input-files', (event, fileContents) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  buildInputFiles(browserWindow, fileContents);
});

ipcMain.on('update-open-file', (event, filePath, content) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  updateCurrentFile(browserWindow, filePath, content);
});

ipcMain.on('check-unsaved-changes', (event, content) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  const hasUnsavedChanges = checkUnsavedChanges(content);
  browserWindow.webContents.send('has-unsaved-changes', hasUnsavedChanges);
});

ipcMain.on('reset-current-file', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  updateCurrentFile(browserWindow, null, '');
});

ipcMain.on('set-autosave-status', (event, autosaveStatus) => {
  const revertStatus = Menu.getApplicationMenu().getMenuItemById('revert-changes').enabled;
  createMenu(mainWindow, autosaveStatus);
  Menu.getApplicationMenu().getMenuItemById('revert-changes').enabled = revertStatus;
});

ipcMain.on('set-revert-status', (event, status) => {
  Menu.getApplicationMenu().getMenuItemById('revert-changes').enabled = status;
});

ipcMain.handle('get-current-filepath', async (event) => {
  return await getFilePath();
});

ipcMain.handle('get-current-filecontent', async (event) => {
  return await getContent();
});

ipcMain.on('write-to-clipboard', (event, content) => {
  clipboard.writeText(content);
});

ipcMain.handle('copy-from-clipboard', () => {
  return clipboard.readText();
});

ipcMain.handle('check-docker-installed', async () => {
  try {
    const error = await new Promise((resolve, reject) => {
      exec('docker -v', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
    if (error) throw error;
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
});

ipcMain.handle('check-docker-running', async () => {
  try {
    const error = await new Promise((resolve, reject) => {
      exec('docker ps', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
    if (error) throw error;
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
});

ipcMain.handle('start-docker', async () => {
  try {
    const error = await new Promise((resolve, reject) => {
      exec('open -a docker && while ! docker info > /dev/null 2>&1; do sleep 1 ; done',
        (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
    if (error) throw error;
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
});

ipcMain.on('run-simulation', (event, inputFiles, outputDir) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  const { simulationFile, tasksFile, modelFile } = inputFiles;

  try {
    // Check input files for injection attacks
    if (inputFiles) {
      Object.values(inputFiles).forEach((file) => {
        if (file.includes(';') || file.includes('~') || file.includes('|') || file.includes('&')) {
          throw new Error('Invalid input file path');
        }
      });
    }

    // Construct the command and arguments
    const command = 'dotnet';
    const defaultArgs = [
      'run',
      '--',
      '-s', '../../samples/Aeolus/AeolusSimulationInput.json',
      '-t', '../../samples/Aeolus/AeolusTasks.json',
      '-m', '../../samples/Aeolus/DSAC_Static_Scripted.json'
    ];

    const args = inputFiles ? [
      'run',
      '--',
      '-s', simulationFile,
      '-t', tasksFile,
      '-m', modelFile,
    ] : defaultArgs;

    if (outputDir) {
      args.push('-o', outputDir);
    }

    console.log({ command, args });

    // Set the working directory to the path where Horizon is located
    const options = {
      shell: true,
      cwd: join(__dirname, '../Horizon/src/Horizon')
    };

    // Execute the command in spawned child process
    const simulation = spawn(command, args, options);

    simulation.stdout.on('data', (data) => {
      console.log(data.toString());
      browserWindow.webContents.send('simulation-results', {
        type: 'stdout',
        data: data.toString(),
        code: null,
      });
    });
    simulation.stderr.on('data', (data) => {
      console.error(data.toString());
      browserWindow.webContents.send('simulation-results', {
        type: 'stderr',
        data: data.toString(),
        code: null,
      });
    });
    simulation.on('error', (error) => {
      console.error(error);
      browserWindow.webContents.send('simulation-results', {
        type: 'error',
        error: error.message,
        code: null,
      });
    });
    simulation.on('close', (code) => {
      console.log(`Simulation exited with code ${code}`);
      browserWindow.webContents.send('simulation-results', {
        type: 'close',
        data: null,
        code,
      });
    });
  } catch (error) {
    console.log(error);
    browserWindow.webContents.send('simulation-results', {
      type: 'error',
      data: error.message,
      code: null,
    });
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});