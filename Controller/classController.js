const Class = require('../Model/class.js');
const User = require('../Model/User.js');
const AppError = require('../Utils/appError.js');
const catchasync = require('../Utils/CatchAsync.js');

exports.CreateClass = catchasync(async (req, res, next) => {
  console.log('CreateClass called');
  console.log('User:', { id: req.user.id, role: req.user.role, email: req.user.email });
  console.log('Request body:', req.body);

  const { className, subject, level } = req.body;

  // Validate required fields
  if (!className || !subject || !level) {
    console.log('Missing required fields');
    return next(new AppError('Please provide className, subject, and level', 400));
  }

  // Validate level is valid
  if (![1, 2, 3, 4].includes(Number(level))) {
    console.log('Invalid level:', level);
    return next(new AppError('Level must be between 1 and 4', 400));
  }

  const classCount = await Class.countDocuments({ level: req.body.level });
  console.log('Current class count for level', level, ':', classCount);

  if (classCount >= 8) {
    return next(new AppError('This academic level has reached the maximum limit of 8 classes', 400));
  }

  try {
    const NewClass = await Class.create({
      className: className.trim(),
      manager: req.user.id,
      subject: subject.trim(),
      level: Number(level)
    });
    console.log('Class created successfully:', NewClass._id);
    res.status(201).json({ status: 'success', data: NewClass });
  } catch (error) {
    console.error('Class creation error:', error);
    // Handle duplicate className error
    if (error.code === 11000 && error.keyPattern.className) {
      return next(new AppError('A class with this name already exists. Please use a different name.', 400));
    }
    throw error;
  }
});
exports.AddStudentsToClass = catchasync(async (req, res, next) => {
  const classToUpdate = await Class.findById(req.params.classId);
  if (!classToUpdate) {
    return next(new AppError('Class Not found', 404));
  }

  if (req.user.role.toLowerCase() === 'manager' && classToUpdate.manager.toString() !== req.user.id) {
    return next(new AppError('you have no access', 403));
  }

  const student = await User.findById(req.body.studentId);
  if (!student) return next(new AppError('Student not found', 404));

  if (student.level !== classToUpdate.level) {
    return next(new AppError('Student level does not match the class level.', 400));
  }

  classToUpdate.students.addToSet(req.body.studentId);
  await classToUpdate.save();

  res.status(200).json({ status: 'success', data: classToUpdate });
});
exports.getAllClasses = catchasync(async (req, res, next) => {
  let filter = {}
  if (req.user.role.toLowerCase() === 'manager') {
    filter = { manager: req.user.id }
  }
  const classes = await Class.find(filter)
    .populate('teachers.teacher', 'name email')
    .populate('students', 'name email');
  res.status(200).json({
    status: 'success',
    results: classes.length,
    data: { classes }
  });
});
exports.addTeacherToClass = catchasync(async (req, res, next) => {
  const { classId, teacherId, subject } = req.body;

  const currentClass = await Class.findById(classId);
  if (!currentClass) return next(new AppError('Class not found', 404));

  const subjectExists = currentClass.teachers.some(t => t.subject.toLowerCase() === subject.toLowerCase());

  if (subjectExists) {
    return next(new AppError(`A teacher for ${subject} is already assigned to this class.`, 400));
  }

  currentClass.teachers.push({ teacher: teacherId, subject: subject });
  await currentClass.save();

  res.status(200).json({ status: 'success', data: { class: currentClass } });
});

exports.addStudentToClass = catchasync(async (req, res, next) => {
  const { classId, studentId } = req.body;

  const currentClass = await Class.findById(classId);
  if (!currentClass) return next(new AppError('Class not found', 404));

  if (currentClass.students.length >= currentClass.maxStudents) {
    return next(new AppError('This class has reached its maximum capacity of 20 students.', 400));
  }

  if (currentClass.students.includes(studentId)) {
    return next(new AppError('Student is already in this class.', 400));
  }

  const student = await User.findById(studentId);
  if (!student) return next(new AppError('Student not found', 404));

  if (student.level !== currentClass.level) {
    return next(new AppError('Student level does not match the class level.', 400));
  }

  currentClass.students.push(studentId);
  await currentClass.save();

  res.status(200).json({ status: 'success', data: { class: currentClass } });
});

exports.deleteClass = catchasync(async (req, res, next) => {
  const { classId } = req.params;
  const cls = await Class.findById(classId);
  if (!cls) return next(new AppError('Class not found', 404));

  if (req.user.role.toLowerCase() === 'Manager' && cls.manager && cls.manager.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to delete this class', 403));
  }

  await Class.findByIdAndDelete(classId);
  res.status(200).json({ status: 'success', message: 'Class deleted successfully' });
});

exports.updateClass = catchasync(async (req, res, next) => {
  const { classId } = req.params;
  const { className, subject, level } = req.body;

  const cls = await Class.findById(classId);
  if (!cls) return next(new AppError('Class not found', 404));

  if (req.user.role.toLowerCase() === 'manager' && cls.manager && cls.manager.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to update this class', 403));
  }

  if (level && ![1, 2, 3, 4].includes(Number(level))) {
    return next(new AppError('Level must be between 1 and 4', 400));
  }

  if (className) cls.className = className.trim();
  if (subject) cls.subject = subject.trim();
  if (level) cls.level = Number(level);

  try {
    await cls.save();
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('A class with this name already exists.', 400));
    }
    throw error;
  }

  res.status(200).json({ status: 'success', data: { class: cls } });
});
