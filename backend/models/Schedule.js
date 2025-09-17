const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ScheduleSchema = new Schema({
  courseOfferingId: { type: Schema.Types.ObjectId, ref: "CourseOffering", required: true },
  day: { type: String, enum: ["mon", "tue", "wed", "thu", "fri", "sat"], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
}, { timestamps: true });

module.exports = model("Schedule", ScheduleSchema);