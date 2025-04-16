import React, { useState, useEffect } from 'react';
import { Box, Button, Snackbar, Alert, Tooltip, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import NearMeIcon from '@mui/icons-material/NearMe';
import NearMeDisabledIcon from '@mui/icons-material/NearMeDisabled';

interface UserLocationTrackerProps {
  onLocationUpdate: (position: GeolocationPosition) => void;
  isTracking: boolean;
  setIsTracking: (isTracking: boolean) => void;
  followUser: boolean;
  setFollowUser: (follow: boolean) => void;
}

const UserLocationTracker: React.FC<UserLocationTrackerProps> = ({ 
  onLocationUpdate, 
  isTracking,
  setIsTracking,
  followUser,
  setFollowUser
}) => {
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Start tracking user location
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);
    
    const id = navigator.geolocation.watchPosition(
      (position) => {
        onLocationUpdate(position);
        setError(null);
      },
      (err) => {
        let errorMessage = 'Error accessing location';
        
        // Handle specific error codes
        switch(err.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Permission to access location was denied';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location information is unavailable';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Location request timed out';
            break;
        }
        
        setError(errorMessage);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    setWatchId(id);
  };

  // Stop tracking user location
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    setFollowUser(false);
  };

  // Toggle follow mode
  const toggleFollowUser = () => {
    setFollowUser(!followUser);
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <>
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: '20px', 
          right: '20px', 
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Button
          variant="contained"
          color={isTracking ? "error" : "primary"}
          onClick={isTracking ? stopTracking : startTracking}
          startIcon={isTracking ? <LocationOnIcon /> : <MyLocationIcon />}
          sx={{
            backgroundColor: isTracking ? 'var(--neon-red)' : 'var(--neon-primary)',
            boxShadow: isTracking ? '0 0 10px var(--neon-red)' : '0 0 10px var(--neon-primary)',
            '&:hover': {
              backgroundColor: isTracking ? 'var(--neon-red)' : 'var(--neon-primary)',
              opacity: 0.9,
              boxShadow: isTracking ? '0 0 15px var(--neon-red)' : '0 0 15px var(--neon-primary)'
            }
          }}
        >
          {isTracking ? 'Detener Seguimiento' : 'Activar Mi Ubicación'}
        </Button>

        {isTracking && (
          <Tooltip title={followUser ? "Dejar de seguir mi ubicación" : "Seguir mi ubicación"}>
            <Button
              variant="contained"
              color={followUser ? "warning" : "info"}
              onClick={toggleFollowUser}
              startIcon={followUser ? <NearMeDisabledIcon /> : <NearMeIcon />}
              sx={{
                backgroundColor: followUser ? 'var(--neon-orange)' : 'var(--neon-blue)',
                boxShadow: followUser ? '0 0 10px var(--neon-orange)' : '0 0 10px var(--neon-blue)',
                '&:hover': {
                  backgroundColor: followUser ? 'var(--neon-orange)' : 'var(--neon-blue)',
                  opacity: 0.9,
                  boxShadow: followUser ? '0 0 15px var(--neon-orange)' : '0 0 15px var(--neon-blue)'
                }
              }}
            >
              {followUser ? 'Dejar de Seguir' : 'Seguir Mi Ubicación'}
            </Button>
          </Tooltip>
        )}
      </Box>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserLocationTracker;