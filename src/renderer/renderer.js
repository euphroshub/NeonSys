// Wait for the DOM to be fully loaded before running our code
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${button.dataset.tab}-tab`).classList.add('active');
        });
    });

    // Options handling
    const options = {
        backgroundOpacity: 100,
        cpuColor: '#00ff9d',
        memoryColor: '#00ffff',
        networkDownloadColor: '#00ff9d',
        networkUploadColor: '#00ffff',
        diskColor: '#00ff9d',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: 16,
        dataPoints: 15,
        updateInterval: 1000
    };

    // Load saved options
    const savedOptions = localStorage.getItem('monitorOptions');
    if (savedOptions) {
        Object.assign(options, JSON.parse(savedOptions));
        applyOptions();
    }

    // Background opacity
    const backgroundOpacity = document.getElementById('background-opacity');
    backgroundOpacity.value = options.backgroundOpacity;
    backgroundOpacity.addEventListener('input', (e) => {
        options.backgroundOpacity = e.target.value;
        // Update the opacity of all cards and containers
        document.querySelectorAll('.card, .options-container, .os-info, .network-interface, .progress-bar').forEach(element => {
            const currentBgColor = window.getComputedStyle(element).backgroundColor;
            const rgbaMatch = currentBgColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (rgbaMatch) {
                element.style.backgroundColor = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${e.target.value / 100})`;
            }
        });
        saveOptions();
    });

    // Colors
    const colorInputs = {
        'cpu-color': 'cpuColor',
        'memory-color': 'memoryColor',
        'network-download-color': 'networkDownloadColor',
        'network-upload-color': 'networkUploadColor',
        'disk-color': 'diskColor'
    };

    Object.entries(colorInputs).forEach(([inputId, optionKey]) => {
        const input = document.getElementById(inputId);
        input.value = options[optionKey];
        input.addEventListener('input', (e) => {
            options[optionKey] = e.target.value;
            updateChartColors();
            saveOptions();
        });
    });

    // Font settings
    const fontFamily = document.getElementById('font-family');
    fontFamily.value = options.fontFamily;
    fontFamily.addEventListener('change', (e) => {
        options.fontFamily = e.target.value;
        document.body.style.fontFamily = e.target.value;
        saveOptions();
    });

    const fontSize = document.getElementById('font-size');
    fontSize.value = options.fontSize;
    fontSize.addEventListener('input', (e) => {
        options.fontSize = e.target.value;
        document.body.style.fontSize = `${e.target.value}px`;
        saveOptions();
    });

    // Graph settings
    const dataPoints = document.getElementById('data-points');
    dataPoints.value = options.dataPoints;
    dataPoints.addEventListener('input', (e) => {
        options.dataPoints = parseInt(e.target.value);
        saveOptions();
    });

    const updateInterval = document.getElementById('update-interval');
    updateInterval.value = options.updateInterval;
    updateInterval.addEventListener('input', (e) => {
        options.updateInterval = parseInt(e.target.value);
        window.versions.stopUpdates();
        window.versions.startUpdates();
        saveOptions();
    });

    // Update value displays
    document.querySelectorAll('input[type="range"]').forEach(input => {
        const display = input.nextElementSibling;
        if (display && display.classList.contains('value-display')) {
            input.addEventListener('input', () => {
                display.textContent = input.id === 'font-size' ? 
                    `${input.value}px` : 
                    input.id === 'update-interval' ? 
                    `${input.value}ms` : 
                    `${input.value}%`;
            });
        }
    });

    function updateChartColors() {
        // Update CPU chart colors
        cpuChart.data.datasets[0].borderColor = options.cpuColor;
        cpuChart.data.datasets[0].backgroundColor = `${options.cpuColor}1A`;
        cpuChart.update('none');

        // Update memory chart colors
        memoryChart.data.datasets[0].borderColor = options.memoryColor;
        memoryChart.data.datasets[0].backgroundColor = `${options.memoryColor}1A`;
        memoryChart.update('none');

        // Update network chart colors
        networkChart.data.datasets[0].borderColor = options.networkDownloadColor;
        networkChart.data.datasets[0].backgroundColor = `${options.networkDownloadColor}1A`;
        networkChart.data.datasets[1].borderColor = options.networkUploadColor;
        networkChart.data.datasets[1].backgroundColor = `${options.networkUploadColor}1A`;
        networkChart.update('none');

        // Update disk pie chart colors
        diskPieChart.data.datasets[0].backgroundColor = [
            options.diskColor,
            `${options.diskColor}33`
        ];
        diskPieChart.data.datasets[0].borderColor = [
            options.diskColor,
            options.diskColor
        ];
        diskPieChart.update('none');
    }

    function applyOptions() {
        // Apply background opacity to all cards and containers
        document.querySelectorAll('.card, .options-container, .os-info, .network-interface, .progress-bar').forEach(element => {
            const currentBgColor = window.getComputedStyle(element).backgroundColor;
            const rgbaMatch = currentBgColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (rgbaMatch) {
                element.style.backgroundColor = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${options.backgroundOpacity / 100})`;
            }
        });
        
        // Apply font settings
        document.body.style.fontFamily = options.fontFamily;
        document.body.style.fontSize = `${options.fontSize}px`;
        
        // Apply colors
        updateChartColors();
    }

    function saveOptions() {
        localStorage.setItem('monitorOptions', JSON.stringify(options));
    }

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
        
        // Keep only last N data points based on options
        if (cpuChart.data.labels.length > options.dataPoints) {
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
        
        // Keep only last N data points based on options
        if (memoryChart.data.labels.length > options.dataPoints) {
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
            
            // Keep only last N data points based on options
            if (networkChart.data.labels.length > options.dataPoints) {
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
});