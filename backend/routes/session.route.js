const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/session.controller');

// Create a session (teacher)
router.post('/', SessionController.createSession);

// End a session (teacher)
router.post('/:id/end', SessionController.endSession);

// Get session attendance summary
router.get('/:id/attendance', SessionController.getAttendanceForSession);

module.exports = router;
