const express = require('express');
const UserMiddleWare = require('../Core/MiddleWare/UserMiddleWare.js');
const UserController = require('./UserController.js');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.post('/signup', UserController.SignUp);
router.post('/login', UserController.login);
router.post('/bulk-import', upload.single('csvFile'), UserController.bulkImportStudents);

router.get('/my-profile', UserMiddleWare.protect, (req, res) => {
  res.json({ status: 'success', data: { user: req.user } });
});

router.get('/all', UserMiddleWare.protect, UserController.getAllUsers);

router.get('/pending-users', UserMiddleWare.protect, UserMiddleWare.restrictTo('Manager', 'admin'), UserController.getPendingUsers);
router.patch('/approve-user/:id', UserMiddleWare.protect, UserMiddleWare.restrictTo('Manager', 'admin'), UserController.approveUser);
router.delete('/:id', UserMiddleWare.protect, UserMiddleWare.restrictTo('Manager', 'admin'), UserController.deleteUser);


module.exports = router;
