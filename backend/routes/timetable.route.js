const express = require("express");
const requireAuth = require("../middlewares/auth");
const asyncHandler = require("../utils/asyncHandler");
const TimeTable = require("../controllers/TimeTable");

const router = express.Router();

router.post("/:className/:day/period", requireAuth, asyncHandler(TimeTable.createPeriod));
router.delete("/:className/:day/delete/:periodId", requireAuth, asyncHandler(TimeTable.deletePeriod));
router.get("/:className", requireAuth, asyncHandler(TimeTable.getTimeTableByDepartment));

module.exports = router;