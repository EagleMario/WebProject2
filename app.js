const AppError = require('./Utils/appError.js');
const globalErrorController = require('./Controller/errorController.js');
const express = require('express');

const userRoute = require('./Routes/UserRoute.js');
const classRoute = require('./Routes/classRoute.js');
const ExamRoute = require('./Routes/ExamRoute.js');
const GradeRoute = require('./Routes/GradeRoute.js');
const DashboardRoute = require('./Routes/DashBoardRoute.js');
const lecturesRoute = require('./Routes/lecturesRoute.js');
const NotificationRoute = require('./Routes/NotificationRoute.js')
const aiRoute = require('./Routes/AiRoute.js');

const app = express();

app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/classes', classRoute);
app.use('/api/exams', ExamRoute);
app.use('/api/grades', GradeRoute);
app.use('/api/dashboard', DashboardRoute);
app.use('/api/lectures', lecturesRoute);
app.use('/api/notifications', NotificationRoute);
app.use('/api/ai', aiRoute);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorController);

module.exports = app;
