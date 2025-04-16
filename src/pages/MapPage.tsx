import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, FormControlLabel, Switch, Button, ButtonGroup } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSpaces } from '../services/api';
import { UCR_BUILDINGS } from '../data/ucrBuildings';
import MapLegend from '../components/Map/Utils/MapLegend';
import Campus3DMap from '../components/Map/Campus3DMap';
import UserLocationTracker from '../components/Map/Utils/UserLocationTracker';
import UserLocationMarker from '../components/Map/Utils/UserLocationMarker';

import './Map.css';
import './UserLocation.css';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Define UCR coordinates (center of campus)
const UCR_CENTER: [number, number] = [9.9377, -84.0500];
const DEFAULT_ZOOM = 17;

// Style for the Leaflet container
const mapContainerStyle = {
  height: '600px',
  width: '100%',
  borderRadius: '8px',
};

const MapController: React.FC = () => {
  const location = useLocation();
  const map = useMap();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');

    if (lat && lng) {
      map.flyTo([parseFloat(lat), parseFloat(lng)], 19, {
        animate: true,
        duration: 1.5
      });
    }
  }, [location.search, map]);

  return null;
};

// Custom marker icons
const createMarkerIcon = (occupancyLevel: string): L.Icon => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${occupancyLevel === 'high' ? 'red' :
        occupancyLevel === 'medium' ? 'orange' : 'green'
      }.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

