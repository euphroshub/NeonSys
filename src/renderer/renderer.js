// Wait for the DOM to be fully loaded before running our code
document.addEventListener('DOMContentLoaded', () => {
    // Common chart options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000, // Increase animation duration for smoother transitions
            easing: 'easeInOutQuart',
            delay: 0 // Remove any delay
        },
        elements: {
            line: {
                tension: 0.9, // Increase tension for smoother curves
                borderWidth: 2,
                fill: true,
                stepped: false // Ensure smooth lines
            },
            point: {
                radius: 0 // Hide points for cleaner look
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    color: '#ffffff',
                    font: {
                        size: 12
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    color: '#ffffff',
                    font: {
                        size: 12
                    },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 6
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        }
    };

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
                fill: true,
                tension: 0.8 // Add tension here as well
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    max: 100
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
                fill: true,
                tension: 0.8 // Add tension here as well
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    max: 100
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
                fill: true,
                tension: 0.8 // Add tension here as well
            }, {
                label: 'Upload (MB/s)',
                data: [],
                borderColor: '#00ffff',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                fill: true,
                tension: 0.8 // Add tension here as well
            }]
        },
        options: commonOptions
    });

    const diskPieChart = new Chart(document.getElementById('diskPieChart'), {
        type: 'doughnut',
        data: {
            labels: ['Used', 'Free'],
            datasets: [{
                data: [0, 0],
                backgroundColor: [
                    '#00ff9d',
                    'rgba(0, 255, 157, 0.2)'
                ],
                borderColor: [
                    '#00ff9d',
                    '#00ff9d'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${percentage}%`;
                        }
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
        const cpuUsage = document.getElementById('cpu-usage');
        const cpuProgress = document.getElementById('cpu-progress');
        cpuUsage.textContent = `${data.cpu.usagePercent}%`;
        cpuProgress.style.width = `${data.cpu.usagePercent}%`;
        
        // Update CPU chart
        const timestamp = new Date().toLocaleTimeString();
        cpuChart.data.labels.push(timestamp);
        cpuChart.data.datasets[0].data.push(parseFloat(data.cpu.usagePercent));
        
        // Keep only last 15 data points for smoother visualization
        if (cpuChart.data.labels.length > 15) {
            cpuChart.data.labels.shift();
            cpuChart.data.datasets[0].data.shift();
        }
        cpuChart.update('active');
        
        // Update the memory information display
        const memoryUsage = document.getElementById('memory-usage');
        const memoryProgress = document.getElementById('memory-progress');
        memoryUsage.textContent = `${data.mem.usagePercent}%`;
        memoryProgress.style.width = `${data.mem.usagePercent}%`;
        
        // Update memory chart
        memoryChart.data.labels.push(timestamp);
        memoryChart.data.datasets[0].data.push(parseFloat(data.mem.usagePercent));
        
        // Keep only last 15 data points for smoother visualization
        if (memoryChart.data.labels.length > 15) {
            memoryChart.data.labels.shift();
            memoryChart.data.datasets[0].data.shift();
        }
        memoryChart.update('active');
        
        // Update the operating system information display
        document.getElementById('os-name').textContent = `${data.os.distro} ${data.os.release}`;
        
        // Update the disk information display
        const diskInfo = document.getElementById('disk-info');
        diskInfo.innerHTML = data.disk.map(drive => `
            <div class="disk-drive">
                <div class="info-header">${drive.mount} (${Math.round(drive.size / 1e9)} GB)</div>
                <div class="usage-text">Usage: ${drive.usagePercent}%</div>
            </div>
        `).join('');

        // Update disk usage and progress
        const diskUsage = document.getElementById('disk-usage');
        const diskProgress = document.getElementById('disk-progress');
        if (data.disk.length > 0) {
            const usagePercent = data.disk[0].usagePercent;
            diskUsage.textContent = `${usagePercent}%`;
            diskProgress.style.width = `${usagePercent}%`;

            // Update disk pie chart
            diskPieChart.data.datasets[0].data = [
                parseFloat(usagePercent),
                100 - parseFloat(usagePercent)
            ];
            diskPieChart.update('active');
        }

        // Update the network information display
        const networkInfo = document.getElementById('network-info');
        networkInfo.innerHTML = data.network.map(net => `
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
            
            // Keep only last 15 data points for smoother visualization
            if (networkChart.data.labels.length > 15) {
                networkChart.data.labels.shift();
                networkChart.data.datasets[0].data.shift();
                networkChart.data.datasets[1].data.shift();
            }
            networkChart.update('active');
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

    // Tab Switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Theme Switching
    document.querySelectorAll('.theme-button').forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    });

    // Font Settings
    const fontFamilySelect = document.getElementById('font-family');
    const fontSizeInput = document.getElementById('font-size');

    // Load saved font settings
    const savedFontFamily = localStorage.getItem('fontFamily') || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    const savedFontSize = localStorage.getItem('fontSize') || '16';

    fontFamilySelect.value = savedFontFamily;
    fontSizeInput.value = savedFontSize;

    // Apply font settings
    function applyFontSettings() {
        document.body.style.fontFamily = fontFamilySelect.value;
        document.body.style.fontSize = `${fontSizeInput.value}px`;
    }

    // Save and apply font settings on change
    fontFamilySelect.addEventListener('change', () => {
        localStorage.setItem('fontFamily', fontFamilySelect.value);
        applyFontSettings();
    });

    fontSizeInput.addEventListener('input', () => {
        localStorage.setItem('fontSize', fontSizeInput.value);
        applyFontSettings();
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'neon';
    document.body.setAttribute('data-theme', savedTheme);

    // Apply initial font settings
    applyFontSettings();
});