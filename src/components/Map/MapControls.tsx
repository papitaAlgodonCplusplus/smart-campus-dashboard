import React from 'react';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Slider, 
  Typography,
  Button
} from '@mui/material';

// Define types for the controls props
interface MapControlsProps {
  onTourStart: () => void;
  onReset: () => void;
  onToggleBuildingLabels: () => void;
  showLabels: boolean;
  onToggleNightMode: () => void;
  isNightMode: boolean;
  timeOfDay: number;
  onTimeChange: (value: number) => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  onTourStart,
  onReset,
  onToggleBuildingLabels,
  showLabels,
  onToggleNightMode,
  isNightMode,
  timeOfDay,
  onTimeChange
}) => {
  // Time of day markers for the slider
  const timeMarks = [
    { value: 0, label: '6 AM' },
    { value: 25, label: '12 PM' },
    { value: 50, label: '6 PM' },
    { value: 75, label: '12 AM' },
    { value: 100, label: '6 AM' }
  ];
  
  return (
    <Box 
      sx={{
        position: 'absolute',
        top: 10,
        left: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 2,
        borderRadius: '8px',
        border: '1px solid var(--neon-primary)',
        boxShadow: '0 0 10px var(--neon-primary)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        maxWidth: '260px'
      }}
    >
      <Typography variant="subtitle2" sx={{ color: 'var(--neon-primary)' }}>
        Controles del Mapa
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Recorrido virtual">
          <Button 
            variant="outlined"
            size="small"
            onClick={onTourStart}
            sx={{ 
              fontSize: '0.7rem', 
              borderColor: 'var(--neon-blue)',
              color: 'var(--neon-blue)',
              '&:hover': {
                borderColor: 'var(--neon-primary)',
                color: 'var(--neon-primary)',
                boxShadow: '0 0 10px var(--neon-primary)'
              }
            }}
          >
            Recorrido
          </Button>
        </Tooltip>
        
        <Tooltip title="Reiniciar vista">
          <Button 
            variant="outlined"
            size="small"
            onClick={onReset}
            sx={{ 
              fontSize: '0.7rem',
              borderColor: 'var(--neon-green)',
              color: 'var(--neon-green)',
              '&:hover': {
                borderColor: 'var(--neon-primary)',
                color: 'var(--neon-primary)',
                boxShadow: '0 0 10px var(--neon-primary)'
              }
            }}
          >
            Reiniciar
          </Button>
        </Tooltip>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title={showLabels ? "Ocultar etiquetas" : "Mostrar etiquetas"}>
          <Button 
            variant="outlined"
            size="small"
            onClick={onToggleBuildingLabels}
            sx={{ 
              fontSize: '0.7rem',
              borderColor: showLabels ? 'var(--neon-primary)' : 'gray',
              color: showLabels ? 'var(--neon-primary)' : 'gray',
              '&:hover': {
                borderColor: 'var(--neon-primary)',
                color: 'var(--neon-primary)',
                boxShadow: '0 0 10px var(--neon-primary)'
              }
            }}
          >
            {showLabels ? "Ocultar Nombres" : "Mostrar Nombres"}
          </Button>
        </Tooltip>
        
        <Tooltip title={isNightMode ? "Modo día" : "Modo noche"}>
          <Button 
            variant="outlined"
            size="small"
            onClick={onToggleNightMode}
            sx={{ 
              fontSize: '0.7rem',
              borderColor: isNightMode ? 'var(--neon-blue)' : '#f80',
              color: isNightMode ? 'var(--neon-blue)' : '#f80',
              '&:hover': {
                borderColor: 'var(--neon-primary)',
                color: 'var(--neon-primary)',
                boxShadow: '0 0 10px var(--neon-primary)'
              }
            }}
          >
            {isNightMode ? "Modo Día" : "Modo Noche"}
          </Button>
        </Tooltip>
      </Box>
      
      <Box sx={{ px: 1, pt: 1 }}>
        <Typography variant="caption" sx={{ color: 'white' }}>
          Hora del día
        </Typography>
        <Slider
          value={timeOfDay}
          onChange={(_, value) => onTimeChange(value as number)}
          min={0}
          max={100}
          step={1}
          marks={timeMarks}
          sx={{ 
            color: 'var(--neon-primary)',
            '& .MuiSlider-thumb': {
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(0, 255, 255, 0.16)'
              }
            },
            '& .MuiSlider-rail': {
              background: 'linear-gradient(90deg, #041020 0%, #0ff 25%, #f80 50%, #041020 75%, #0ff 100%)'
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default MapControls;