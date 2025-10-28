// routes/TimeTableRoutes.js
const express = require("express");
const requireAuth = require("../middlewares/auth");
const asyncHandler = require("../utils/asyncHandler");
const TimeTable = require("../controllers/TimeTable");

const router = express.Router();

router.post("/:className/:day/period", requireAuth, asyncHandler(TimeTable.createPeriod));
router.get("/:className/:day/periods", requireAuth, asyncHandler(TimeTable.getPeriods));
router.put("/:className/:day/update/:periodId", requireAuth, asyncHandler(TimeTable.updatePeriod));
router.delete("/:className/:day/delete/:periodId", requireAuth, asyncHandler(TimeTable.deletePeriod));
router.post("/mark-absent", requireAuth, asyncHandler(TimeTable.markTeacherAbsent));

module.exports = router;