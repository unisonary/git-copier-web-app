# git-copier-web-app

## Overview
The Git Copier Web App is a full-stack application that allows users to copy Git repositories while rewriting commit history and modernizing branch names. It features a server built with Express and a client built with React.

## Features
- Clone Git repositories
- Change commit authorship
- Rename branches from `master` to `main`
- User-friendly interface for repository operations

## Project Structure
```
git-copier-web-app
├── src
│   ├── server
│   │   ├── index.ts          # Entry point for the server application
│   │   ├── controllers
│   │   │   └── repoController.ts  # Handles repository-related requests
│   │   ├── services
│   │   │   └── gitService.ts      # Interacts with Git repositories
│   │   ├── routes
│   │   │   └── index.ts           # Sets up application routes
│   │   └── types
│   │       └── index.ts           # Defines request and response types
│   └── client
│       ├── index.tsx              # Entry point for the client application
│       ├── components
│       │   └── RepoForm.tsx       # Form for user input
│       └── styles
│           └── app.css            # CSS styles for the client application
├── package.json                    # npm configuration file
├── tsconfig.json                   # TypeScript configuration file
├── .gitignore                      # Files and directories to ignore by Git
└── README.md                       # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd git-copier-web-app
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
1. Start the server:
   ```
   npm run start:server
   ```
2. Start the client:
   ```
   npm run start:client
   ```
3. Access the application in your browser at `http://localhost:3000`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.