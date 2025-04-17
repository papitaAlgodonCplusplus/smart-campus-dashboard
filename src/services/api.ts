import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchSpaces = async () => {
  try {
    const response = await axios.get(`${API_URL}/spaces`);
    return response.data;
  } catch (error) {
    console.error('Error fetching spaces:', error);
    throw error;
  }
};

export const fetchBuildingLocations = async () => {
  try {
    const response = await axios.get(`${API_URL}/buildings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching building locations:', error);
    throw error;
  }
};

export const updateSpaceOccupancy = async (id: string, currentOccupancy: number) => {
  try {
    const response = await axios.put(`${API_URL}/spaces/${id}/occupancy`, { currentOccupancy });
    return response.data;
  } catch (error) {
    console.error('Error updating space occupancy:', error);
    throw error;
  }
};

// New function to fetch the hourly data
export const fetchHourlyData = async () => {
  try {
    const response = await axios.get(`${API_URL}/hourly-data/latest`);
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
    const response = await axios.get(`${API_URL}/hourly-data?date=${formattedDate}`);
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
      `${API_URL}/hourly-data/range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching hourly data range:', error);
    throw error;
  }
};