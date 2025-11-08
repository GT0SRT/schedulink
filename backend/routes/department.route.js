const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/auth");
const {createDepartment, deleteDepartment, getAllDepartments,} = require("../controllers/department");
const {createSubject, getSubjectsByDepartment, deleteSubject } = require("../controllers/Subject");

router.post("/add", requireAuth, createDepartment);
router.post("/subject/add", requireAuth, createSubject);
router.delete("/subject/:id", requireAuth, deleteSubject);
router.get("/", requireAuth, getAllDepartments);
router.get("/:departmentId/subjects", requireAuth, getSubjectsByDepartment);
router.delete("/:id", requireAuth, deleteDepartment);

module.exports = router;