const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MonthRecordSchema = new Schema({
  present: { type: [Number], default: [] },
  absent: { type: [Number], default: [] } 
}, { _id: false });

const StudentAttendanceSummarySchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseOfferingId: { type: Schema.Types.ObjectId, ref: "CourseOffering", required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subjectName: { type: String, required: true },
  year: { type: Number, required: true },

  // Map of months → each month stores present[] and absent[]
  monthlyRecords: {
    type: Map,
    of: MonthRecordSchema
  }

}, { timestamps: true });

module.exports = model("StudentAttendanceSummary", StudentAttendanceSummarySchema);