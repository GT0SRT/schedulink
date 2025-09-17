const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SubjectSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  department: { type: String, required: true }
}, { timestamps: true });

module.exports = model("Subject", SubjectSchema);