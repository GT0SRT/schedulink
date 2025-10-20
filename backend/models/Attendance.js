const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AttendanceSchema = new Schema({
  classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ["present", "absent", "late"], 
    default: "present" 
  },
  markedAt: { type: Date, default: Date.now },
  markedVia: { 
    type: String, 
    enum: ["qr", "manual"], 
    default: "qr" 
  },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

// Ensure one attendance record per student per class
AttendanceSchema.index({ classId: 1, studentId: 1 }, { unique: true });

module.exports = model("Attendance", AttendanceSchema);