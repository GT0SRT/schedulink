const TimeTable = require("../models/TimeTable");

// Create and add period to a day
exports.createPeriod = async (req, res) => {
  const { className, day } = req.params;
  const { course, teacher, room, time, color } = req.body;

  let timetable = await TimeTable.findOne({ department: className, day });

  if (!timetable) {
    timetable = new TimeTable({
      department: className,
      day,
      periods: [{ course, teacher, room, time, color }],
    });
  } else {
    timetable.periods.push({ course, teacher, room, time, color });
  }

  await timetable.save();
  res.status(201).json({ message: "Period added successfully", timetable });
};

// Get the full timetable for a department/class
exports.getTimeTableByDepartment = async (req, res) => {
  const { className } = req.params;

  try {
    const timetable = await TimeTable.find({ department: className });

    if (!timetable || timetable.length === 0) {
      return res.status(404).json({ message: "Timetable not found for this department" });
    }
    // Send back all days and periods
    res.status(200).json({ department: className, timetable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching timetable" });
  }
};

// delete a period
exports.deletePeriod = async (req, res) => {
  const { className, day, periodId } = req.params;

  const timetable = await TimeTable.findOne({ department: className, day });
  if (!timetable) return res.status(404).json({ message: "Not found" });

  timetable.periods.id(periodId).deleteOne();
  await timetable.save();

  res.status(200).json({ message: "Period deleted successfully", timetable });
};