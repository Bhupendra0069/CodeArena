# PROJECT: CodeArena — Real-Time Competitive Coding Platform

## 1. Project Overview

Build a full-stack web application called **CodeArena**.

CodeArena is a competitive programming platform where users can:
- Register and log in.
- Practice programming problems.
- Write and execute code in an online code editor.
- Challenge other users to real-time coding battles.
- Compete against another user by solving the same programming problem.
- See a live battle timer and submission status.
- Automatically determine the winner.
- View their battle history, ratings, and leaderboard rankings.

The main idea is to combine the coding practice experience of platforms like LeetCode with the competitive real-time experience of coding battles.

This should look and feel like a modern, professional developer platform.

Do not simply create a static frontend. Build a fully functional application with a working frontend, backend, database, code execution integration, and real-time communication.

---

## 2. Technology Stack

Use the following technologies. Do not replace them with unrelated technologies.

### Frontend
- React.js
- Vite
- JavaScript (ES6+)
- React Router DOM
- Axios
- Tailwind CSS
- Monaco Editor

### Backend
- Node.js
- Express.js
- JavaScript ES Modules
- MongoDB
- Mongoose
- Socket.IO
- JWT authentication
- bcryptjs for password hashing

### Code Execution
- Judge0 API for executing user-submitted code.
- Use Judge0 to compile and execute code safely.
- Support at least Python, JavaScript, Java, and C++.
- Never execute arbitrary user code directly on the Express server.
- Store Judge0 credentials in environment variables.

### Development Tools
- Git and GitHub
- Nodemon
- Postman for API testing
- dotenv
- ESLint if useful

---

## 3. Project Folder Structure

Use this folder structure and maintain separation of concerns.

codearena/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── ProblemCard.jsx
│   │   │   ├── BattleCard.jsx
│   │   │   └── LeaderboardTable.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Problems.jsx
│   │   │   ├── ProblemDetails.jsx
│   │   │   ├── CreateBattle.jsx
│   │   │   ├── BattleRoom.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useBattleSocket.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── problemService.js
│   │   │   ├── battleService.js
│   │   │   └── submissionService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── judge0.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Problem.js
│   │   │   ├── Match.js
│   │   │   ├── Submission.js
│   │   │   └── RatingHistory.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── problemController.js
│   │   │   ├── battleController.js
│   │   │   ├── submissionController.js
│   │   │   └── leaderboardController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── problemRoutes.js
│   │   │   ├── battleRoutes.js
│   │   │   ├── submissionRoutes.js
│   │   │   └── leaderboardRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── rateLimitMiddleware.js
│   │   │
│   │   ├── services/
│   │   │   ├── judgeService.js
│   │   │   ├── matchService.js
│   │   │   └── ratingService.js
│   │   │
│   │   ├── sockets/
│   │   │   └── battleSocket.js
│   │   │
│   │   ├── utils/
│   │   │   └── generateRoomCode.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── database-design.md
│   └── testing.md
│
├── .gitignore
└── README.md

You may add additional files when technically necessary, but do not unnecessarily change the architecture.

Keep the frontend and backend independent.

---

## 4. Main Application Design

Create a modern dark-themed developer interface.

### Design direction

Use a professional coding-platform appearance:
- Dark background.
- Dark navy and charcoal surfaces.
- Purple, blue, or cyan accent colors.
- Clean typography.
- Rounded cards.
- Subtle borders and hover effects.
- Consistent spacing.
- Responsive design for desktop, tablet, and mobile.
- Loading states, error messages, and empty states.

Avoid excessive gradients, unnecessary animations, and clutter.

Use Lucide React icons where appropriate.

### Main navigation

The navigation bar should contain:

- CodeArena logo.
- Home.
- Problems.
- Battles.
- Leaderboard.
- Login/Register when logged out.
- User profile menu when logged in.

After authentication, users should be able to access their dashboard and profile.

---

## 5. Required Features

### A. Authentication System

Users must be able to:

1. Register with username, email, and password.
2. Log in with email and password.
3. Log out.
4. Access protected pages only after authentication.
5. View their profile.