interface Building {
  id: number;
  name: string;
  position: [number, number];
  info: string;
  capacity: number;
  currentOccupancy: number;
  openHours: string;
  peakHours: string;
  rules: string;
  services: string[];
  height?: number;
  width?: number;
  depth?: number;
}

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>(UCR_BUILDINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  
  // User location state
  const [userLocation, setUserLocation] = useState<{
    position: [number, number];
    accuracy: number;
  } | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [followUser, setFollowUser] = useState<boolean>(false);

  useEffect(() => {
    // Simulate loading delay for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getOccupancyLevel = (building: Building) => {
    const percentage = (building.currentOccupancy / building.capacity) * 100;
    if (percentage >= 70) return 'high';
    if (percentage >= 40) return 'medium';
    return 'low';
  };

  const handleBuildingSelect = (building: Building) => {
    setSelectedBuilding(building);
    // You could also implement additional actions here
  };

  // Handle user location update
  const handleLocationUpdate = (position: GeolocationPosition) => {
    setUserLocation({
      position: [position.coords.latitude, position.coords.longitude],
      accuracy: position.coords.accuracy
    });
  };

  // Custom popup content with neon styling
  const renderCustomPopup = (building: Building) => {
    const occupancyLevel = getOccupancyLevel(building);
    const occupancyPercentage = Math.round((building.currentOccupancy / building.capacity) * 100);

    return (
      <div className="neon-popup">
        <div className="neon-popup-title">{building.name}</div>
        <div className="neon-popup-content">
          <p>{building.info}</p>

          <div className="neon-popup-section">
            <div className="neon-popup-section-title">Ocupación Actual</div>
            <div className="neon-popup-progress">
              <div
                className="neon-popup-progress-bar"
                style={{
                  width: `${occupancyPercentage}%`,
                  backgroundColor: occupancyLevel === 'high' ? 'var(--neon-red)' :
                    occupancyLevel === 'medium' ? 'var(--neon-orange)' :
                      'var(--neon-green)',
                  boxShadow: `0 0 8px ${occupancyLevel === 'high' ? 'var(--neon-red)' :
                      occupancyLevel === 'medium' ? 'var(--neon-orange)' :
                        'var(--neon-green)'
                    }`
                }}
              ></div>
            </div>
            <div className="neon-popup-stats">
              <span className={`occupancy-${occupancyLevel}`}>
                {building.currentOccupancy}/{building.capacity}
              </span>
              <span className={`occupancy-${occupancyLevel}`}>
                {occupancyPercentage}%
              </span>
            </div>
          </div>

          <div className="neon-popup-section">
            <div className="neon-popup-section-title">Horario</div>
            <p>{building.openHours}</p>
            <div className="neon-popup-section-title">Horas Pico</div>
            <p>{building.peakHours}</p>
          </div>

          <Button
            size="small"
            fullWidth
            variant="outlined"
            onClick={() => navigate(`/?building=${building.id}`)}
            sx={{
              mt: 2,
              color: 'var(--neon-primary)',
              borderColor: 'var(--neon-primary)',
              '&:hover': {
                borderColor: 'var(--neon-blue)',
                color: 'var(--neon-blue)',
                boxShadow: '0 0 10px var(--neon-blue)'
              }
            }}
          >
            Ver Estadísticas
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom className="with-glow">
        Mapa del Campus UCR
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <ButtonGroup variant="outlined" sx={{ mr: 2 }}>
            <Button
              onClick={() => setViewMode('2D')}
              sx={{
                color: viewMode === '2D' ? 'var(--neon-primary)' : 'gray',
                borderColor: viewMode === '2D' ? 'var(--neon-primary)' : 'gray',
                boxShadow: viewMode === '2D' ? '0 0 10px var(--neon-primary)' : 'none',
                '&:hover': {
                  borderColor: 'var(--neon-primary)',
                  color: 'var(--neon-primary)'
                }
              }}
            >
              Mapa 2D
            </Button>
            <Button
              onClick={() => setViewMode('3D')}
              sx={{
                color: viewMode === '3D' ? 'var(--neon-primary)' : 'gray',
                borderColor: viewMode === '3D' ? 'var(--neon-primary)' : 'gray',
                boxShadow: viewMode === '3D' ? '0 0 10px var(--neon-primary)' : 'none',
                '&:hover': {
                  borderColor: 'var(--neon-primary)',
                  color: 'var(--neon-primary)'
                }
              }}
            >
              Vista 3D
            </Button>
          </ButtonGroup>
        </Box>

        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={isNightMode}
                onChange={() => setIsNightMode(!isNightMode)}
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
            }
            label={
              <Typography sx={{ color: isNightMode ? 'var(--neon-blue)' : '#f80' }}>
                {isNightMode ? 'Modo Noche' : 'Modo Día'}
              </Typography>
            }
          />
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <div className="neon-loading"></div>
        </Box>
      ) : (
        <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2, position: 'relative' }}>
          {viewMode === '2D' ? (
            <>
              <MapContainer
                center={UCR_CENTER}
                zoom={DEFAULT_ZOOM}
                style={mapContainerStyle}
                zoomControl={false}
                className={isNightMode ? 'dark-mode' : ''}
              >
                <MapController />
                <ZoomControl position="bottomleft" />

                {/* Choose map style based on mode */}
                <TileLayer
                  url={isNightMode
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  }
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Building markers */}
                {buildings.map((building) => {
                  const occupancyLevel = getOccupancyLevel(building);

                  return (
                    <Marker
                      key={building.id}
                      position={building.position}
                      icon={createMarkerIcon(occupancyLevel)}
                      eventHandlers={{
                        click: () => handleBuildingSelect(building),
                      }}
                    >
                      {showLabels && (
                        <Popup className="custom-popup">
                          {renderCustomPopup(building)}
                        </Popup>
                      )}
                    </Marker>
                  );
                })}

                {/* User location marker */}
                {userLocation && (
                  <UserLocationMarker 
                    position={userLocation.position} 
                    accuracy={userLocation.accuracy}
                    followUser={followUser}
                  />
                )}
              </MapContainer>

              {/* User location controls */}
              <UserLocationTracker 
                onLocationUpdate={handleLocationUpdate}
                isTracking={isTracking}
                setIsTracking={setIsTracking}
                followUser={followUser}
                setFollowUser={setFollowUser}
              />

              {/* Add the map legend */}
              <MapLegend isNightMode={isNightMode} />
            </>
          ) : (
            // 3D Map View
            <Box sx={{ height: '600px' }}>
              <Campus3DMap
                buildings={buildings}
                onBuildingSelect={handleBuildingSelect}
                userLocation={userLocation?.position}
                isTracking={isTracking}
                followUser={followUser}
                setFollowUser={setFollowUser}
              />
              
              {/* User location controls for 3D view */}
              <UserLocationTracker 
                onLocationUpdate={handleLocationUpdate}
                isTracking={isTracking}
                setIsTracking={setIsTracking}
                followUser={followUser}
                setFollowUser={setFollowUser}
              />
            </Box>
          )}
        </Paper>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: 'var(--neon-primary)', fontFamily: 'Orbitron, sans-serif' }}>
          {viewMode === '2D' ? 'Mapa interactivo' : 'Vista tridimensional'} de las instalaciones del campus universitario
        </Typography>
      </Box>

      {/* Instructions for 3D view */}
      {viewMode === '3D' && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: 'rgba(5, 5, 25, 0.8)',
            borderRadius: '8px',
            border: '1px solid var(--neon-primary)',
            boxShadow: '0 0 10px var(--neon-primary)',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: 'var(--neon-primary)', mb: 1 }}>
            Controles para la Vista 3D:
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            • <strong>Clic y arrastrar</strong>: Rotar la vista
            <br />
            • <strong>Rueda del mouse</strong>: Acercar/alejar
            <br />
            • <strong>Clic derecho y arrastrar</strong>: Desplazar la vista
            <br />
            • <strong>Clic en un edificio</strong>: Ver información detallada
            <br />
            • <strong>Activar mi ubicación</strong>: Mostrar avatar en el mapa que representa tu posición
            <br />
            • <strong>Seguir mi ubicación</strong>: La cámara seguirá automáticamente tu movimiento
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default MapPage;