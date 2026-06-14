import express from 'express';
import * as FeesController from './FeesController.js';
import * as UserMiddleWare from '../Core/MiddleWare/UserMiddleWare.js';

const router = express.Router();

// Student own route (placed before parameterized routes)
router.get('/my-fees', UserMiddleWare.protect, UserMiddleWare.restrictTo('student'), FeesController.getMyFees);

// Manager only routes
router.use(UserMiddleWare.protect, UserMiddleWare.restrictTo('Manager'));

router.post('/assign', FeesController.assignFee);
router.get('/', FeesController.getAllFees);
router.patch('/:id', FeesController.updateFeeStatus);
router.delete('/:id', FeesController.deleteFee);

export default router;
