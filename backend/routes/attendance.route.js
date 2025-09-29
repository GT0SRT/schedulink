const express = require('express'); 
const requireAuth = require('../middlewares/auth');
const { default: asyncHandler } = require('../utils/asyncHandler');
const { default: Attendance } = require('../controllers/Attendance');

const router = express.Router();

// POST /generate-qr/:classId
router.post('/generate-qr/:classId', requireAuth,asyncHandler(Attendance.generateQr))

module.exports = router;