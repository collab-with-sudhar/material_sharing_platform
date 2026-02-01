const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true, index: true },
  category: { 
    type: String, 
    enum: ['Notes', 'Question Paper', 'Study Material'], 
    required: true,
    index: true 
  },
  classInfo: { type: String, required: true }, // Class/Semester
  fileURL: { type: String, required: true },
  fileKey: { type: String, required: true }, // Needed to delete from R2
  fileType: { type: String }, // pdf, docx, etc.
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firebaseUID: { type: String, required: true }, // Redundant but useful for quick checks
  likes: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
}, { timestamps: true });

// Text index for search functionality
studyMaterialSchema.index({ title: 'text', description: 'text', subject: 'text' });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);