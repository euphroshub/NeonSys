// Import the systeminformation library for gathering system data
const si = require('systeminformation');

/**
 * Gathers system information using the systeminformation library
 * @returns {Promise<Object>} An object containing CPU, memory, OS, and disk information with usage percentages
 */
async function getSystemStats() {
    // Get current CPU usage
    const cpuLoad = await si.currentLoad();
    
    // Get memory information
    const mem = await si.mem();
    const memoryUsagePercent = ((mem.total - mem.free) / mem.total * 100).toFixed(2);
    
    // Get disk information
    const disk = await si.fsSize();
    const diskUsagePercent = disk.map(drive => ({
        ...drive,
        usagePercent: ((drive.size - drive.available) / drive.size * 100).toFixed(2)
    }));

    return {
        // Get CPU information with current usage
        cpu: {
            ...await si.cpu(),
            usagePercent: cpuLoad.currentLoad.toFixed(2)
        },
        // Get memory information with usage percentage
        mem: {
            ...mem,
            usagePercent: memoryUsagePercent
        },
        // Get operating system information
        os: await si.osInfo(),
        // Get disk information with usage percentages
        disk: diskUsagePercent
    }
}

// Export the function for use in the main process
module.exports = {
    getSystemStats
}