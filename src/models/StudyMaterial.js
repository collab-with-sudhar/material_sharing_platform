import mongoose from 'mongoose';

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true, index: true },
  category: { 
    type: String, 
    enum: ['Notes', 'Question Paper', 'Assignment'], 
    required: true,
    index: true 
  },
  classInfo: { type: String, required: true }, // Class/Semester
  fileURL: { type: String, required: true },
  fileKey: { type: String, required: true }, // Needed to delete from R2
  fileType: { type: String }, // pdf, docx, etc.
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
}, { timestamps: true });

// Text index for search functionality
studyMaterialSchema.index({ title: 'text', description: 'text', subject: 'text' });

export default mongoose.model('StudyMaterial', studyMaterialSchema);