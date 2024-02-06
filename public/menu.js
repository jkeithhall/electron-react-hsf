const { app, Menu } = require('electron');
const { handleOpenFileClick } = require('./fileHandlers');

const initializeMenu = (window) => {
  const template = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Upload File',
          submenu: [
            {
              label: 'Scenario File',
              accelerator: 'CmdOrCtrl+O',
              click() { handleOpenFileClick(window, 'Scenario'); }
            },
            {
              label: 'Tasks File',
              click() { handleOpenFileClick(window, 'Tasks'); }
            },
            {
              label: 'Model File',
              click() { handleOpenFileClick(window, 'Model'); }
            }
          ]
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    { label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
      ]
    },
    { role: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://electronjs.org');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = { initializeMenu };