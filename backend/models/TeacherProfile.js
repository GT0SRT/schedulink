const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const TeacherProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  department: { type: String, required: true },
  courseOfferings: [{ type: Schema.Types.ObjectId, ref: "CourseOffering" }],
}, { timestamps: true });

module.exports = model("TeacherProfile", TeacherProfileSchema);