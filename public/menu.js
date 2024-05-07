const { app, Menu } = require('electron');
const {
  handleNewFileClick,
  handleOpenFileClick,
  handleSaveFileClick,
  handleAutosaveClick,
  handleFileDownloadClick
} = require('./fileHandlers');

const createMenu = (window, autosaveStatus = 'disabled') => {
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
          click() { handleNewFileClick(window); }
        },
        {
          label: 'Open...',
          click() { handleOpenFileClick(window, 'SIM'); }
        },
        {
          label: 'Save',
          click() { handleSaveFileClick(window); }
        },
        { type: 'separator' },
        { id: 'autosave',
          label: autosaveStatus === 'active' ? 'Autosave 🟢' : 'Autosave',
          click() { handleAutosaveClick(window); },
          enabled: autosaveStatus !== 'disabled'
        },
        // { type: 'separator' },
        // { id: 'revert-changes',
        //   label: 'Revert to Last Save',
        //   click() { handleRevertToLastSaveClick(window); },
        //   enabled: false
        // },
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
              click() { handleFileDownloadClick(window, 'Scenario'); }
            },
            {
              label: 'Tasks File',
              submenu: [
                {
                  label: 'JSON File\t\t\t',
                  click() { handleFileDownloadClick(window, 'Tasks'); }
                },
                {
                  label: 'CSV File',
                  click() { handleFileDownloadClick(window, 'CSV'); }
                }
              ]
            },
            {
              label: 'Model File',
              click() { handleFileDownloadClick(window, 'System Model'); }
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

module.exports = { createMenu };