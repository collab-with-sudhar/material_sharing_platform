const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  profileImageURL: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  totalUploads: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);