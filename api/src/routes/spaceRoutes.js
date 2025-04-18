import express from 'express';
import * as spaceController from '/opt/render/project/src/api/src/controllers/spaceController.js'
const router = express.Router();

router.get('/', spaceController.getSpaces);
router.get('/:id', spaceController.getSpaceById);
router.put('/:id/occupancy', spaceController.updateOccupancy);

export default router;