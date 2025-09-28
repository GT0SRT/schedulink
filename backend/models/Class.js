const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ClassSchema = new Schema({
  subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sessionId : { type: Schema.Types.ObjectId, ref: "User", required: true },
  scheduleId: { type: Schema.Types.ObjectId, ref: "Schedule", required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  qrCode: { type: String },
  qrLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },

  status: {
    type: String, 
    enum: ["scheduled", "conducted", "cancelled", "teacher_absent", "holiday"], 
    default: "scheduled"
  },

  plannedOutcomes: { type: String },
  deliveredOutcomes: { type: String },

  AbsenceReason: { type: String },

  studentIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  
  attendance: [{ type: Schema.Types.ObjectId, ref: "Attendance" }],
  feedbacks: [{ type: Schema.Types.ObjectId, ref: "Feedback" }]
}, { timestamps: true });

module.exports = model("Class", ClassSchema);