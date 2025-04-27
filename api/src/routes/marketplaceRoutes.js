import * as listingController from '/opt/render/project/src/api/src/controllers/listingController.js';
// import * as listingController from '../controllers/listingController.js';
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', listingController.getListings);
router.get('/:id', listingController.getListingById);

// Protected routes
router.post('/', protect, listingController.createListing);
router.put('/:id', protect, listingController.updateListing);
router.delete('/:id', protect, listingController.deleteListing);

// Like and save routes
router.post('/:id/like', protect, listingController.toggleLike);
router.post('/:id/save', protect, listingController.toggleSave);

// User-specific routes
router.get('/user/saved', protect, listingController.getSavedListings);
router.get('/user/my-listings', protect, listingController.getMyListings);
router.get('/user/:userId/likes', protect, listingController.getUserLikedListings);

export default router;