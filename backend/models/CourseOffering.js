const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CourseOfferingSchema = new Schema({
  subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = model("CourseOffering", CourseOfferingSchema);