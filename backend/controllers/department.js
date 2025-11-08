const Department = require("../models/Department");

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ createdBy: req.user.id });
    res.status(200).json(departments);
  } catch (err) {
    console.error("Fetch Departments Error:", err);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

exports.createDepartment = async (req, res) => {
  const { name, code} = req.body;

  // Check for duplicates
  const existing = await Department.findOne({ $or: [{ name }, { code }] });
  if (existing) {
    return res.status(400).json({ message: "Department already exists" });
  }

  const newDepartment = new Department({
    name,
    code,
    createdBy: req.user.id,
  });
  await newDepartment.save();
  res.status(201).json(newDepartment);
};

exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;
  await Department.findByIdAndDelete(id);
  res.status(204).send();
};