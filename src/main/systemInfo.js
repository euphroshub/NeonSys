// Import the systeminformation library for gathering system data
const si = require('systeminformation');

// Store previous network stats for speed calculation
let previousNetworkStats = null;

/**
 * Gathers system information using the systeminformation library
 * @returns {Promise<Object>} An object containing CPU, memory, OS, disk, and network information with usage percentages
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

    // Get network information
    const currentNetworkStats = await si.networkStats();
    let networkInfo = [];

    if (previousNetworkStats) {
        networkInfo = currentNetworkStats.map((net, index) => {
            const prev = previousNetworkStats[index];
            const timeDiff = 1; // 1 second between updates
            
            // Calculate speeds in MB/s
            const downloadSpeed = ((net.rx_bytes - prev.rx_bytes) / (1024 * 1024 * timeDiff)).toFixed(2);
            const uploadSpeed = ((net.tx_bytes - prev.tx_bytes) / (1024 * 1024 * timeDiff)).toFixed(2);
            
            return {
                interface: net.iface,
                downloadSpeed: downloadSpeed,
                uploadSpeed: uploadSpeed,
                totalDownload: (net.rx_bytes / (1024 * 1024 * 1024)).toFixed(2), // Convert to GB
                totalUpload: (net.tx_bytes / (1024 * 1024 * 1024)).toFixed(2)    // Convert to GB
            };
        });
    } else {
        // First run, initialize with zero speeds
        networkInfo = currentNetworkStats.map(net => ({
            interface: net.iface,
            downloadSpeed: "0.00",
            uploadSpeed: "0.00",
            totalDownload: (net.rx_bytes / (1024 * 1024 * 1024)).toFixed(2), // Convert to GB
            totalUpload: (net.tx_bytes / (1024 * 1024 * 1024)).toFixed(2)    // Convert to GB
        }));
    }

    // Store current stats for next calculation
    previousNetworkStats = currentNetworkStats;

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
        disk: diskUsagePercent,
        // Get network information
        network: networkInfo
    }
}

// Export the function for use in the main process
module.exports = {
    getSystemStats
}