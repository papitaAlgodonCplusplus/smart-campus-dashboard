import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper
} from '@mui/material';
import { useDashboard } from '../../components/Dashboard/DashboardContext';
import CategoryChart from '../../components/Dashboard/CategoryChart';
import CategorySpaces from '../../components/Dashboard/CategorySpaces';
import AmenidadesGallery from './Utils/AmenidadesGallery';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

const AmenidadesPage: React.FC = () => {
  const { loading, error, categorizedSpaces } = useDashboard();
  const categoryName = 'Amenidades';
  const amenidadesSpaces = categorizedSpaces.amenidades;
  const [view3D, setView3D] = useState(true);

  // Calculate stats for this category
  const totalCapacity = amenidadesSpaces.reduce((acc, space) => acc + space.capacity, 0);
  const totalOccupancy = amenidadesSpaces.reduce((acc, space) => acc + space.currentOccupancy, 0);
  const occupancyPercentage = Math.round((totalOccupancy / totalCapacity) * 100);

  const toggleView = () => {
    setView3D(!view3D);
  };

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
          textShadow: `0 0 5px ${occupancyPercentage > 80
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
            spaces={amenidadesSpaces}
          />

          {/* View Toggle Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
            <Button
              variant="outlined"
              startIcon={view3D ? <ViewModuleIcon /> : <ViewInArIcon />}
              onClick={toggleView}
              sx={{
                borderColor: 'var(--neon-primary)',
                color: 'var(--neon-primary)',
                '&:hover': {
                  borderColor: 'var(--neon-blue)',
                  color: 'var(--neon-blue)',
                  boxShadow: '0 0 10px var(--neon-blue)'
                }
              }}
            >
              {view3D ? 'Vista Lista' : 'Vista 3D'}
            </Button>
          </Box>

          {/* Spaces List or 3D Gallery */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: '42rem',
              backgroundColor: 'rgba(5, 5, 25, 0.8)',
              backdropFilter: 'blur(5px)',
              border: '1px solid var(--neon-primary)',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
              borderRadius: '8px',
              mb: 4
            }}
          >
            {view3D ? (
              <Box sx={{
                mt: 2, mb: 2,
                height: '32rem'
              }}>
                <Typography variant="subtitle1" gutterBottom>
                  Galería 3D de Amenidades - Haz clic en cualquier marco para ampliar
                </Typography>
                <br />
                <br />
                <AmenidadesGallery spaces={amenidadesSpaces} />
              </Box>
            ) : (
              <CategorySpaces
                categoryName={categoryName}
                spaces={amenidadesSpaces}
              />
            )}
          </Paper>

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

export default AmenidadesPage;