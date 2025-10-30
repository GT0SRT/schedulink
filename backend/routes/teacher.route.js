const express = require("express");
const requireAuth = require("../middlewares/auth");
const router = express.Router();
const teacherController = require("../controllers/teacher");

router.post("/invite", requireAuth, teacherController.inviteTeacher);
router.post("/accept", requireAuth, teacherController.acceptInvite);
router.get("/my-teachers", requireAuth, teacherController.getTeachersForAdmin);

module.exports = router;