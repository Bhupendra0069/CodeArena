# CodeArena

CodeArena is a full-stack competitive programming app. Users can register, practice problems in an online editor, compete in timed coding battles, and view ratings and a leaderboard.

## Project Layout

- **Frontend:** `client/` contains the React user interface. Pages are in `client/src/pages/`, reusable components are in `client/src/components/`, and API calls are in `client/src/services/`. Vite serves it at `http://localhost:5173`.
- **Backend:** `server/` contains the Node.js and Express API. Routes and controllers handle requests; Mongoose models store application data; Socket.IO handles live battles. It listens at `http://localhost:5000`.
- **Database:** MongoDB stores accounts, problems, submissions, and matches. The backend must connect to MongoDB before it starts.
- **Code execution:** Judge0 is an external service for running submitted code. A Judge0 API key is needed for code execution, but not just to start the site.

## VS Code Extensions

No VS Code extension is required to run CodeArena. Install the project dependencies with `npm install` in both `client/` and `server/`; each folder's `package.json` lists its dependencies.

Optional: **MongoDB for VS Code** can help inspect a database, and **Prettier** can format files. Neither is required.

## Requirements

- Node.js 18 or newer, which includes npm
- MongoDB Community Server running locally, or a MongoDB Atlas database and connection string
- A Judge0 RapidAPI key only if you want to run or submit code

## Run on Windows

The commands below assume your VS Code workspace is the parent folder containing `codearena/` (in this workspace, that is `mern`). If you opened `codearena/` itself as the workspace, omit `codearena\` from the `cd` commands.

### 1. Configure and install the backend

In a VS Code terminal, run:

```powershell
cd .\codearena\server
npm install
Copy-Item .env.example .env
```

Open `server/.env`. Set `MONGODB_URI` to your running local MongoDB or Atlas connection string. The local example is `mongodb://localhost:27017/codearena`. Change `JWT_SECRET` to a long, private value. Keep `.env` files private; do not commit them.

To enable code execution, replace the placeholder `JUDGE0_API_KEY` with your RapidAPI key. This key is optional for other features.

### 2. Configure and install the frontend

Open a **second** VS Code terminal and run:

```powershell
cd .\codearena\client
npm install
Copy-Item .env.example .env
```

### 3. Add demo problems (optional)

For a new or disposable database only, run this in the backend terminal before starting the server:

```powershell
cd .\codearena\server
npm run seed
```

**Warning:** this command deletes all existing problem records before inserting its demo problems.

### 4. Start both parts

Start the backend in the first terminal:

```powershell
cd .\codearena\server
npm run dev
```

Start the frontend in the second terminal:

```powershell
cd .\codearena\client
npm run dev
```

Open `http://localhost:5173` in your browser. Check the backend at `http://localhost:5000/api/health`. Keep both terminals open while using the app. Press `Ctrl+C` in each terminal to stop its server.

## Common Startup Problems

- **MongoDB connection error:** Start MongoDB Community Server or correct `MONGODB_URI` in `server/.env`. The backend will not start without a working database connection.
- **`node` or `npm` is not recognized:** Install Node.js 18 or newer, then open a new VS Code terminal.
- **Port 5000 or 5173 is already in use:** Stop the other process using that port, then restart the affected server.
- **Run/Submit code returns an error:** Check that `JUDGE0_API_KEY` is a valid RapidAPI key. The rest of the app can run without it.

## Main Features

- JWT login and registration with password hashing
- Problem library and Monaco-based code editor
- Live two-player battles with Socket.IO and a server-controlled timer
- Judge0 code execution, ELO ratings, battle results, and leaderboard

## Important Folders

```text
codearena/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Shared interface components
│       ├── pages/          # App screens
│       ├── context/        # Authentication state
│       ├── hooks/          # Socket.IO hook
│       └── services/       # API client and requests
└── server/                 # Express + Socket.IO backend
    └── src/
        ├── config/         # MongoDB and Judge0 configuration
        ├── controllers/    # Request handling
        ├── models/         # MongoDB schemas
        ├── routes/         # API endpoints
        ├── services/       # Judging, matches, and ratings
        └── sockets/        # Real-time battle events
```
