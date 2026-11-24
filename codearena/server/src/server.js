import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import { initBattleSocket } from './sockets/battleSocket.js';

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const httpServer = createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible to Express controllers via req.app.get('io')
app.set('io', io);

// Initialize all socket event handlers
initBattleSocket(io);

// Connect to MongoDB, then start listening
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`\n🚀 CodeArena server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.IO enabled`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
  });
});
