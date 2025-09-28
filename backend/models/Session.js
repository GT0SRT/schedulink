const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  department: { type: String, required: true, trim: true },
  section: { type: String, required: true, trim: true },
  semester: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  publicHolidays: { type: [Date], default: [] },
  sessionYear: { type: String, required: true },
  schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
  createdByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
});

// Pre-save hook to automatically set session year
SessionSchema.pre('validate', function (next) {
  if (!this.startDate) return next();

  const start = new Date(this.startDate);
  const year = start.getFullYear();
  const month = start.getMonth(); // 0 = Jan, 11 = Dec

  if (month < 6) {
    // Jan to June
    this.sessionYear = `${year - 1}-${String(year).slice(2)}`;
  } else {
    // July to Dec
    this.sessionYear = `${year}-${String(year + 1).slice(2)}`;
  }

  next();
});

module.exports = mongoose.model('AcademicSession', SessionSchema);
