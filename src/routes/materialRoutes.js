const express = require('express');
const router = express.Router();
const { uploadMaterial, getMaterials, deleteMaterial } = require('../controllers/materialController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/')
  .get(getMaterials) // Anyone can view
  .post(protect, upload.single('file'), uploadMaterial); // Only auth users upload

router.route('/:id')
  .delete(protect, deleteMaterial);

module.exports = router;