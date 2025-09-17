const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/attendance.controller');

// Student posts check-in detected from BLE
router.post('/checkin', AttendanceController.checkIn);

module.exports = router;