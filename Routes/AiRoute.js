const express = require('express');
const AIController = require('../Controller/aiController.js');
const UserMiddleWare = require('../MiddleWare/UserMiddleWare.js');
const router = express.Router();

router.post('/chat', UserMiddleWare.protect, AIController.handleAIChat);

module.exports = router;
