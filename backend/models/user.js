const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String },
  theme: { type: Boolean, default: 'false' },
}, { timestamps: true });

const UserModel = model('User', UserSchema);

module.exports = UserModel;