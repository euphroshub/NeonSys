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
        width: 1024,
        height: 768,
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

// Set up periodic system information updates
let updateInterval;

ipcMain.on('start-updates', (event) => {
    // Send initial update
    getSystemStats().then(stats => event.reply('system-info', stats));
    
    // Set up periodic updates every 1 second
    updateInterval = setInterval(async () => {
        const stats = await getSystemStats();
        event.reply('system-info', stats);
    }, 1000);
});

ipcMain.on('stop-updates', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
});

// Handle application window closing
// On macOS, the app typically stays running when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});