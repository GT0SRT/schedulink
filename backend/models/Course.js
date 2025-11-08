const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CourseSchema = new Schema({
  name: { type: String, required: true },
  department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = model("Course", CourseSchema);