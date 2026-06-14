const express = require('express');
const AIController = require('./aiController.js');
const UserMiddleWare = require('../Core/MiddleWare/UserMiddleWare.js');
const router = express.Router();

router.post('/chat', UserMiddleWare.protect, AIController.handleAIChat);

module.exports = router;
