import axios from 'axios';
import { Listing, ListingFormData } from '../types/MarketplaceTypes';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Utility function to set the auth token in request headers
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all listings with optional filters
export const fetchListings = async (filters: Record<string, any> = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== 'all') {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await axios.get(`${REACT_APP_API_URL}/marketplace${queryString}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

// Fetch a single listing by ID
export const fetchListingById = async (id: string) => {
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/marketplace/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }
};

// Create a new listing
export const createListing = async (listingData: ListingFormData) => {
  try {
    const response = await axios.post(`${REACT_APP_API_URL}/marketplace`, listingData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

// Update an existing listing
export const updateListing = async (id: string, listingData: Partial<ListingFormData>) => {
  try {
    const response = await axios.put(`${REACT_APP_API_URL}/marketplace/${id}`, listingData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

// Delete a listing
export const deleteListing = async (id: string) => {
  try {
    const response = await axios.delete(`${REACT_APP_API_URL}/marketplace/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

export const fetchUserLikes = async (userId: string) => {
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/marketplace/user/${userId}/likes`, {
      headers: getAuthHeader()
    });
    return response.data.likedListingIds || [];
  } catch (error) {
    console.error('Error fetching user likes:', error);
    return [];
  }
};

// Toggle like on a listing
export const toggleLikeListing = async (id: string) => {
  try {
    const response = await axios.post(`${REACT_APP_API_URL}/marketplace/${id}/like`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Toggle save on a listing
export const toggleSaveListing = async (id: string) => {
  try {
    const response = await axios.post(`${REACT_APP_API_URL}/marketplace/${id}/save`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling save:', error);
    throw error;
  }
};

// Get user's saved listings
export const fetchSavedListings = async () => {
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/marketplace/user/saved`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching saved listings:', error);
    throw error;
  }
};

// Get user's own listings
export const fetchMyListings = async () => {
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/marketplace/user/my-listings`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching my listings:', error);
    throw error;
  }
};