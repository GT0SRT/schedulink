const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const TeacherProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: String, required: true },
    subdepartment: { type: String },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User" },
    experience: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    classesCount: { type: Number, default: 0 },
    studentsCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = model("TeacherProfile", TeacherProfileSchema);
