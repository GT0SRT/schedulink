const express = require('express');
const requireAuth = require('../middlewares/auth');
const { default: asyncHandler } = require('../utils/asyncHandler');
const { default: TimeTable } = require('../controllers/TimeTable');

router = express.Router();

// GET /timetable/:className
router.get('/:className/:day/periods', requireAuth, asyncHandler(TimeTable.createPeriod));    
router.post('/:className/:day/period', requireAuth, asyncHandler(TimeTable.getPeriods));    
router.put('/:className/:day/update/:periodId', requireAuth, asyncHandler(TimeTable.updatePeriod));    
router.delete('/:className/:day/delete/:periodId', requireAuth, asyncHandler(TimeTable.deletePeriod));

// POST /timetable/mark-absent
router.post('/mark-absent', requireAuth, asyncHandler(TimeTable.markTeacherAbsent));

module.exports = router;