const Department = require("../models/Department");
const Subject = require("../models/Subject");

// ✅ Add Department
exports.addDepartment = async (req, res) => {
  try {
    const { name, code } = req.body;

    const existing = await Department.findOne({ code });
    if (existing) return res.status(400).json({ message: "Department code already exists" });

    const dept = await Department.create({ name, code });
    res.status(201).json({ message: "Department created", department: dept });
  } catch (err) {
    console.error("Add Department Error:", err);
    res.status(500).json({ message: "Failed to add department", error: err.message });
  }
};

// ✅ Delete Department
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const dept = await Department.findById(id);
    if (!dept) return res.status(404).json({ message: "Department not found" });

    // Optionally: delete related subjects too
    await Subject.deleteMany({ departmentId: id });
    await dept.deleteOne();

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error("Delete Department Error:", err);
    res.status(500).json({ message: "Failed to delete department", error: err.message });
  }
};

// ✅ Add Subject
exports.addSubject = async (req, res) => {
  try {
    const { name, code, departmentId } = req.body;

    const dept = await Department.findById(departmentId);
    if (!dept) return res.status(404).json({ message: "Department not found" });

    const existing = await Subject.findOne({ code });
    if (existing) return res.status(400).json({ message: "Subject code already exists" });

    const subject = await Subject.create({ name, code, departmentId });
    res.status(201).json({ message: "Subject created", subject });
  } catch (err) {
    console.error("Add Subject Error:", err);
    res.status(500).json({ message: "Failed to add subject", error: err.message });
  }
};

// ✅ Get All Departments
exports.getDepartments = async (req, res) => {
  try {
    const depts = await Department.find();
    res.status(200).json({ departments: depts });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch departments", error: err.message });
  }
};

// ✅ Get Subjects by Department
exports.getSubjectsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const subjects = await Subject.find({ departmentId });
    res.status(200).json({ subjects });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subjects", error: err.message });
  }
};