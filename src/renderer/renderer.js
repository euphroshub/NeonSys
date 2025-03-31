// Wait for the DOM to be fully loaded before running our code
document.addEventListener('DOMContentLoaded', () => {
    // Request system information from the main process
    window.versions.send('request-system-info');
    
    // Listen for the system information response from the main process
    window.versions.receive('system-info', (data) => {
        // Update the CPU information display
        document.getElementById('cpu').innerText = `CPU: ${data.cpu.manufacturer} ${data.cpu.brand}`;
        
        // Update the memory information display (converting bytes to GB)
        document.getElementById('memory').innerText = `Memory: ${Math.round(data.mem.total / 1e9)} GB`;
        
        // Update the operating system information display
        document.getElementById('os').innerText = `OS: ${data.os.distro} ${data.os.release}`;
        
        // Update the disk information display (converting bytes to GB)
        // data.disk is an array of disk information, we're using the first disk
        document.getElementById('disk').innerText = `Disk: ${Math.round(data.disk[0].size / 1e9)} GB`;
    });
});