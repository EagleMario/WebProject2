require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const User = require('./Routes/UserRoute.js');
const AiRoute = require('./Routes/AiRoute.js');
const Notification = require('./Routes/NotificationRoute.js');
const Exam = require('./Routes/ExamRoute.js');
const Grades = require('./Routes/GradeRoute.js');
const DashBoard = require('./Routes/DashBoardRoute.js');
const Class = require('./Routes/classRoute.js');
const lectures = require('./Routes/LecturesRoute.js');
const ExamSchedule = require('./Routes/ExamScheduleRoute.js');
const Assignment = require('./Routes/AssignmentRoute.js');
const PORT = process.env.PORT || 3500;
const path = require('path');
const cors = require('cors');
const ConnectDB = require('./Config/DB.js');


ConnectDB();

app.use(cors());
app.use(express.json());

app.set('socketio', io);

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

app.use('/Notification', Notification);
app.use('/DashBoard', DashBoard);
app.use('/User', User);
app.use('/Exam', Exam);
app.use('/Grades', Grades);
app.use('/Class', Class);
app.use('/lectures', lectures);
app.use('/ai', AiRoute);
app.use('/ExamSchedule', ExamSchedule);
app.use('/Assignments', Assignment);

const globalErrorController = require('./Controller/errorController.js');

app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.use('/api', (req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/Class') || req.originalUrl.startsWith('/User') || req.originalUrl.startsWith('/DashBoard')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.use(globalErrorController);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
