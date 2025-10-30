const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/auth");
const {
  addDepartment,
  addSubject,
  getDepartments,
  getSubjectsByDepartment,
  deleteDepartment
} = require("../controllers/departmentController");

router.post("/add", requireAuth, addDepartment);
router.post("/subject/add", requireAuth, addSubject);
router.get("/", requireAuth, getDepartments);
router.get("/:departmentId/subjects", requireAuth, getSubjectsByDepartment);
router.delete("/:id", requireAuth, deleteDepartment);

module.exports = router;