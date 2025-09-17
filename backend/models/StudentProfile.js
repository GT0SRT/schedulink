const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const StudentProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  department: { type: String, required: true },
  Batch: { type: Number, required: true },
  semester: { type: Number, required: true },
  rollNo: { type: String, required: true, unique: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }]
}, { timestamps: true });

module.exports = model("StudentProfile", StudentProfileSchema);