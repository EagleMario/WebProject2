import express from 'express';
import * as AIController from './aiController.js';
import { protect } from '../Core/MiddleWare/UserMiddleWare.js';
const router = express.Router();

router.post('/chat', protect, AIController.handleAIChat);

export default router;
