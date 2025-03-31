// Wait for the DOM to be fully loaded before running our code
document.addEventListener('DOMContentLoaded', () => {
    // Request system information from the main process
    window.versions.send('request-system-info');
    
    // Listen for the system information response from the main process
    window.versions.receive('system-info', (data) => {
        // Update the CPU information display with usage percentage
        document.getElementById('cpu').innerHTML = `
            <div class="info-header">CPU: ${data.cpu.manufacturer} ${data.cpu.brand}</div>
            <div class="usage-container">
                <div class="progress-bar">
                    <div class="progress" style="width: ${data.cpu.usagePercent}%"></div>
                </div>
                <span class="usage-text">${data.cpu.usagePercent}%</span>
            </div>
        `;
        
        // Update the memory information display with usage percentage
        document.getElementById('memory').innerHTML = `
            <div class="info-header">Memory: ${Math.round(data.mem.total / 1e9)} GB</div>
            <div class="usage-container">
                <div class="progress-bar">
                    <div class="progress" style="width: ${data.mem.usagePercent}%"></div>
                </div>
                <span class="usage-text">${data.mem.usagePercent}%</span>
            </div>
        `;
        
        // Update the operating system information display
        document.getElementById('os').innerText = `OS: ${data.os.distro} ${data.os.release}`;
        
        // Update the disk information display with usage percentages for each drive
        document.getElementById('disk').innerHTML = data.disk.map(drive => `
            <div class="disk-drive">
                <div class="info-header">${drive.mount} (${Math.round(drive.size / 1e9)} GB)</div>
                <div class="usage-container">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${drive.usagePercent}%"></div>
                    </div>
                    <span class="usage-text">${drive.usagePercent}%</span>
                </div>
            </div>
        `).join('');
    });
});