import axios from 'axios';
import { ReservationFormData } from '../types/ReservationTypes';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchSpaces = async () => {
  try {
    console.log('Fetching spaces from API:', `${REACT_APP_API_URL}/spaces`);
    const response = await axios.get(`${REACT_APP_API_URL}/spaces`);
    return response.data;
  } catch (error) {
    console.error('Error fetching spaces:', error);
    throw error;
  }
};

export const fetchBuildingLocations = async () => {
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/buildings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching building locations:', error);
    throw error;
  }
};

export const updateSpaceOccupancy = async (id: string, currentOccupancy: number) => {
  try {
    const response = await axios.put(`${REACT_APP_API_URL}/spaces/${id}/occupancy`, { currentOccupancy });
    return response.data;
  } catch (error) {
    console.error('Error updating space occupancy:', error);
    throw error;
  }
};

// Function to fetch hourly data
export const fetchHourlyData = async () => {
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/hourly-data/latest`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hourly data:', error);
    throw error;
  }
};

// Function to fetch hourly data for a specific date
export const fetchHourlyDataByDate = async (date: Date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const response = await axios.get(`${REACT_APP_API_URL}/hourly-data?date=${formattedDate}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hourly data by date:', error);
    throw error;
  }
};

// Function to fetch hourly data for a date range
export const fetchHourlyDataRange = async (startDate: Date, endDate: Date) => {
  try {
    const formattedStartDate = startDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const formattedEndDate = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const response = await axios.get(
      `${REACT_APP_API_URL}/hourly-data/range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching hourly data range:', error);
    throw error;
  }
};

// RESERVATIONS API FUNCTIONS

// Fetch all reservations
export const fetchReservations = async () => {
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/reservations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

// Create a new reservation
export const createReservation = async (formData: ReservationFormData) => {
  try {
    const response = await axios.post(`${REACT_APP_API_URL}/reservations`, formData);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

// Delete a reservation
export const deleteReservation = async (id: string) => {
  try {
    const response = await axios.delete(`${REACT_APP_API_URL}/reservations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
};

// Get reservations by space ID
export const fetchReservationsBySpace = async (spaceId: string) => {
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/reservations/space/${spaceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations by space:', error);
    throw error;
  }
};

// Get reservations by user name
export const fetchReservationsByUser = async (userName: string) => {
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/reservations/user/${userName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations by user:', error);
    throw error;
  }
};

// Get reservations for a specific date
export const fetchReservationsByDate = async (date: string) => {
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/reservations/date/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations by date:', error);
    throw error;
  }
};

// Check availability for a specific time slot
export const checkTimeSlotAvailability = async (
  spaceId: string,
  date: string,
  startTime: string,
  endTime: string
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/reservations/availability?spaceId=${spaceId}&date=${date}&startTime=${startTime}&endTime=${endTime}`
    );
    return response.data.available;
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    throw error;
  }
};