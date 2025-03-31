# NeonSys

Currently building a beautiful system monitoring application with neon aesthetics, built with Electron to learn Electron.

## Features

- Real-time system information display
- Beautiful neon-themed UI
- Cross-platform support
- System information including:
  - CPU details
  - Memory usage
  - Operating system information
  - Disk space

## Installation

### From Source

1. Clone the repository:
```bash
git clone https://github.com/euphroshub/neonsys.git
cd neonsys
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

### Pre-built Packages

#### Linux (Debian/Ubuntu)
```bash
# Download the .deb package from releases
sudo dpkg -i neonsys-*.deb
```

#### macOS
Download the .dmg file from releases and drag the application to your Applications folder.

#### Windows
Download the .exe installer from releases and run it.

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Building

To build the application for different platforms:

```bash
# Build for Linux (Debian/Ubuntu)
npm run dist:linux

# Build for macOS
npm run dist:mac

# Build for Windows
npm run dist:win

# Build for all platforms
npm run dist
```

The built packages will be available in the `dist` directory.

## Project Structure

```
neonsys/
├── src/
│   ├── main/           # Main process code
│   ├── renderer/       # Renderer process code
│   └── assets/         # Assets (icons, images)
├── dist/               # Build output directory
└── package.json        # Project configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

euphros <euphros@protonmail.com>

## Acknowledgments

- [Electron](https://www.electronjs.org/)
- [systeminformation](https://github.com/sebhildebrandt/systeminformation)
