import StudyMaterial from '../models/StudyMaterial.js';
import User from '../models/User.js';
import { uploadFileToR2, deleteFileFromR2 } from '../utils/r2Service.js';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import { compressFile, formatFileSize } from '../utils/pdfCompression.js';

// @desc    Upload new material
// @route   POST /api/materials
// @access  Private
export const uploadMaterial = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler('No file uploaded', 400));
  }

  const { title, description, subject, category, semester, department, tags } = req.body;

  // Validation
  if (!title || !subject || !category || !semester || !department) {
    return next(new ErrorHandler('Please provide all required fields: title, subject, category, semester, department', 400));
  }

  // Validate file type (only PDFs, Word, and PowerPoint documents)
  const allowedTypes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  
  // Also check file extension as fallback
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];
  const fileExtension = req.file.originalname.toLowerCase().substring(req.file.originalname.lastIndexOf('.'));
  
  const isValidType = allowedTypes.includes(req.file.mimetype);
  const isValidExtension = allowedExtensions.includes(fileExtension);
  
  if (!isValidType && !isValidExtension) {
    return next(new ErrorHandler('Only PDF, Word, and PowerPoint documents are allowed', 400));
  }

  // Validate file size (max 100MB)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (req.file.size > maxSize) {
    return next(new ErrorHandler('File size should not exceed 100MB', 400));
  }

  const originalSize = req.file.size;
  console.log(`[Upload] Processing: ${req.file.originalname} (${formatFileSize(originalSize)})`);

  // Compress PDF files if > 10 MB
  let compressionResult = {
    buffer: req.file.buffer,
    originalSize,
    compressedSize: originalSize,
    compressionRatio: 0,
    compressed: false
  };

  if (req.file.mimetype === 'application/pdf') {
    try {
      console.log('[Upload] Initiating PDF compression...');
      compressionResult = await compressFile(
        req.file.buffer, 
        req.file.mimetype, 
        req.file.originalname
      );
      
      if (!compressionResult || !compressionResult.buffer) {
        console.error('[Upload] Compression returned invalid result, using original file');
        compressionResult = {
          buffer: req.file.buffer,
          originalSize,
          compressedSize: originalSize,
          compressionRatio: 0,
          compressed: false,
          error: 'Invalid compression result'
        };
      } else {
        // Update file buffer with compressed version
        req.file.buffer = compressionResult.buffer;
        
        if (compressionResult.compressed) {
          console.log(`[Upload] ✓ Compressed: ${formatFileSize(compressionResult.originalSize)} → ${formatFileSize(compressionResult.compressedSize)} (${compressionResult.compressionRatio}% reduction)`);
        } else if (compressionResult.error) {
          console.log(`[Upload] ⚠ Compression failed: ${compressionResult.error}, using original file`);
        } else {
          console.log(`[Upload] ℹ ${compressionResult.message || 'No compression applied'}`);
        }
      }
    } catch (error) {
      console.error('[Upload] Compression error:', error.message);
      console.error('[Upload] Stack:', error.stack);
      // Continue with original file if compression throws unexpected error
      compressionResult = {
        buffer: req.file.buffer,
        originalSize,
        compressedSize: originalSize,
        compressionRatio: 0,
        compressed: false,
        error: error.message
      };
    }
  } else {
    console.log(`[Upload] Skipping compression for ${req.file.mimetype}`);
  }

  // 1. Upload to R2
  const { fileURL, fileKey } = await uploadFileToR2(req.file, 'study-materials');

  // 2. Create DB Entry
  const material = await StudyMaterial.create({
    title: title.trim(),
    description: description ? description.trim() : '',
    subject: subject.trim(),
    category,
    semester,
    department,
    tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
    fileURL,
    fileKey,
    fileType: req.file.mimetype,
    uploadedBy: req.user._id,
  });

  // 3. Update User Stats
  await User.findByIdAndUpdate(req.user._id, { $inc: { totalUploads: 1 } });

  res.status(201).json({
    success: true,
    message: 'Material uploaded successfully',
    material,
    compression: {
      originalSize: formatFileSize(originalSize),
      finalSize: formatFileSize(compressionResult.compressedSize),
      compressionRatio: compressionResult.compressionRatio || 0,
      compressed: compressionResult.compressed || false,
    },
  });
});

