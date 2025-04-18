import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Reservation from '../models/Reservation';
import Space from '../models/Space';

// Helper function to check if a time slot is available
const isTimeSlotAvailable = async (
    spaceId: string,
    date: string,
    startTime: string,
    endTime: string
): Promise<boolean> => {
    const reservations = await Reservation.find({ spaceId, date });

    for (const reservation of reservations) {
        if (reservation.conflictsWith(date, startTime, endTime)) {
            return false;
        }
    }

    return true;
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Public (might be restricted in the future)
const getReservations = async (req: Request, res: Response) => {
    try {
        const reservations = await Reservation.find().sort('-date');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error instanceof Error ? error.message : 'An unknown error occurred' : 'An unknown error occurred' });
    }
};

// @desc    Get a single reservation
// @route   GET /api/reservations/:id
// @access  Public (might be restricted in the future)
const getReservation = async (req: Request, res: Response) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            res.status(404).json({ message: 'Reservation not found' });
            return;
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Public (might be restricted in the future)
const createReservation = async (req: Request, res: Response) => {
    try {
        
        const { spaces, date, startTime, endTime, isAnonymous, userName } = req.body;

        if (!spaces || spaces.length === 0) {
            res.status(400).json({ message: 'Please select at least one space' });
            return;
        }

        const createdReservations = [];

        for (const spaceId of spaces) {
            const space = await Space.findById(spaceId);
            if (!space) {
                res.status(404).json({ message: `Space with ID ${spaceId} not found` });
                return;
            }

            const isAvailable = await isTimeSlotAvailable(spaceId, date, startTime, endTime);
            if (!isAvailable) {
                res.status(400).json({ message: `The selected time slot for ${space.name} is already booked` });
                return;
            }

            const reservation = await Reservation.create({
                spaceId,
                spaceName: space.name,
                date,
                startTime,
                endTime,
                isAnonymous,
                userId: null,
                userName: isAnonymous ? null : userName,
            });

            createdReservations.push(reservation);
        }

        res.status(201).json(
            createdReservations.length === 1 ? createdReservations[0] : createdReservations
        );
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

// @desc    Delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Public (might be restricted in the future)
const deleteReservation = async (req: Request, res: Response) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            res.status(404).json({ message: 'Reservation not found' });
            return;
        }

        await reservation.deleteOne();

        res.json({ message: 'Reservation removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

// @desc    Get reservations by space
// @route   GET /api/reservations/space/:spaceId
// @access  Public
const getReservationsBySpace = async (req: Request, res: Response) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.spaceId)) {
            res.status(400).json({ message: 'Invalid space ID' });
            return;
        }

        const reservations = await Reservation.find({ spaceId: req.params.spaceId }).sort('date startTime');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

// @desc    Get reservations by user
// @route   GET /api/reservations/user/:userName
// @access  Public (might be restricted in the future)
const getReservationsByUser = async (req: Request, res: Response) => {
    try {
        const reservations = await Reservation.find({ userName: req.params.userName }).sort('date startTime');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

// @desc    Get reservations by date
// @route   GET /api/reservations/date/:date
// @access  Public
const getReservationsByDate = async (req: Request, res: Response) => {
    try {
        const { date } = req.params;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
            return;
        }

        const reservations = await Reservation.find({ date }).sort('startTime');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

// @desc    Check time slot availability
// @route   GET /api/reservations/availability
// @access  Public
const checkTimeSlotAvailability = async (req: Request, res: Response) => {
    try {
        const { spaceId, date, startTime, endTime } = req.query;

        if (!spaceId || !date || !startTime || !endTime) {
            res.status(400).json({ message: 'spaceId, date, startTime, and endTime are all required' });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(spaceId as string)) {
            res.status(400).json({ message: 'Invalid space ID' });
            return;
        }

        const available = await isTimeSlotAvailable(spaceId as string, date as string, startTime as string, endTime as string);
        res.json({ available });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

export {
    getReservations,
    getReservation,
    createReservation,
    deleteReservation,
    getReservationsBySpace,
    getReservationsByUser,
    getReservationsByDate,
    checkTimeSlotAvailability,
};
