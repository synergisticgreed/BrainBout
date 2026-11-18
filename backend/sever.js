### Backend Code (Node.js + Express + Socket.IO)

This backend prototype handles dynamic room creation, preference-based matchmaking, and real-time game state management. 

**`server.js`**
```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Mock database of questions
const questionsDb = {
  coding: [
    { q: "What does DOM stand for?", options: ["Data Object Model", "Document Object Model", "Disk Operating Module", "Dynamic Object Model"], ans: 1 },
    // ... assume 9 more questions here for the prototype
  ],
  ai: [
    { q: "Which algorithm is used in neural networks to minimize error?", options: ["Binary Search", "Backpropagation", "Merge Sort", "A* Search"], ans: 1 },
    // ... assume 9 more questions here
  ]
};

// Queue for matchmaking based on topic and standard
let waitingPlayers = {}; 
const activeGames = {};

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('findMatch', ({ topic, standard }) => {
    const queueKey = `${topic}-${standard}`;
    
    if (waitingPlayers[queueKey]) {
      // Match found
      const opponent = waitingPlayers[queueKey];
      const roomId = `room-${socket.id}`;
      
      socket.join(roomId);
      opponent.join(roomId);
      delete waitingPlayers[queueKey]; // Remove from queue

      activeGames[roomId] = {
        players: [socket.id, opponent.id],
        scores: { [socket.id]: 0, [opponent.id]: 0 },
        currentQuestion: 0,
        answeredThisRound: false,
        topic: topic.toLowerCase()
      };

      io.to(roomId).emit('matchFound', { roomId });
      setTimeout(() => sendNextQuestion(roomId), 2000); // Start after 2 seconds
    } else {
      // Wait in queue
      waitingPlayers[queueKey] = socket;
      socket.emit('waiting', { message: 'Looking for an opponent...' });
    }
  });

  socket.on('submitAnswer', ({ roomId, selectedOption }) => {
    const game = activeGames[roomId];
    if (!game || game.answeredThisRound) return;

    const currentQ = questionsDb[game.topic][game.currentQuestion];
    
    if (selectedOption === currentQ.ans) {
      // First person to get it right wins the point
      game.answeredThisRound = true;
      game.scores[socket.id] += 1;
      
      io.to(roomId).emit('roundResult', { 
        winner: socket.id, 
        correctAnswer: currentQ.ans,
        scores: game.scores 
      });

      game.currentQuestion += 1;
      
      if (game.currentQuestion >= 10) {
        setTimeout(() => io.to(roomId).emit('gameOver', { scores: game.scores }), 2000);
      } else {
        setTimeout(() => sendNextQuestion(roomId), 3000);
      }
    } else {
      // If wrong, notify player but let the opponent keep trying
      socket.emit('wrongAnswer');
    }
  });

  socket.on('disconnect', () => {
    // Handle cleanup for waiting or active players
    for (const key in waitingPlayers) {
      if (waitingPlayers[key].id === socket.id) delete waitingPlayers[key];
    }
  });
});

function sendNextQuestion(roomId) {
  const game = activeGames[roomId];
  if (!game) return;
  
  game.answeredThisRound = false;
  const qData = questionsDb[game.topic][game.currentQuestion];
  
  io.to(roomId).emit('newQuestion', { 
    question: qData.q, 
    options: qData.options, 
    qNum: game.currentQuestion + 1 
  });
}

server.listen(5000, () => console.log('BrainBout Signaling Server running on port 5000'));
