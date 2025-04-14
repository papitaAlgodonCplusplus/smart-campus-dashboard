import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SpaceOccupancy from '../components/Dashboard/SpaceOccupancy';
import { fetchSpaces } from '../services/api';

// Interface for space data
interface Space {
  _id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  lastUpdated: Date;
}

// Mock data for initial state
const mockSpaceData = [
  { _id: '1', name: 'Main Library', building: 'Library', floor: 1, capacity: 100, currentOccupancy: 45, lastUpdated: new Date() },
  { _id: '2', name: 'Computer Lab', building: 'Tech Center', floor: 2, capacity: 30, currentOccupancy: 12, lastUpdated: new Date() },
  { _id: '3', name: 'Study Room A', building: 'Student Center', floor: 1, capacity: 10, currentOccupancy: 8, lastUpdated: new Date() },
  { _id: '4', name: 'Cafeteria', building: 'Commons', floor: 1, capacity: 150, currentOccupancy: 75, lastUpdated: new Date() }
];

const DashboardPage: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>(mockSpaceData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch real data from API
  useEffect(() => {
    const getSpaces = async () => {
      try {
        setLoading(true);
        const data = await fetchSpaces();
        setSpaces(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch spaces', err);
        setError('Failed to load spaces. Please try again later.');
        // Keep the mock data if API fails
      } finally {
        setLoading(false);
      }
    };
    
    getSpaces();
  }, []);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Campus Dashboard
      </Typography>
      
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
        Space Availability
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {spaces.map(space => (
            <Grid key={space._id} size={3}>
              <SpaceOccupancy 
                name={space.name} 
                currentOccupancy={space.currentOccupancy} 
                maxCapacity={space.capacity} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;