// @desc    Get all materials with Filter & Pagination
// @route   GET /api/materials
// @access  Public (or Private)
export const getMaterials = catchAsyncErrors(async (req, res, next) => {
  const { 
    category, subject, semester, search, 
    page = 1, limit = 10, uploader 
  } = req.query;

  const query = {};

  // Filters
  if (category) query.category = category;
  if (subject) query.subject = subject;
  if (semester) query.semester = semester;
  if (req.query.department) query.department = req.query.department;
  
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

// @desc    Get single material by ID
// @route   GET /api/materials/:id
// @access  Public
export const getMaterialById = catchAsyncErrors(async (req, res, next) => {
  const material = await StudyMaterial.findById(req.params.id)
    .populate('uploadedBy', 'name profileImageURL email totalUploads semester');

  if (!material) {
    return next(new ErrorHandler('Material not found', 404));
  }

  // Increment view count
  material.views = (material.views || 0) + 1;
  await material.save();

  res.status(200).json({
    success: true,
    material,
  });
});

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private (Owner only)
export const updateMaterial = catchAsyncErrors(async (req, res, next) => {
  let material = await StudyMaterial.findById(req.params.id);

  if (!material) {
    return next(new ErrorHandler('Material not found', 404));
  }

  // Check ownership
  if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorHandler('Not authorized to update this material', 403));
  }

  const { title, description, subject, category, semester, department, tags } = req.body;

  const updateData = {};
  if (title) updateData.title = title.trim();
  if (description !== undefined) updateData.description = description.trim();
  if (subject) updateData.subject = subject.trim();
  if (category) updateData.category = category;
  if (semester) updateData.semester = semester;
  if (department) updateData.department = department;
  if (tags) updateData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

  material = await StudyMaterial.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate('uploadedBy', 'name profileImageURL');

  res.status(200).json({
    success: true,
    message: 'Material updated successfully',
    material,
  });
});

// @desc    Track material download
// @route   POST /api/materials/:id/download
// @access  Public
export const trackDownload = catchAsyncErrors(async (req, res, next) => {
  const material = await StudyMaterial.findById(req.params.id);

  if (!material) {
    return next(new ErrorHandler('Material not found', 404));
  }

  // Increment download count
  material.downloads = (material.downloads || 0) + 1;
  await material.save();

  res.status(200).json({
    success: true,
    message: 'Download tracked',
  });
});

// @desc    Save/Unsave material
// @route   POST /api/materials/:id/save
// @access  Private
export const toggleSaveMaterial = catchAsyncErrors(async (req, res, next) => {
  const material = await StudyMaterial.findById(req.params.id);

  if (!material) {
    return next(new ErrorHandler('Material not found', 404));
  }

  const user = await User.findById(req.user._id);
  
  const isSaved = user.savedMaterials.includes(req.params.id);

  if (isSaved) {
    // Unsave
    user.savedMaterials = user.savedMaterials.filter(
      id => id.toString() !== req.params.id
    );
    material.savedBy = material.savedBy.filter(
      id => id.toString() !== req.user._id.toString()
    );
    await user.save();
    await material.save();

    res.status(200).json({
      success: true,
      message: 'Material removed from saved collection',
      isSaved: false,
    });
  } else {
    // Save
    user.savedMaterials.push(req.params.id);
    if (!material.savedBy) material.savedBy = [];
    material.savedBy.push(req.user._id);
    await user.save();
    await material.save();

    res.status(200).json({
      success: true,
      message: 'Material saved to your collection',
      isSaved: true,
    });
  }
});

// @desc    Get saved materials for logged-in user
// @route   GET /api/materials/saved
// @access  Private
export const getSavedMaterials = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: 'savedMaterials',
    populate: {
      path: 'uploadedBy',
      select: 'name profileImageURL'
    }
  });

  res.status(200).json({
    success: true,
    materials: user.savedMaterials || [],
  });
});

// @desc    Get user's uploaded materials
// @route   GET /api/materials/my-uploads
// @access  Private
export const getMyUploads = catchAsyncErrors(async (req, res, next) => {
  const materials = await StudyMaterial.find({ uploadedBy: req.user._id })
    .populate('uploadedBy', 'name profileImageURL')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    materials,
    totalUploads: materials.length,
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

  // 2. Remove from all users' saved materials
  await User.updateMany(
    { savedMaterials: req.params.id },
    { $pull: { savedMaterials: req.params.id } }
  );

  // 3. Delete from DB
  await material.deleteOne();

  // 4. Decrement stats
  await User.findByIdAndUpdate(material.uploadedBy, { $inc: { totalUploads: -1 } });

  res.status(200).json({
    success: true,
    message: 'Material removed successfully',
  });
});