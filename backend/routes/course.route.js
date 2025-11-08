const express = require("express");
const requireAuth = require("../middlewares/auth");
const asyncHandler = require("../utils/asyncHandler");
const Course = require("../controllers/courseContoller");

const router = express.Router();

router.get("/", requireAuth, asyncHandler(Course.getAllCourses));
router.get("/:departmentId", requireAuth, asyncHandler(Course.getAllCoursesByDepartment));
router.post("/", requireAuth, asyncHandler(Course.createCourse));
router.delete("/:id", requireAuth, asyncHandler(Course.deleteCourse));

module.exports = router;