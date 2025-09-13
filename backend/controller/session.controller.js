const Session = require('../models/session.model');
const Attendance = require('../models/attendance.model');
const User = require('../models/user.model');
const { newSessionId, signSessionPayload } = require('../utils/token.util');

const createSession = async (req, res, next) => {
  try {
    // Minimal auth assumed: req.body.teacherId must exist and be a teacher.
    const { teacherId, courseCode, durationSeconds } = req.body;
    if (!teacherId || !courseCode) return res.status(400).json({ message: 'teacherId and courseCode required' });

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') return res.status(403).json({ message: 'Invalid teacher' });

    const sessionId = newSessionId();
    const ts = Math.floor(Date.now()/1000);
    const tokenPayload = signSessionPayload(sessionId, ts);

    const session = await Session.create({
      _id: sessionId,
      teacherId,
      courseCode,
      startTime: new Date(),
      tokenPayload,
      active: true,
      endTime: durationSeconds ? new Date(Date.now() + durationSeconds*1000) : undefined
    });

    // Return token payload that teacher app should broadcast via BLE
    res.json({ sessionId: session._id, tokenPayload, startTime: session.startTime, endTime: session.endTime });
  } catch (err) {
    next(err);
  }
};

const endSession = async (req, res, next) => {
  try {
    const id = req.params.id;
    const session = await Session.findByIdAndUpdate(id, { active: false, endTime: new Date() }, { new: true });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    next(err);
  }
};

const getAttendanceForSession = async (req, res, next) => {
  try {
    const id = req.params.id;
    const attends = await Attendance.find({ sessionId: id }).populate('studentId','name enrolmentId').lean();
    res.json({ sessionId: id, count: attends.length, attendance: attends });
  } catch (err) {
    next(err);
  }
};

module.exports = { createSession, endSession, getAttendanceForSession };