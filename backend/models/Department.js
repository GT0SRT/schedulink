const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const DepartmentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Department", DepartmentSchema);