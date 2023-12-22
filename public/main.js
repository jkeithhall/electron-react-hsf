const { app, BrowserWindow, dialog, Menu, MenuItem, ipcMain } = require('electron')

const path = require('path')
const isDev = require('electron-is-dev')
const fs = require('fs')
const { electron } = require('process')

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )

  const menu = Menu.getApplicationMenu();
  menu.items[0].submenu.append(new MenuItem({
    label: 'Open',
    accelerator: 'CmdOrCtrl+O',
    click() {
        dialog.showOpenDialog({
            properties: ['openFile']
        })
        .then(function(fileObj) {
            if (!fileObj.canceled) {
                //console.log("Opened File")
                win.webContents.send('FILE_OPEN', fileObj.filePaths)
            }
        })
        .catch(function(err) {
            console.error(err)
        })
    }
  }));

  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})