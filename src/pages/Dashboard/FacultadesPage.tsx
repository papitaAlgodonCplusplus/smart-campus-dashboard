import React from 'react';
import {
  Container,
  Typography,
  Box
} from '@mui/material';
import { useDashboard } from '../../components/Dashboard/DashboardContext';
import CategoryChart from '../../components/Dashboard/CategoryChart';
import CategorySpaces from '../../components/Dashboard/CategorySpaces';

const FacultadesPage: React.FC = () => {
  const { loading, error, categorizedSpaces } = useDashboard();
  const categoryName = 'Facultades';
  const facultadesSpaces = categorizedSpaces.facultades;
  
  // Calculate stats for this category
  const totalCapacity = facultadesSpaces.reduce((acc, space) => acc + space.capacity, 0);
  const totalOccupancy = facultadesSpaces.reduce((acc, space) => acc + space.currentOccupancy, 0);
  const occupancyPercentage = Math.round((totalOccupancy / totalCapacity) * 100);

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom className="with-glow">
        {categoryName}
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Ocupación actual: <span style={{ 
          color: occupancyPercentage > 80 
            ? 'var(--neon-red)' 
            : occupancyPercentage > 50 
              ? 'var(--neon-orange)' 
              : 'var(--neon-green)',
          fontWeight: 'bold',
          textShadow: `0 0 5px ${
            occupancyPercentage > 80 
              ? 'var(--neon-red)' 
              : occupancyPercentage > 50 
                ? 'var(--neon-orange)' 
                : 'var(--neon-green)'
          }`
        }}>
          {totalOccupancy} de {totalCapacity} ({occupancyPercentage}%)
        </span>
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div className="neon-loading"></div>
        </Box>
      ) : error ? (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        </Box>
      ) : (
        <>
          {/* Occupancy Chart */}
          <CategoryChart 
            categoryName={categoryName}
            spaces={facultadesSpaces}
          />
          
          {/* Spaces List */}
          <CategorySpaces 
            categoryName={categoryName}
            spaces={facultadesSpaces}
          />
          
          {/* Current Time and Last Updated */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, color: 'text.secondary' }}>
            <Typography variant="body2">
              Última actualización: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </>
      )}
    </Container>
  );
};

export default FacultadesPage;