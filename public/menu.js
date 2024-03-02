const { app, Menu } = require('electron');
const { handleOpenFileClick, handleSaveFileClick } = require('./fileHandlers');

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
          label: 'New\t\t\t',
          click() { window.webContents.send('file-new-click'); }
        },
        {
          label: 'Open...',
          click() { handleOpenFileClick(window, 'SIM'); }
        },
        {
          label: 'Save',
          click() { handleSaveFileClick(window, 'SIM'); }
        },
        { type: 'separator' },
        {
          label: 'Upload \t\t\t',
          submenu: [
            {
              label: 'Scenario File...\t\t',
              click() { handleOpenFileClick(window, 'Scenario'); }
            },
            {
              label: 'Tasks File',
              submenu: [
                {
                  label: 'JSON File...\t\t',
                  click() { handleOpenFileClick(window, 'Tasks'); }
                },
                {
                  label: 'CSV File...',
                  click() { handleOpenFileClick(window, 'CSV'); }
                }
              ]
            },
            {
              label: 'Model File...',
              click() { handleOpenFileClick(window, 'System Model'); }
            }
          ]
        },
        {
          label: 'Export',
          submenu: [
            {
              label: 'Scenario File\t\t\t',
              click() { handleSaveFileClick(window, 'Scenario'); }
            },
            {
              label: 'Tasks File',
              submenu: [
                {
                  label: 'JSON File\t\t\t',
                  click() { handleSaveFileClick(window, 'Tasks'); }
                },
                {
                  label: 'CSV File',
                  click() { handleSaveFileClick(window, 'CSV'); }
                }
              ]
            },
            {
              label: 'Model File',
              click() { handleSaveFileClick(window, 'System Model'); }
            }
          ]
        }
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