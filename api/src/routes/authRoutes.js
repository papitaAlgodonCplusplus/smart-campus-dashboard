import { registerUser, loginUser, getUserProfile, updateUserProfile } from '/opt/render/project/src/api/src/controllers/authController.js';
// import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/authController.js';
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;