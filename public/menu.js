const { Menu, MenuItem } = require('electron');
const { handleOpenFileClick } = require('./fileHandlers');

const initializeMenu = (window) => {
  const menu = Menu.getApplicationMenu();
  menu.items[1].submenu.append(new MenuItem({
    label: 'Upload Scenario File',
    accelerator: 'CmdOrCtrl+O',
    click() { handleOpenFileClick(window, 'Scenario'); }
  }));
  menu.items[1].submenu.append(new MenuItem({
    label: 'Upload Tasks File',
    // accelerator: 'CmdOrCtrl+O',
    click() { handleOpenFileClick(window, 'Tasks'); }
  }));
  menu.items[1].submenu.append(new MenuItem({
    label: 'Upload Model File',
    // accelerator: 'CmdOrCtrl+O',
    click() { handleOpenFileClick(window, 'Model'); }
  }));

  Menu.setApplicationMenu(menu);
}

module.exports = { initializeMenu };