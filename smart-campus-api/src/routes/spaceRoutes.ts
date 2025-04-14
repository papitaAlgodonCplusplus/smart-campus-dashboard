import express from 'express';
import * as spaceController from '../controllers/spaceController';

const router = express.Router();

router.get('/', spaceController.getSpaces);
router.get('/:id', spaceController.getSpaceById);
router.put('/:id/occupancy', spaceController.updateOccupancy);

export default router;