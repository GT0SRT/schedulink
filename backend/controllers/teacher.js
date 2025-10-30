const User = require("../models/user");
const TeacherProfile = require("../models/TeacherProfile");

//  Admin fetches all teachers they invited
exports.getTeachersForAdmin = async (req, res) => {
  try {
    const teachers = await TeacherProfile.find({ invitedBy: req.user._id })
      .populate("userId", "firstName lastName email role");
    res.status(200).json({ teachers });
  } catch (err) {
    console.error("Error fetching teachers for admin:", err);
    res.status(500).json({ message: "Failed to fetch teachers", error: err.message });
  }
};

// Admin invites teacher by email
exports.inviteTeacher = async (req, res) => {
  try {
    const { email, department } = req.body;
    // Find teacher by email
    const teacherUser = await User.findOne({ email, role: "t" });
    if (!teacherUser) {
      return res.status(404).json({ message: "Teacher not registered yet." });
    }

    // Check if teacher already linked to this admin
    const existingProfile = await TeacherProfile.findOne({
      userId: teacherUser._id,
      invitedBy: req.user._id,
    });
    if (existingProfile) {
      return res.status(400).json({ message: "Teacher already invited." });
    }

    const profile = await TeacherProfile.create({
      userId: teacherUser._id,
      department,
      invitedBy: req.user._id,
      status: "pending",
    });

    res.status(201).json({
      message: "Teacher invited successfully!",
      profile,
    });
  } catch (err) {
    console.error("Invite error:", err);
    res.status(500).json({ message: "Failed to invite teacher", error: err.message });
  }
};

// Teacher accepts the invite
exports.acceptInvite = async (req, res) => {
  try {
    const profile = await TeacherProfile.findOne({
      userId: req.user._id,
      status: "pending",
    });

    if (!profile)
      return res.status(404).json({ message: "No pending invitation found." });

    profile.status = "active";
    await profile.save();

    res.status(200).json({ message: "Invitation accepted!", profile });
  } catch (err) {
    console.error("Accept invite error:", err);
    res.status(500).json({ message: "Failed to accept invite", error: err.message });
  }
};