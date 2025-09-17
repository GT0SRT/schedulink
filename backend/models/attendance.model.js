const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  sessionId: { type: String, ref: 'Session', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  rssi: { type: Number },
  verified: { type: Boolean, default: false },
  meta: { type: Object }
}, { timestamps: true });

attendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true }); // ensures one check-in per student per session

module.exports = mongoose.model('Attendance', attendanceSchema);