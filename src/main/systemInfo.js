// Import the systeminformation library for gathering system data
const si = require('systeminformation');

/**
 * Gathers system information using the systeminformation library
 * @returns {Promise<Object>} An object containing CPU, memory, OS, and disk information
 */
async function getSystemStats() {
    return {
        // Get CPU information (manufacturer, model, speed, etc.)
        cpu: await si.cpu(),
        // Get memory information (total, free, used)
        mem: await si.mem(),
        // Get operating system information (distro, release, hostname)
        os: await si.osInfo(),
        // Get disk information (size, free space, mount points)
        disk: await si.fsSize()
    }
}

// Export the function for use in the main process
module.exports = {
    getSystemStats
}