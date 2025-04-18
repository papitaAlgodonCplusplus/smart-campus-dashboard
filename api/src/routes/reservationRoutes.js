import express from 'express';
const router = express.Router();
import * as reservationController from  '/opt/render/project/src/api/src/controllers/reservationController';

// Get all reservations and create a reservation
router.route('/')
  .get(reservationController.getReservations)
  .post(reservationController.createReservation);

// Get, update and delete a reservation by ID
router.route('/:id')
  .get(reservationController.getReservation)
  .delete(reservationController.deleteReservation);

// Check time slot availability
router.route('/availability')
  .get(reservationController.checkTimeSlotAvailability);

// Get reservations by space
router.route('/space/:spaceId')
  .get(reservationController.getReservationsBySpace);

// Get reservations by user
router.route('/user/:userName')
  .get(reservationController.getReservationsByUser);

// Get reservations by date
router.route('/date/:date')
  .get(reservationController.getReservationsByDate);

export default router;