import express from 'express';
import {
  registerUser,
  loginUser,
  googleLogin,
  logout,
  getProfile,
  getUserDetails,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/auth/google', googleLogin);
router.get('/logout', logout);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

// Protected routes (requires authentication)
router.get('/profile', isAuthenticatedUser, getProfile);
router.get('/me', isAuthenticatedUser, getUserDetails);
router.put('/me/update', isAuthenticatedUser, updateProfile);
router.put('/password/update', isAuthenticatedUser, updatePassword);

// Admin routes (requires authentication + admin role)
router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

export default router;