import mongoose from "mongoose";

const periodSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  isLab: { type: Boolean, default: false }, // true if lab
  duration: { type: Number, default: 1 },   // 1 = single period, 2 = double (for lab)
});

const daySchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g. Monday
  maxPeriods: { type: Number, default: 6 }, // configurable max per day
  periods: [periodSchema], // array of periods
});

const timetableSchema = new mongoose.Schema({
  className: { type: String, required: true, unique: true }, // e.g. "10A"
  week: [daySchema], // full week’s schedule
});

const Timetable = mongoose.model("Timetable", timetableSchema);

export default Timetable;