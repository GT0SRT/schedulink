const Attendance = require('../models/attendance.model');
const Session = require('../models/session.model');
const User = require('../models/user.model');
const { verifySessionPayload } = require('../utils/token.util');

const RSSI_THRESHOLD = parseInt(process.env.RSSI_THRESHOLD || '-75', 10);

async function checkIn(req, res, next) {
  try {
    // expected body: { studentId, tokenPayload, rssi, ts }
    const { studentId, tokenPayload, rssi, ts } = req.body;
    if (!studentId || !tokenPayload) return res.status(400).json({ message: 'studentId and tokenPayload required' });

    // verify student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') return res.status(403).json({ message: 'Invalid student' });

    // verify token signature and freshness
    const verified = verifySessionPayload(tokenPayload);
    if (!verified.valid) return res.status(400).json({ message: 'Invalid session token', reason: verified.reason });

    const sessionId = verified.sessionId;
    // find session and ensure active
    const session = await Session.findById(sessionId);
    if (!session || !session.active) return res.status(410).json({ message: 'Session not active or not found' });

    // RSSI-based proximity check
    if (typeof rssi === 'number') {
      if (rssi < RSSI_THRESHOLD) {
        return res.status(403).json({ message: 'RSSI below threshold; not proximate enough', rssi });
      }
    }

    // now record attendance; Attendance unique index prevents duplicates
    const attendance = new Attendance({
      sessionId,
      studentId,
      timestamp: ts ? new Date(ts) : new Date(),
      rssi,
      verified: true
    });

    await attendance.save();
    return res.json({ message: 'Check-in recorded', sessionId, studentId });
  } catch (err) {
    // handle duplicate key error (student already checked-in)
    if (err.code === 11000) return res.status(409).json({ message: 'Student already checked in for this session' });
    next(err);
  }
}

module.exports = { checkIn };