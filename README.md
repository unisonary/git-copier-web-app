# Git Copier Web Application

A clean, simple web application for copying Git repositories with author rewriting and branch modernization.

## Features

- **Web Interface**: Simple HTML-based UI for easy repository copying
- **Author Rewriting**: Change commit author information during copy
- **Branch Modernization**: Automatically convert `master` branches to `main`
- **Safe Operations**: Non-interactive, clean output, safe Git operations

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```
   
   Or use the batch file on Windows:
   ```bash
   start-server.bat
   ```

3. **Open Your Browser**:
   Navigate to `http://localhost:3000`

## Project Structure

```
git-copier/
├── server/                 # Backend server
│   ├── index.js           # Express server
│   └── gitService.js      # Git operations logic
├── client/
│   └── public/
│       └── simple-app.html # Frontend UI
├── package.json            # Dependencies
├── start-server.bat        # Windows startup script
├── vercel.json            # Vercel deployment config
└── git-copier.sh          # Original bash script
```

## Usage

1. Enter the source repository URL (HTTPS or SSH)
2. Enter the destination repository URL
3. Optionally specify new author name and email
4. Click "Copy Repository" to start the process

## Deployment

The application is ready for deployment on:
- **Vercel** (recommended) - Use the included `vercel.json`
- **Heroku** - Add a `Procfile` with `web: node server/index.js`
- **Railway** - Direct deployment from GitHub
- **DigitalOcean App Platform** - Simple Node.js deployment

## Development

For development with auto-restart:
```bash
npm run dev
```

## Requirements

- Node.js 16+ 
- Git installed on the server
- Internet access for repository cloning

## License

MIT License - see LICENSE file for details.
