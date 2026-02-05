import express from 'express';
import { uploadMaterial, getMaterials, deleteMaterial } from '../controllers/materialController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMaterials) // Anyone can view
  .post(isAuthenticatedUser, upload.single('file'), uploadMaterial); // Only auth users upload

router.route('/:id')
  .delete(isAuthenticatedUser, deleteMaterial);

export default router;