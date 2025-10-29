const QRCode = require('qrcode');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');

class AttendanceController {
  // Generate QR Code (your existing code - slightly improved)
  generateQr = async (req, res) => {
    try {
      const { classId } = req.params;
      const { location } = req.body;

      if (!location || !location.lat || !location.lng) {
        return res.status(400).json({ error: 'Location (lat/lng) is required' });
      }

      const classDoc = await Class.findById(classId);
      if (!classDoc) {
        return res.status(404).json({ error: 'Class not found' });
      }

      // Add expiry time (e.g., QR valid for 15 minutes)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      const qrPayload = JSON.stringify({
        classId,
        generatedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString()
      });

      const qrCodeDataURL = await QRCode.toDataURL(qrPayload);

      classDoc.qrCode = qrCodeDataURL;
      classDoc.qrLocation = {
        lat: location.lat,
        lng: location.lng,
      };

      await classDoc.save();

      res.status(200).json({ 
        success: true, 
        qrCode: qrCodeDataURL,
        expiresAt 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Mark attendance by scanning QR
  markAttendance = async (req, res) => {
    try {
      const { qrData, studentLocation } = req.body;
      const studentId = req.user._id; // Assuming you have auth middleware

      // Validate input
      if (!qrData) {
        return res.status(400).json({ error: 'QR data is required' });
      }

      if (!studentLocation || !studentLocation.lat || !studentLocation.lng) {
        return res.status(400).json({ error: 'Student location is required' });
      }

      // Parse QR code data
      let qrPayload;
      try {
        qrPayload = JSON.parse(qrData);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid QR code format' });
      }

      const { classId, expiresAt } = qrPayload;

      // Check if QR code has expired
      if (new Date(expiresAt) < new Date()) {
        return res.status(400).json({ error: 'QR code has expired' });
      }

      // Find the class
      const classDoc = await Class.findById(classId);
      if (!classDoc) {
        return res.status(404).json({ error: 'Class not found' });
      }

      // Verify student is enrolled in this class
      if (!classDoc.studentIds.includes(studentId)) {
        return res.status(403).json({ error: 'You are not enrolled in this class' });
      }

      // Calculate distance between student location and class location
      const distance = this.calculateDistance(
        studentLocation.lat,
        studentLocation.lng,
        classDoc.qrLocation.lat,
        classDoc.qrLocation.lng
      );

      // Check if student is within acceptable range (e.g., 100 meters)
      const MAX_DISTANCE = 100; // meters
      if (distance > MAX_DISTANCE) {
        return res.status(400).json({ 
          error: `You are too far from the class location (${distance.toFixed(0)}m away)` 
        });
      }

      // Check if attendance already marked
      const existingAttendance = await Attendance.findOne({
        classId,
        studentId
      });

      if (existingAttendance) {
        return res.status(400).json({ 
          error: 'Attendance already marked for this class',
          attendance: existingAttendance
        });
      }

      // Create attendance record
      const attendance = new Attendance({
        classId,
        studentId,
        status: 'present',
        markedVia: 'qr',
        location: {
          lat: studentLocation.lat,
          lng: studentLocation.lng
        }
      });

      await attendance.save();

      // Add attendance to class's attendance array
      classDoc.attendance.push(attendance._id);
      await classDoc.save();

      res.status(200).json({ 
        success: true, 
        message: 'Attendance marked successfully',
        attendance 
      });

    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Attendance already marked' });
      }
      res.status(500).json({ error: error.message });
    }
  };

  // Helper function: Calculate distance between two coordinates (Haversine formula)
  calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Get attendance for a class
  getClassAttendance = async (req, res) => {
    try {
      const { classId } = req.params;

      const attendanceList = await Attendance.find({ classId })
        .populate('studentId', 'name email')
        .sort({ markedAt: -1 });

      const classDoc = await Class.findById(classId);
      
      res.status(200).json({
        success: true,
        total: attendanceList.length,
        totalStudents: classDoc.studentIds.length,
        attendance: attendanceList
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new AttendanceController();