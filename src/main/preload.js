// Import required Electron modules for secure IPC communication
const { contextBridge, ipcRenderer } = require('electron');

// Create a secure bridge between the main process and renderer process
// This prevents direct access to Node.js and Electron APIs from the renderer
contextBridge.exposeInMainWorld('versions', {
    // Function to send messages to the main process
    send: (channel, data) => ipcRenderer.send(channel, data),
    // Function to receive messages from the main process
    receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    // Commented out version information that could be exposed if needed
    //node: () => process.versions.node,
    //chrome: () => process.versions.chrome,
    //electron: () => process.versions.electron
});