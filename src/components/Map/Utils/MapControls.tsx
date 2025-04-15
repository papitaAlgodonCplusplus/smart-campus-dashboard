import React from 'react';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Slider, 
  Typography,
  Button,
  Switch
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
  onTimeChange: (value: number | number[]) => void;
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
  
  // Handle slider change
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    onTimeChange(newValue);
  };
  
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
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        <Button 
          variant="outlined"
          size="small"
          onClick={onReset}
          sx={{ 
            fontSize: '0.7rem',
            flex: 1,
            borderColor: 'var(--neon-primary)',
            color: 'var(--neon-primary)',
            '&:hover': {
              borderColor: 'var(--neon-primary)',
              color: 'var(--neon-primary)',
              boxShadow: '0 0 10px var(--neon-primary)'
            }
          }}
        >
          Reset Vista
        </Button>
        
        <Button 
          variant="outlined"
          size="small"
          onClick={onTourStart}
          sx={{ 
            fontSize: '0.7rem',
            flex: 1,
            borderColor: 'var(--neon-blue)',
            color: 'var(--neon-blue)',
            '&:hover': {
              borderColor: 'var(--neon-blue)',
              color: 'var(--neon-blue)',
              boxShadow: '0 0 10px var(--neon-blue)'
            }
          }}
        >
          Tour Guiado
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: 'white' }}>
          Etiquetas
        </Typography>
        <Switch
          checked={showLabels}
          onChange={onToggleBuildingLabels}
          size="small"
          sx={{ 
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: 'var(--neon-primary)',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 255, 0.08)',
              },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: 'var(--neon-primary)',
            },
          }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: 'white' }}>
          {isNightMode ? "Modo Noche" : "Modo Día"}
        </Typography>
        <Switch
          checked={isNightMode}
          onChange={onToggleNightMode}
          size="small"
          sx={{ 
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: 'var(--neon-blue)',
              '&:hover': {
                backgroundColor: 'rgba(0, 140, 255, 0.08)',
              },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: 'var(--neon-blue)',
            },
          }}
        />
      </Box>
      
      <Box sx={{ px: 1, pt: 1 }}>
        <Typography variant="caption" sx={{ color: 'white' }}>
          Hora del día
        </Typography>
        <Slider
          value={typeof timeOfDay === 'number' ? timeOfDay : 0}
          onChange={handleSliderChange}
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
      
      {/* Time cycle visualization */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', 
        borderRadius: '20px',
        padding: '5px 10px',
        marginTop: 1
      }}>
        <Box sx={{ fontSize: '1rem', color: '#f59e0b' }}>☀️</Box>
        <Box 
          sx={{ 
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${timeOfDay}%`,
            background: isNightMode 
              ? 'linear-gradient(90deg, rgba(0, 0, 255, 0.2) 0%, rgba(8, 26, 81, 0.5) 100%)' 
              : 'linear-gradient(90deg, rgba(173, 216, 230, 0.3) 0%, rgba(135, 206, 235, 0.4) 100%)',
            borderRadius: '20px',
            transition: 'width 0.3s ease',
            zIndex: 0
          }}
        />
        <Box sx={{ fontSize: '1rem', color: '#93c5fd', zIndex: 1 }}>🌙</Box>
      </Box>
    </Box>
  );
};

export default MapControls;