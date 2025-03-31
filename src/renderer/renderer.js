// Wait for the DOM to be fully loaded before running our code
document.addEventListener('DOMContentLoaded', () => {
    // Initialize charts
    const cpuChart = new Chart(document.getElementById('cpuChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'CPU Usage (%)',
                data: [],
                borderColor: '#00ff9d',
                backgroundColor: 'rgba(0, 255, 157, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });

    const memoryChart = new Chart(document.getElementById('memoryChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Memory Usage (%)',
                data: [],
                borderColor: '#00ffff',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });

    const networkChart = new Chart(document.getElementById('networkChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Download (MB/s)',
                data: [],
                borderColor: '#00ff9d',
                backgroundColor: 'rgba(0, 255, 157, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Upload (MB/s)',
                data: [],
                borderColor: '#00ffff',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });

    // Start periodic updates
    window.versions.startUpdates();
    
    // Request system information from the main process
    window.versions.send('request-system-info');
    
    // Listen for the system information response from the main process
    window.versions.receive('system-info', (data) => {
        // Update the CPU information display
        document.getElementById('cpu').innerHTML = `
            <div class="info-header">CPU: ${data.cpu.manufacturer} ${data.cpu.brand}</div>
            <div class="usage-text">Current Usage: ${data.cpu.usagePercent}%</div>
        `;
        
        // Update CPU chart
        const timestamp = new Date().toLocaleTimeString();
        cpuChart.data.labels.push(timestamp);
        cpuChart.data.datasets[0].data.push(parseFloat(data.cpu.usagePercent));
        
        // Keep only last 30 data points
        if (cpuChart.data.labels.length > 30) {
            cpuChart.data.labels.shift();
            cpuChart.data.datasets[0].data.shift();
        }
        cpuChart.update();
        
        // Update the memory information display
        document.getElementById('memory').innerHTML = `
            <div class="info-header">Memory: ${Math.round(data.mem.total / 1e9)} GB</div>
            <div class="usage-text">Current Usage: ${data.mem.usagePercent}%</div>
        `;
        
        // Update memory chart
        memoryChart.data.labels.push(timestamp);
        memoryChart.data.datasets[0].data.push(parseFloat(data.mem.usagePercent));
        
        // Keep only last 30 data points
        if (memoryChart.data.labels.length > 30) {
            memoryChart.data.labels.shift();
            memoryChart.data.datasets[0].data.shift();
        }
        memoryChart.update();
        
        // Update the operating system information display
        document.getElementById('os').innerText = `OS: ${data.os.distro} ${data.os.release}`;
        
        // Update the disk information display
        document.getElementById('disk').innerHTML = data.disk.map(drive => `
            <div class="disk-drive">
                <div class="info-header">${drive.mount} (${Math.round(drive.size / 1e9)} GB)</div>
                <div class="usage-text">Usage: ${drive.usagePercent}%</div>
            </div>
        `).join('');

        // Update the network information display
        document.getElementById('network').innerHTML = data.network.map(net => `
            <div class="network-interface">
                <div class="info-header">${net.interface}</div>
                <div class="network-stats">
                    <div class="stat-row">
                        <span class="stat-label">Download:</span>
                        <span class="stat-value">${net.downloadSpeed} MB/s</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Upload:</span>
                        <span class="stat-value">${net.uploadSpeed} MB/s</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Total Download:</span>
                        <span class="stat-value">${net.totalDownload} GB</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Total Upload:</span>
                        <span class="stat-value">${net.totalUpload} GB</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Update network chart with the first interface's data
        if (data.network.length > 0) {
            networkChart.data.labels.push(timestamp);
            networkChart.data.datasets[0].data.push(parseFloat(data.network[0].downloadSpeed));
            networkChart.data.datasets[1].data.push(parseFloat(data.network[0].uploadSpeed));
            
            // Keep only last 30 data points
            if (networkChart.data.labels.length > 30) {
                networkChart.data.labels.shift();
                networkChart.data.datasets[0].data.shift();
                networkChart.data.datasets[1].data.shift();
            }
            networkChart.update();
        }
    });

    // Handle visibility changes to optimize performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.versions.stopUpdates();
        } else {
            window.versions.startUpdates();
        }
    });
});