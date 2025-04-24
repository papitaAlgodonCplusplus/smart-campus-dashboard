import express from 'express';
import * as hourlyDataController from '/opt/render/project/src/api/src/controllers/hourlyDataController.js'
// import * as hourlyDataController from '../controllers/hourlyDataController.js';

const router = express.Router();

// Route to get hourly data for a day
router.get('/', hourlyDataController.getHourlyData);

// Route to get hourly data for a date range
router.get('/range', hourlyDataController.getHourlyDataRange);

// Route to get the latest hourly data formatted for charts
router.get('/latest', hourlyDataController.getLatestHourlyData);

export default router;