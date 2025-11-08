const Subject = require("../models/Subject");

exports.getSubjectsByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const subjects = await Subject.find({ departmentId: departmentId });
  res.status(200).json(subjects);
};

exports.createSubject = async (req, res) => {
  try {
    const { name, code, departmentId } = req.body;
    const newSubject = new Subject({
      name,
      code,
      departmentId,
    });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (err) {
    console.error("Create Subject Error:", err);
    res.status(500).json({ message: "Failed to create subject", error: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  const { id } = req.params;
  await Subject.findByIdAndDelete(id);
  res.status(204).send();
};