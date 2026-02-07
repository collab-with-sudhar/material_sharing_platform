import express from 'express';
import { 
  uploadMaterial, 
  getMaterials, 
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  toggleSaveMaterial,
  getSavedMaterials,
  getMyUploads,
  trackDownload
} from '../controllers/materialController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMaterials) // Anyone can view
  .post(isAuthenticatedUser, upload.single('file'), uploadMaterial); // Only auth users upload

router.get('/saved', isAuthenticatedUser, getSavedMaterials); // Get saved materials
router.get('/my-uploads', isAuthenticatedUser, getMyUploads); // Get user's uploads

router.route('/:id')
  .get(getMaterialById) // Get single material
  .put(isAuthenticatedUser, updateMaterial) // Update material
  .delete(isAuthenticatedUser, deleteMaterial); // Delete material

router.post('/:id/save', isAuthenticatedUser, toggleSaveMaterial); // Save/Unsave material
router.post('/:id/download', trackDownload); // Track downloads

export default router;
