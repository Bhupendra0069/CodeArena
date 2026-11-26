
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';

import app from './app.js';
import connectDB from './config/db.js';
import { initBattleSocket } from './sockets/battleSocket.js';

const PORT = process.env.PORT || 5000;

// Allow multiple frontend origins
const allowedOrigins = (
  process.env.CLIENT_URL || 'http://localhost:5173'
)
  .split(',')
  .map(origin => origin.trim());

// Create HTTP server from Express app
const httpServer = createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make Socket.IO accessible through Express
app.set('io', io);

// Initialize battle socket events
initBattleSocket(io);

// Connect to MongoDB before starting the server
const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log('\n🚀 CodeArena server started successfully');
      console.log(`📡 Socket.IO enabled`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Port: ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start CodeArena server:', error.message);
    process.exit(1);
  }
};

startServer();
