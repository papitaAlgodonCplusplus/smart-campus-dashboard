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