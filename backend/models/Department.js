const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const DepartmentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = model("Department", DepartmentSchema);