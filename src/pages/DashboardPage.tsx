import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import SpaceOccupancy from '../components/Dashboard/SpaceOccupancy';

// Mock data - will be replaced with API calls
const spaceData = [
  { id: 1, name: 'Main Library', currentOccupancy: 45, maxCapacity: 100 },
  { id: 2, name: 'Computer Lab', currentOccupancy: 12, maxCapacity: 30 },
  { id: 3, name: 'Study Room A', currentOccupancy: 8, maxCapacity: 10 },
  { id: 4, name: 'Cafeteria', currentOccupancy: 75, maxCapacity: 150 }
];

const DashboardPage: React.FC = () => {
  const [spaces, setSpaces] = useState(spaceData);
  
  // In a real app, you would fetch data here
  useEffect(() => {
    // Future API call will go here
  }, []);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Campus Dashboard
      </Typography>
      
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
        Space Availability
      </Typography>
      <Grid container spacing={3}>
        {spaces.map(space => (
          <Grid item xs={12} md={6} lg={3} key={space.id}>
            <SpaceOccupancy 
              name={space.name} 
              currentOccupancy={space.currentOccupancy} 
              maxCapacity={space.maxCapacity} 
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DashboardPage;