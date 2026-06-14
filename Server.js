require('dotenv').config();
const express = require('express');
const http = require('http');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = require('./app');
const prisma = new PrismaClient();

// Create HTTP server with Socket.IO
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Make socket.io accessible to routes
app.set('socketio', io);
app.set('prisma', prisma);

// Connect to Database
const ConnectDB = require('./Config/DB.js');
ConnectDB();

// Connect to PostgreSQL
async function connectPostgres() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Connected...');
  } catch (error) {
    console.error('❌ PostgreSQL Connection Failed:', error);
    process.exit(1);
  }
}

connectPostgres();

// Initialize Workers
require('./src/Core/Workers/reportWorker');

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

// Serve Frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Fallback to frontend for non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
  }
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}...`);

});
