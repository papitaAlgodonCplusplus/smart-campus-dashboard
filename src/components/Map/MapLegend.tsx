import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface MapLegendProps {
  isNightMode: boolean;
}

const MapLegend: React.FC<MapLegendProps> = ({ isNightMode }) => {
  return (
    <Paper 
      elevation={3}
      sx={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        padding: '10px',
        backgroundColor: 'rgba(5, 5, 25, 0.8)',
        borderRadius: '8px',
        border: '1px solid var(--neon-primary)',
        boxShadow: '0 0 10px var(--neon-primary)',
        backdropFilter: 'blur(5px)',
        color: 'white',
        width: '180px',
        fontFamily: 'Rajdhani, sans-serif'
      }}
    >
      <Typography 
        variant="subtitle2" 
        sx={{ 
          color: 'var(--neon-primary)', 
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '0.9rem',
          mb: 1,
          textShadow: '0 0 5px var(--neon-primary)'
        }}
      >
        Nivel de Ocupación
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* High occupancy */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%',
              backgroundColor: 'var(--neon-red)',
              mr: 1,
              boxShadow: '0 0 8px var(--neon-red)'
            }}
          />
          <Typography variant="body2" sx={{ color: 'var(--neon-red)' }}>
            Alta (70-100%)
          </Typography>
        </Box>
        
        {/* Medium occupancy */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%',
              backgroundColor: 'var(--neon-orange)',
              mr: 1,
              boxShadow: '0 0 8px var(--neon-orange)'
            }}
          />
          <Typography variant="body2" sx={{ color: 'var(--neon-orange)' }}>
            Media (40-69%)
          </Typography>
        </Box>
        
        {/* Low occupancy */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%',
              backgroundColor: 'var(--neon-green)',
              mr: 1,
              boxShadow: '0 0 8px var(--neon-green)'
            }}
          />
          <Typography variant="body2" sx={{ color: 'var(--neon-green)' }}>
            Baja (0-39%)
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default MapLegend;