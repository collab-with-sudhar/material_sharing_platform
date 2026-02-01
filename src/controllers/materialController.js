const StudyMaterial = require('../models/StudyMaterial');
const User = require('../models/User');
const { uploadFileToR2, deleteFileFromR2 } = require('../utils/r2Service');

// @desc    Upload new material
// @route   POST /api/materials
// @access  Private
const uploadMaterial = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

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
      firebaseUID: req.user.firebaseUID,
    });

    // 3. Update User Stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalUploads: 1 } });

    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all materials with Filter & Pagination
// @route   GET /api/materials
// @access  Public (or Private)
const getMaterials = async (req, res) => {
  try {
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
      const user = await User.findOne({ firebaseUID: uploader });
      if (user) query.uploadedBy = user._id;
    }

    const materials = await StudyMaterial.find(query)
      .populate('uploadedBy', 'name profileImageURL')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await StudyMaterial.countDocuments(query);

    res.json({
      materials,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private (Owner only)
const deleteMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) return res.status(404).json({ message: 'Material not found' });

    // Check ownership
    if (material.firebaseUID !== req.user.firebaseUID && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this' });
    }

    // 1. Delete from R2
    await deleteFileFromR2(material.fileKey);

    // 2. Delete from DB
    await material.deleteOne();

    // 3. Decrement stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalUploads: -1 } });

    res.json({ message: 'Material removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadMaterial, getMaterials, deleteMaterial };