Requirements:
- Hash passwords using bcryptjs.
- Use JWT authentication.
- Validate user input on the backend.
- Never store plain-text passwords.
- Prevent duplicate usernames and emails.
- Implement secure token handling.
- Protect private API routes with authentication middleware.

### B. Dashboard

After login, users should see a dashboard containing:

- Welcome message.
- Total problems solved.
- Total battles played.
- Total battles won.
- Current rating.
- Recent battle history.
- Quick action to practice problems.
- Quick action to create a battle.
- Current leaderboard position if available.

Dashboard statistics must come from the backend, not hardcoded values.

### C. Problem Library

Create a programming problem library.

Each problem should contain:

- Title.
- Description.
- Difficulty: Easy, Medium, Hard.
- Topic or category.
- Input format.
- Output format.
- Constraints.
- Example input.
- Example output.
- Explanation.
- Test cases.
- Time limit.
- Memory limit.

Users should be able to:

- View all problems.
- Search problems by title.
- Filter by difficulty.
- Open a problem details page.
- Read the problem statement.
- Write code in Monaco Editor.
- Select a programming language.
- Submit their solution.

Create some sample programming problems to demonstrate the platform.

Important: Keep hidden test cases on the backend. Never send hidden test cases to the frontend.

### D. Online Code Editor

Use Monaco Editor.

The editor should provide:

- Syntax highlighting.
- Language selection.
- Code input.
- Run button.
- Submit button.
- Reset code button.
- Output panel.
- Submission result panel.

Support these languages initially:

- Python
- JavaScript
- Java
- C++

When a user runs code:
1. Send the code, language, and selected problem to the backend.
2. Backend validates the request.
3. Backend sends the code to Judge0.
4. Judge0 executes the code.
5. Backend processes the execution result.
6. Frontend displays the output.

Show appropriate statuses:
- Accepted.
- Wrong Answer.
- Compilation Error.
- Runtime Error.
- Time Limit Exceeded.
- Internal Error.

Do not expose hidden test cases or Judge0 API credentials.

### E. Create a Coding Battle

Authenticated users should be able to create a coding battle.

The user should be able to:

- Select a difficulty.
- Select a battle duration.
- Create a battle room.
- Receive a unique room code.
- Share that room code with another user.

A second authenticated user should be able to join using the room code.

For the first version, support two players per battle.

Battle lifecycle:

1. Player A creates a room.
2. Player A waits for an opponent.
3. Player B joins using the room code.
4. Both players see that the opponent has joined.
5. The battle starts when both players are ready.
6. Both receive the same problem.
7. The timer starts.
8. Both players independently solve the problem.
9. Their submissions are evaluated.
10. The winner is determined.
11. The final result is stored in MongoDB.

Prevent users from joining a full room or joining a battle they are not authorized to access.

### F. Real-Time Battle System

Use Socket.IO.

The battle interface should update in real time.

Required events:

- Join battle room.
- Player joined.
- Player ready.
- Battle started.
- Timer update.
- Submission status update.
- Opponent submitted.
- Battle finished.
- Player disconnected.
- Player reconnected.

Both players should see:

- Opponent username.
- Opponent connection status.
- Shared problem.
- Battle timer.
- Their own code editor.
- Their own submission status.
- Opponent submission status.

Do not send one player's private code to the other player unless explicitly required.

Important:
- The server must be the authority for battle state and time.
- Do not trust client-side timer values.
- Validate every socket event.
- Ensure only the two authorized players can access the battle room.
- Handle disconnects and reconnections.
- Avoid duplicate battle completion or duplicate winner calculations.

### G. Winner Determination

The first player who submits a solution that passes all required test cases wins.

If neither player solves the problem before time runs out, the result should be a draw.

If one player disconnects, implement a clearly defined disconnection policy and show the result to both players.

The server must verify accepted submissions before declaring a winner.

Store the following battle information:

- Players.
- Problem.
- Start time.
- End time.
- Duration.
- Winner.
- Result.
- Submissions.
- Player ratings before and after the match.

Prevent a user from claiming a win by manipulating frontend requests.

### H. Results Page

After a battle finishes, display:

- Player A.
- Player B.
- Winner.
- Problem title.
- Battle duration.
- Submission status.
- Rating changes.
- Result: Win, Loss, or Draw.

