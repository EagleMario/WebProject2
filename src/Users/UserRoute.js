import express from 'express';
import * as UserMiddleWare from '../Core/MiddleWare/UserMiddleWare.js';
import * as UserController from './UserController.js';
const router = express.Router();
import multer from 'multer';
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


export default router;
