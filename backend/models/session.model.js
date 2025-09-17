const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  _id: { type: String }, // we store UUID string as _id
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseCode: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  tokenPayload: { type: String, required: true }, // signed payload that teacher broadcasts
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);