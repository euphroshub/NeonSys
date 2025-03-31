// Import required modules from Electron and other dependencies
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getSystemStats } = require('./systemInfo');

// Store the main window reference globally
let mainWindow;

// Initialize the application when Electron is ready
app.whenReady().then(() => {
    // Create the main browser window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // Enable preload script for secure IPC communication
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Load the main HTML file into the window
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
});

// Set up IPC (Inter-Process Communication) handlers
// This listens for 'request-system-info' events from the renderer process
ipcMain.on('request-system-info', async (event, callback) => {
    // Get system information and send it back to the renderer process
    const stats = await getSystemStats();
    event.reply('system-info', stats);
});

// Handle application window closing
// On macOS, the app typically stays running when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
