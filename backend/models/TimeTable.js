const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  room: { type: String, required: true },
  time: { type: String, required: true },
  color: { type: String },
});

const timetableSchema = new mongoose.Schema({
  department: { type: String, required: true },
  day: { type: String, required: true },
  periods: [periodSchema],
});

module.exports = mongoose.model("TimeTable", timetableSchema);