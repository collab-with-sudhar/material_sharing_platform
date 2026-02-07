import mongoose from 'mongoose';
import { type } from 'os';

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true, index: true },
  semester:{type: String, required: true},
  category: { 
    type: String, 
    enum: ['Notes', 'Question Paper', 'Assignment'], 
    required: true,
    index: true 
  },
  fileURL: { type: String, required: true },
  fileKey: { type: String, required: true }, // Needed to delete from R2
  fileType: { type: String }, // pdf, docx, etc.
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// Text index for search functionality
studyMaterialSchema.index({ title: 'text', description: 'text', subject: 'text' });

export default mongoose.model('StudyMaterial', studyMaterialSchema);