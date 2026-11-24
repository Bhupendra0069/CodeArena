import Match from '../models/Match.js';
import Problem from '../models/Problem.js';
import { finalizeMatch, selectProblemForBattle } from '../services/matchService.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// In-memory timer tracking: matchId (string) -> { timerId }
const activeTimers = new Map();

/**
 * Authenticates a socket connection via the JWT token
 * passed in socket.handshake.auth.token.
 */
const authenticateSocket = async (socket) => {
  const token = socket.handshake.auth?.token;
  if (!token) throw new Error('No authentication token provided');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

export const initBattleSocket = (io) => {
  io.on('connection', async (socket) => {
    let currentUser = null;

    // Authenticate on connect
    try {
      currentUser = await authenticateSocket(socket);
      socket.userId = currentUser._id.toString();
      socket.username = currentUser.username;
      console.log(`⚡ Socket connected: ${currentUser.username} [${socket.id}]`);
    } catch (err) {
      console.error('Socket auth failed:', err.message);
      socket.emit('auth_error', { message: 'Authentication failed. Please log in again.' });
      socket.disconnect();
      return;
    }

    // ─── JOIN BATTLE ROOM ────────────────────────────────────────
    socket.on('join_room', async ({ roomCode }) => {
      try {
        if (!roomCode) return socket.emit('error', { message: 'Room code is required' });

        const match = await Match.findOne({ roomCode: roomCode.trim().toUpperCase() });
        if (!match) return socket.emit('error', { message: 'Room not found' });

        const isParticipant = match.players.some(p => p.user.toString() === socket.userId);
        if (!isParticipant) return socket.emit('error', { message: 'Access denied — you are not in this battle' });

        // Join the socket room
        socket.join(roomCode.toUpperCase());

        // Update connection status
        const playerIdx = match.players.findIndex(p => p.user.toString() === socket.userId);
        if (playerIdx !== -1) {
          match.players[playerIdx].isConnected = true;
          await match.save();
        }

        socket.emit('room_joined', {
          matchId: match._id,
          roomCode: match.roomCode,
          status: match.status,
          players: match.players,
          difficulty: match.difficulty,
          duration: match.duration,
        });

        // Notify others in room
        socket.to(roomCode.toUpperCase()).emit('player_connected', {
          username: socket.username,
          userId: socket.userId,
        });

        // Reconnect to active battle — send current state
        if (match.status === 'active') {
          const problem = await Problem.findById(match.problem).select('-hiddenTestCases');
          const elapsed = match.startTime ? Date.now() - match.startTime.getTime() : 0;
          const timeRemaining = Math.max(0, match.duration * 60 * 1000 - elapsed);

          socket.emit('battle_started', {
            problem,
            timeRemaining,
            players: match.players,
          });
        }
      } catch (err) {
        console.error('join_room error:', err);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // ─── PLAYER READY ─────────────────────────────────────────────
    socket.on('player_ready', async ({ roomCode }) => {
      try {
        if (!roomCode) return;
        const match = await Match.findOne({ roomCode: roomCode.trim().toUpperCase() });
        if (!match) return socket.emit('error', { message: 'Room not found' });
        if (!['waiting', 'ready'].includes(match.status)) return;

        const playerIdx = match.players.findIndex(p => p.user.toString() === socket.userId);
        if (playerIdx === -1) return socket.emit('error', { message: 'Not a participant' });

        match.players[playerIdx].isReady = true;
        await match.save();

        io.to(roomCode.toUpperCase()).emit('player_ready_update', {
          userId: socket.userId,
          username: socket.username,
          players: match.players,
        });

        // Both players ready → start battle
        if (match.players.length === 2 && match.players.every(p => p.isReady)) {
          await startBattle(match, roomCode.toUpperCase(), io);
        }
      } catch (err) {
        console.error('player_ready error:', err);
        socket.emit('error', { message: 'Failed to set ready status' });
      }
    });

    // ─── DISCONNECT ───────────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`⚡ Socket disconnected: ${socket.username} [${socket.id}]`);
      try {
        // Find any active match this user was in
        const match = await Match.findOne({
          'players.user': socket.userId,
          status: { $in: ['waiting', 'ready', 'active'] },
        });

        if (!match) return;

        const playerIdx = match.players.findIndex(p => p.user.toString() === socket.userId);
        if (playerIdx !== -1) {
          match.players[playerIdx].isConnected = false;
          await match.save();
        }

        io.to(match.roomCode).emit('player_disconnected', {
          username: socket.username,
          userId: socket.userId,
        });
      } catch (err) {
        console.error('disconnect handler error:', err);
      }
    });
  });
};

/**
 * Selects a random problem and starts the server-side battle timer.
 */
const startBattle = async (match, roomCode, io) => {
  try {
    const problem = await selectProblemForBattle(match.difficulty);

    match.status = 'active';
    match.problem = problem._id;
    match.startTime = new Date();
    await match.save();

    // Emit battle_started to both players (never send hiddenTestCases)
    io.to(roomCode).emit('battle_started', {
      problem: {
        _id: problem._id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        category: problem.category,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        constraints: problem.constraints,
        examples: problem.examples,
        sampleTestCases: problem.sampleTestCases,
        timeLimit: problem.timeLimit,
        memoryLimit: problem.memoryLimit,
      },
      timeRemaining: match.duration * 60 * 1000,
      players: match.players,
    });

    // Start server-controlled countdown
    const endTime = Date.now() + match.duration * 60 * 1000;
    const timerId = setInterval(async () => {
      const remaining = endTime - Date.now();

      if (remaining <= 0) {
        clearInterval(timerId);
        activeTimers.delete(match._id.toString());

        // Time's up — finalize as draw
        const freshMatch = await Match.findById(match._id);
        if (freshMatch && freshMatch.status === 'active') {
          const finalizedMatch = await finalizeMatch(freshMatch, null);
          io.to(roomCode).emit('battle_finished', {
            result: 'draw',
            winner: null,
            match: finalizedMatch,
          });
        }
      } else {
        // Send timer tick every second
        io.to(roomCode).emit('timer_update', { timeRemaining: Math.max(0, remaining) });
      }
    }, 1000);

    activeTimers.set(match._id.toString(), { timerId });
  } catch (err) {
    console.error('startBattle error:', err);
    io.to(roomCode).emit('error', { message: 'Failed to start battle: ' + err.message });
  }
};

/**
 * Stops the server timer for a finished match and emits battle_finished.
 * Called from submissionController after an accepted submission in a battle.
 */
export const emitBattleResult = (io, roomCode, data) => {
  if (data.match?._id) {
    const timer = activeTimers.get(data.match._id.toString());
    if (timer) {
      clearInterval(timer.timerId);
      activeTimers.delete(data.match._id.toString());
    }
  }
  io.to(roomCode).emit('battle_finished', data);
};
