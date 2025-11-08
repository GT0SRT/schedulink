const Course = require("../models/Course");

exports.getAllCoursesByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const courses = await Course.find({ department: departmentId })
    .populate("subject")
    .populate("teacher")
    .populate("department");
  res.status(200).json(courses);
};

exports.createCourse = async (req, res) => {
  const { name, subjectId, teacherId, departmentId } = req.body;
  const newCourse = new Course({
    name,
    department: departmentId,
    subject: subjectId,
    teacher: teacherId,
  });
  await newCourse.save();
  res.status(201).json(newCourse);
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  await Course.findByIdAndDelete(id);
  res.status(204).send();
};