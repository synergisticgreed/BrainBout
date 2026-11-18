# BrainBout
Matchmaking quiz platform 


# Description 
BrainBout is a real-time, competitive 1v1 educational trivia platform. Users configure their academic standard, age, and specific interests (such as Mathematics, Coding, or Artificial Intelligence) to enter a matchmaking queue. The engine pairs them with a peer of similar criteria for a high-speed, 10-question duel. Utilizing a WebSocket-driven architecture, the platform registers answer submissions in milliseconds, rewarding the fastest correct respondent and creating a highly engaging, synchronized multiplayer experience.

# BrainBout 🧠⚡️

A real-time 1v1 quiz duel application built with React, Node.js, and Socket.IO. Players select their standard, age, and topic to match instantly with opponents worldwide for a 10-question rapid-fire trivia battle.

## Features
- **Targeted Matchmaking:** Pair up based on Standard (e.g., 10th Grade, College) and Topic (Coding, AI, Math).
- **Real-Time Synchronization:** Sub-millisecond question syncing and answer validation using WebSockets.
- **Speed-Based Scoring:** The first player to answer correctly wins the point for that round.
- **Modern UI:** Clean, responsive interface built with Tailwind CSS.

## Tech Stack
- **Frontend:** React.js, Tailwind CSS, Socket.IO-client
- **Backend:** Node.js, Express.js, Socket.IO
- **Deployment:** Vercel (Frontend), Render/Railway (Backend)

## Quick Start
1. **Clone and Install:**
   ```bash
   git clone [https://github.com/yourusername/brainbout.git](https://github.com/yourusername/brainbout.git)
   cd brainbout/backend && npm install
   cd ../frontend && npm install

   ```
2. Run the Backend:
  ```
  cd backend
node server.js # Runs on localhost:5000
  ```
3. Run the Frontend:
  ```
  cd frontend
npm run dev # Runs on localhost:5173
  ```