Provide a button to return to the dashboard or create another battle.

### I. Leaderboard

Create a leaderboard page.

Display:

- Rank.
- Username.
- Rating.
- Battles played.
- Battles won.
- Win rate.

Sort users by rating.

Leaderboard information must be retrieved from MongoDB through the backend.

### J. User Profile

Each user profile should display:

- Username.
- Join date.
- Current rating.
- Problems solved.
- Battles played.
- Battles won.
- Win rate.
- Recent battle history.

Users should only be able to edit their own permitted profile information.

---

## 6. MongoDB Database Design

Use Mongoose models.

### User Model

Fields:
- username
- email
- password
- rating (default 1000)
- problemsSolved
- battlesPlayed
- battlesWon
- createdAt

### Problem Model

Fields:
- title
- description
- difficulty
- category
- inputFormat
- outputFormat
- constraints
- examples
- hiddenTestCases
- timeLimit
- memoryLimit
- createdAt

### Match Model

Fields:
- roomCode
- players
- problem
- status
- duration
- startTime
- endTime
- winner
- result
- submissions
- createdAt

### Submission Model

Fields:
- user
- problem
- match
- sourceCode
- language
- verdict
- executionTime
- memoryUsed
- submittedAt

### RatingHistory Model

Fields:
- user
- match
- previousRating
- newRating
- change
- createdAt

Use proper MongoDB references, validation, indexes, and timestamps where appropriate.

Never store passwords in Match or Submission documents.

---

## 7. Backend API Structure

Use REST APIs with clear routes and controllers.

Suggested endpoints:

### Authentication
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

### Problems
GET /api/problems
GET /api/problems/:id
POST /api/problems (admin only)

### Submissions
POST /api/submissions/run
POST /api/submissions/submit
GET /api/submissions/history

### Battles
POST /api/battles
POST /api/battles/join
GET /api/battles/:id
GET /api/battles/history

### Leaderboard
GET /api/leaderboard

### User
GET /api/users/:id
GET /api/users/me

Use proper HTTP status codes and consistent JSON response structures.

Add centralized error handling and request validation.

---

## 8. Security Requirements

Build the application using professional security practices.

- Hash passwords.
- Validate and sanitize incoming data.
- Protect private routes.
- Use rate limiting for authentication and code execution endpoints.
- Never expose API secrets.
- Never execute code directly on the backend server.
- Keep hidden test cases private.
- Verify battle membership on every protected battle operation.
- Validate socket connections and events.
- Prevent users from submitting results or winner information manually.
- Configure CORS appropriately.
- Use environment variables.
- Do not commit .env files.
- Handle errors without exposing sensitive server information.

---

## 9. Environment Variables

Create `.env.example` files.

Backend environment variables should include:

PORT=5000
MONGODB_URI=
JWT_SECRET=
JUDGE0_API_URL=
JUDGE0_API_KEY=
CLIENT_URL=http://localhost:5173

Frontend environment variables should include:

VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

Do not put backend secrets in frontend environment variables.

Never invent working credentials. Explain which services require user configuration.

---

## 10. Implementation Plan

Build the project in the following phases.

### Phase 1 — Foundation
- Initialize React + Vite.
- Initialize Express.
- Configure MongoDB.
- Connect frontend and backend.
- Create health-check endpoint.
- Create initial UI and navigation.

### Phase 2 — Authentication
- Create User model.
- Implement register and login.
- Implement JWT authentication.
- Create AuthContext.
- Implement protected routes.
- Test authentication.

### Phase 3 — Problem Library
- Create Problem model.
- Create problem APIs.
- Add sample problems.
- Build problem listing page.
- Build problem details page.
- Implement search and difficulty filters.

### Phase 4 — Online Code Execution
- Integrate Monaco Editor.
- Integrate Judge0.
- Implement language selection.
- Implement Run and Submit.
- Process test cases and verdicts.
- Display execution results.

### Phase 5 — Real-Time Battles
- Implement Match model.
- Implement room creation.
- Implement room joining.
- Integrate Socket.IO.
- Implement player-ready system.
- Implement shared problem and timer.
- Handle disconnect and reconnect.

