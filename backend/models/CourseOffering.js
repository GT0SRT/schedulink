const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CourseOfferingSchema = new Schema({
  subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  section: { type: String, required: true },
  Batch: { type: Number, required: true },
  semester: { type: Number, required: true },
//   students: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = model("CourseOffering", CourseOfferingSchema);