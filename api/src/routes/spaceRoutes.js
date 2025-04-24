import * as spaceController from '/opt/render/project/src/api/src/controllers/spaceController.js'
// import * as spaceController from '../controllers/spaceController.js';
import express from 'express';
const router = express.Router();

router.get('/', spaceController.getSpaces);
router.get('/:id', spaceController.getSpaceById);
router.put('/:id/occupancy', spaceController.updateOccupancy);

export default router;