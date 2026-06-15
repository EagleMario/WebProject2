import 'dotenv/config.js';
import express from 'express';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
import app from './app.js';
const prisma = new PrismaClient();

// Create HTTP server with Socket.IO
const server = http.createServer(app);
import { Server as SocketIOServer } from 'socket.io';
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Make socket.io accessible to routes
app.set('socketio', io);
app.set('prisma', prisma);

// Connect to Database
import ConnectDB from './Config/DB.js';
ConnectDB();

// Connect to PostgreSQL
async function connectPostgres() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Connected...');
  } catch (error) {
    console.error('❌ PostgreSQL Connection Failed:', error.message);
    console.error('   Make sure DATABASE_URL is set in your environment variables.');
    // Do not exit — allow server to start so other routes (MongoDB) still work
  }
}

connectPostgres();

// Initialize Workers
import './src/Core/Workers/reportWorker.js';

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Serve Frontend static files
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next(); // let the error controller handle unknown API routes
  }
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}...`);

});
