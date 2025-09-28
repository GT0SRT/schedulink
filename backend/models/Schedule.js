const mongoose = require('mongoose');
const { Schema } = mongoose;

const TimeSlotSchema = new Schema({
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: String, required: true }, // e.g. "09:00"
  endTime: { type: String, required: true }    // e.g. "10:00"
}, { _id: false });

const WeeklyScheduleSchema = new Schema({
  session: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicSession',
    required: true,
    unique: true // Ensure one schedule per session
  },
  mon: [TimeSlotSchema],
  tue: [TimeSlotSchema],
  wed: [TimeSlotSchema],
  thu: [TimeSlotSchema],
  fri: [TimeSlotSchema],
  sat: [TimeSlotSchema]
}, { timestamps: true });

module.exports = mongoose.model('WeeklySchedule', WeeklyScheduleSchema);