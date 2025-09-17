const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ClassSchema = new Schema({
  courseOfferingId: { type: Schema.Types.ObjectId, ref: "CourseOffering", required: true },
  scheduleId: { type: Schema.Types.ObjectId, ref: "Schedule", required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  qrCode: { type: String },

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