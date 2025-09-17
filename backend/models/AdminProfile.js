const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AdminProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  departments: [String],
  teachers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  students: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = model("AdminProfile", AdminProfileSchema);