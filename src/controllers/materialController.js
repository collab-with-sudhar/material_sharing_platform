import StudyMaterial from '../models/StudyMaterial.js';
import User from '../models/User.js';
import { uploadFileToR2, deleteFileFromR2 } from '../utils/r2Service.js';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';

// @desc    Upload new material
// @route   POST /api/materials
// @access  Private
export const uploadMaterial = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler('No file uploaded', 400));
  }

  const { title, description, subject, category, classInfo, tags } = req.body;

  // 1. Upload to R2
  const { fileURL, fileKey } = await uploadFileToR2(req.file, 'study-materials');

  // 2. Create DB Entry
  const material = await StudyMaterial.create({
    title,
    description,
    subject,
    category,
    classInfo,
    tags: tags ? tags.split(',') : [], // Assume comma-separated string from frontend
    fileURL,
    fileKey,
    fileType: req.file.mimetype,
    uploadedBy: req.user._id,
  });

  // 3. Update User Stats
  await User.findByIdAndUpdate(req.user._id, { $inc: { totalUploads: 1 } });

  res.status(201).json({
    success: true,
    material,
  });
});

// @desc    Get all materials with Filter & Pagination
// @route   GET /api/materials
// @access  Public (or Private)
export const getMaterials = catchAsyncErrors(async (req, res, next) => {
  const { 
    category, subject, classInfo, search, 
    page = 1, limit = 10, uploader 
  } = req.query;

  const query = {};

  // Filters
  if (category) query.category = category;
  if (subject) query.subject = subject;
  if (classInfo) query.classInfo = classInfo;
  
  // Search (Title or Description)
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by Uploader
  if (uploader) {
    const user = await User.findById(uploader);
    if (user) query.uploadedBy = user._id;
  }

  const materials = await StudyMaterial.find(query)
    .populate('uploadedBy', 'name profileImageURL')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await StudyMaterial.countDocuments(query);

  res.status(200).json({
    success: true,
    materials,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
    totalMaterials: count,
  });
});

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private (Owner only)
export const deleteMaterial = catchAsyncErrors(async (req, res, next) => {
  const material = await StudyMaterial.findById(req.params.id);

  if (!material) {
    return next(new ErrorHandler('Material not found', 404));
  }

  // Check ownership
  if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorHandler('Not authorized to delete this material', 403));
  }

  // 1. Delete from R2
  await deleteFileFromR2(material.fileKey);

  // 2. Delete from DB
  await material.deleteOne();

  // 3. Decrement stats
  await User.findByIdAndUpdate(req.user._id, { $inc: { totalUploads: -1 } });

  res.status(200).json({
    success: true,
    message: 'Material removed',
  });
});