### Phase 6 — Results and Ratings
- Implement accepted submission verification.
- Implement winner determination.
- Save battle results.
- Implement rating calculation.
- Implement battle history.
- Implement leaderboard.

### Phase 7 — Finalization
- Improve UI.
- Add loading and error states.
- Test all application flows.
- Fix bugs.
- Add security checks.
- Write README documentation.
- Prepare deployment instructions.

---

## 11. Code Quality Requirements

This is an educational portfolio project, but the implementation should follow professional development practices.

1. Use clean and readable code.
2. Follow MVC-style separation on the backend.
3. Keep controllers separate from business logic.
4. Use reusable React components.
5. Avoid unnecessary duplication.
6. Use async/await consistently.
7. Handle errors properly.
8. Use meaningful variable and function names.
9. Add comments for complex logic.
10. Do not put the entire backend in one file.
11. Do not put the entire frontend in App.jsx.
12. Do not use fake data for features that should use the database.
13. Do not leave buttons that appear functional but do nothing.
14. Do not leave important features as TODO comments.
15. Keep dependencies reasonable.

---

## 12. Testing Requirements

Test the following complete user journey:

1. A new user registers.
2. The user logs in.
3. The user opens the problem library.
4. The user opens a programming problem.
5. The user writes code.
6. The user runs the code.
7. The user receives the correct execution result.
8. The user creates a battle.
9. Another user joins the battle.
10. Both users see the same problem.
11. Both users see the synchronized timer.
12. One user submits an accepted solution.
13. The server determines the winner.
14. Both users see the result.
15. The database stores the match.
16. The leaderboard reflects the rating changes.

Also test invalid input, incorrect solutions, compilation errors, unauthorized access, disconnected users, expired battles, and duplicate submissions.

---

## 13. Instructions for Antigravity

Follow these instructions carefully.

### First: Inspect and plan

Before writing code:

- Inspect the existing workspace.
- Check whether folders or files already exist.
- Do not overwrite existing working code without checking it.
- Create a short implementation plan.
- Identify required dependencies.
- Create the project documentation.

### Second: Implement incrementally

Do not generate the entire application in one enormous code dump.

Work phase by phase.

For each phase:

1. Explain what you are implementing.
2. Create the required folders and files.
3. Write the actual working code.
4. Explain the purpose of important files.
5. Install necessary dependencies.
6. Configure environment variables.
7. Run the application.
8. Test the implemented functionality.
9. Fix errors before moving to the next phase.
10. Summarize what was completed.

### Third: Beginner-friendly explanations

I am learning full-stack development.

Explain important concepts in simple language.

For example:
- Explain what a model does.
- Explain what a controller does.
- Explain how routes connect to controllers.
- Explain how React communicates with Express.
- Explain how Socket.IO communicates between two players.
- Explain how Judge0 executes code.
- Explain how MongoDB stores users, problems, submissions, and matches.

Do not assume that I already understand advanced concepts.

### Fourth: Important restrictions

- Do not skip backend implementation.
- Do not create only a frontend demonstration.
- Do not use fake authentication.
- Do not simulate code execution with hardcoded results.
- Do not use setTimeout as a replacement for real-time battle logic.
- Do not trust the frontend for security-sensitive decisions.
- Do not hardcode API keys.
- Do not claim a feature works unless it has actually been implemented and tested.
- If an external service requires credentials, tell me how to configure it.
- If an external service is unavailable, explain the limitation rather than pretending it works.

### Fifth: Start with Phase 1

Begin by inspecting my workspace and implementing Phase 1 only.

Do not immediately generate all phases.

When Phase 1 is complete, show me:
- The final folder structure.
- All files created.
- Dependencies installed.
- How to run the frontend.
- How to run the backend.
- How to test the health-check endpoint.
- What each important file does.

Wait for my approval before starting Phase 2.

## Final Goal

Deliver a complete, functional, responsive, secure, real-time competitive coding platform called **CodeArena**.

The final application should allow two registered users to compete against each other by solving the same programming problem in real time, with actual code execution through Judge0, server-controlled battle logic, automatic winner determination, persistent match history, and a rating-based leaderboard.