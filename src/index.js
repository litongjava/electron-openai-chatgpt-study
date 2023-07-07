const {app, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');
const contextMenu = require('electron-context-menu');
const config = require(path.join(__dirname, 'config.js'));

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true
  });

  // Load the URL from the config file.
  const url = config.url;
  mainWindow.loadURL(url);
  mainWindow.setAutoHideMenuBar(true);

  // Set the context menu.
  let rightClickMenu = [
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: () => {
        mainWindow.reload();
      }
    },
    {
      label: 'Force Reload',
      accelerator: 'CmdOrCtrl+Shift+R',
      click: () => {
        mainWindow.webContents.reloadIgnoringCache();
      }
    },
    {
      label: 'Go Back',
      click: () => {
        mainWindow.webContents.goBack();
      }
    },
    {
      label: 'Go Forward',
      click: () => {
        mainWindow.webContents.goForward();
      }
    },
    {
      label: 'Zoom In',
      accelerator: 'Ctrl+Shift+=',
      click: () => {
        let zoomLevel = mainWindow.webContents.getZoomLevel();
        mainWindow.webContents.setZoomLevel(zoomLevel + 1);
      }
    },
    {
      label: 'Zoom Out',
      accelerator: 'CmdOrCtrl+-',
      click: () => {
        let zoomLevel = mainWindow.webContents.getZoomLevel();
        mainWindow.webContents.setZoomLevel(zoomLevel - 1);
      }
    },
    {
      label: 'Reset Zoom',
      accelerator: 'CmdOrCtrl+0',
      click: () => {
        mainWindow.webContents.setZoomLevel(0);
      }
    },
    {
      label: 'Toggle Full Screen',
      accelerator: 'F11',
      click: () => {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    },
  ];
  contextMenu({
    window: mainWindow,
    prepend: (defaultActions, params, browserWindow) => rightClickMenu
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.