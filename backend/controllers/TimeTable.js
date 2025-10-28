const TimeTable = require("../models/TimeTable");

// ✅ Create or Add a period to a day
exports.createPeriod = async (req, res) => {
  const { className, day } = req.params;
  const { subject, teacher, room, time, color } = req.body;

  let timetable = await TimeTable.findOne({ department: className, day });

  if (!timetable) {
    timetable = new TimeTable({
      department: className,
      day,
      periods: [{ subject, teacher, room, time, color }],
    });
  } else {
    timetable.periods.push({ subject, teacher, room, time, color });
  }

  await timetable.save();
  res.status(201).json({ message: "Period added successfully", timetable });
};

// ✅ Get all periods for a department/day
exports.getPeriods = async (req, res) => {
  const { className, day } = req.params;
  const timetable = await TimeTable.findOne({ department: className, day });
  res.status(200).json(timetable || { department: className, day, periods: [] });
};

// ✅ Update a specific period
exports.updatePeriod = async (req, res) => {
  const { className, day, periodId } = req.params;
  const updateData = req.body;

  const timetable = await TimeTable.findOne({ department: className, day });
  if (!timetable) return res.status(404).json({ message: "Not found" });

  const period = timetable.periods.id(periodId);
  if (!period) return res.status(404).json({ message: "Period not found" });

  Object.assign(period, updateData);
  await timetable.save();

  res.status(200).json({ message: "Period updated successfully", timetable });
};

// ✅ Delete a period
exports.deletePeriod = async (req, res) => {
  const { className, day, periodId } = req.params;

  const timetable = await TimeTable.findOne({ department: className, day });
  if (!timetable) return res.status(404).json({ message: "Not found" });

  timetable.periods.id(periodId).deleteOne();
  await timetable.save();

  res.status(200).json({ message: "Period deleted successfully", timetable });
};

// (Optional) Example extra endpoint
exports.markTeacherAbsent = async (req, res) => {
  const { teacher } = req.body;
  await TimeTable.updateMany(
    { "periods.teacher": teacher },
    { $set: { "periods.$[elem].teacher": "Absent" } },
    { arrayFilters: [{ "elem.teacher": teacher }] }
  );

  res.status(200).json({ message: `${teacher} marked absent in all schedules` });
};