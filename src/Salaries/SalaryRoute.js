import express from 'express';
import * as SalaryController from './SalaryController.js';
import * as UserMiddleWare from '../Core/MiddleWare/UserMiddleWare.js';

const router = express.Router();

// Teacher own route (placed before parameterized routes)
router.get('/my-salaries', UserMiddleWare.protect, UserMiddleWare.restrictTo('teacher'), SalaryController.getMySalaries);

// Manager only routes
router.use(UserMiddleWare.protect, UserMiddleWare.restrictTo('Manager'));

router.post('/assign', SalaryController.assignSalary);
router.get('/', SalaryController.getAllSalaries);
router.patch('/:id', SalaryController.updateSalaryStatus);
router.delete('/:id', SalaryController.deleteSalary);

export default router;
