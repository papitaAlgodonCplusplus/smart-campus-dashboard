import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, FormControlLabel, Switch, Button, ButtonGroup } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSpaces } from '../services/api';
import MapLegend from '../components/Map/MapLegend';
import Campus3DMap from '../components/Map/Campus3DMap';
import './Map.css';
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

// Enhanced building data with more information
const UCR_BUILDINGS = [
  {
    id: 1,
    name: "Biblioteca Carlos Monge Alfaro",
    position: [9.937368, -84.050815] as [number, number],
    info: "Biblioteca principal del campus con espacios de estudio",
    capacity: 500,
    currentOccupancy: 237,
    openHours: "7:00 AM - 10:00 PM",
    peakHours: "10:00 AM - 2:00 PM",
    rules: "Silencio en todas las áreas, no consumir alimentos",
    services: ["Préstamo de libros", "Salas de estudio", "Computadoras", "Wi-Fi"],
    height: 4.5,
    width: 6,
    depth: 6
  },
  {
    id: 2,
    name: "Facultad de Educación",
    position: [9.935941, -84.049742] as [number, number],
    info: "Servicios de apoyo académico y áreas de estudio",
    capacity: 300,
    currentOccupancy: 142,
    openHours: "7:00 AM - 7:00 PM",
    peakHours: "9:00 AM - 12:00 PM",
    rules: "Respeto en las aulas, no utilizar dispositivos durante clases",
    services: ["Servicios estudiantiles", "Laboratorios", "Wi-Fi"],
    height: 3.5,
    width: 5,
    depth: 4
  },
  {
    id: 3,
    name: "Soda Comedor Estudiantil",
    position: [9.939028, -84.050881] as [number, number],
    info: "Comedor principal para estudiantes",
    capacity: 400,
    currentOccupancy: 318,
    openHours: "6:30 AM - 7:30 PM",
    peakHours: "11:30 AM - 1:30 PM",
    rules: "Depositar bandejas en áreas designadas",
    services: ["Desayunos", "Almuerzos", "Cenas", "Opciones vegetarianas"],
    height: 2.5,
    width: 7,
    depth: 5
  },
  {
    id: 4,
    name: "Escuela de Estudios Generales",
    position: [9.937889, -84.048725] as [number, number],
    info: "Edificio de estudios generales con aulas",
    capacity: 600,
    currentOccupancy: 481,
    openHours: "7:00 AM - 9:00 PM",
    peakHours: "8:00 AM - 11:00 AM, 1:00 PM - 3:00 PM",
    rules: "Mantener el orden en las aulas",
    services: ["Salas de conferencias", "Wi-Fi", "Asesoría académica"],
    height: 5,
    width: 6,
    depth: 6
  },
  {
    id: 5,
    name: "Facultad de Ciencias Sociales",
    position: [9.941135, -84.048746] as [number, number],
    info: "Facultad de Ciencias Sociales con aulas y oficinas",
    capacity: 800,
    currentOccupancy: 325,
    openHours: "7:00 AM - 8:00 PM",
    peakHours: "9:00 AM - 12:00 PM, 4:00 PM - 6:00 PM",
    rules: "Respetar los espacios de estudio compartidos",
    services: ["Salas de informática", "Auditorio", "Biblioteca especializada"],
    height: 6,
    width: 8,
    depth: 6
  },
  {
    id: 6,
    name: "Soda de la Facultad de Letras",
    position: [9.936529, -84.051534] as [number, number],
    info: "Comedor de la Facultad de Letras",
    capacity: 150,
    currentOccupancy: 87,
    openHours: "7:30 AM - 6:30 PM",
    peakHours: "11:30 AM - 1:00 PM",
    rules: "Mantener limpia la zona de mesas",
    services: ["Comidas rápidas", "Bebidas", "Área de microondas"],
    height: 2,
    width: 4,
    depth: 3
  },
  {
    id: 7,
    name: "Facultad de Ingeniería",
    position: [9.939987, -84.051587] as [number, number],
    info: "Facultad de Ingeniería con laboratorios y talleres",
    capacity: 700,
    currentOccupancy: 492,
    openHours: "6:30 AM - 10:00 PM",
    peakHours: "8:00 AM - 11:00 AM, 2:00 PM - 5:00 PM",
    rules: "Uso de equipo de seguridad en laboratorios",
    services: ["Laboratorios especializados", "Centro de cómputo", "Tutorías"],
    height: 5.5,
    width: 7,
    depth: 5
  }
];

// Component to handle URL parameters and move map
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
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${
      occupancyLevel === 'high' ? 'red' : 
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
                  boxShadow: `0 0 8px ${
                    occupancyLevel === 'high' ? 'var(--neon-red)' : 
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
              </MapContainer>
              
              {/* Add the map legend */}
              <MapLegend isNightMode={isNightMode} />
            </>
          ) : (
            // 3D Map View
            <Box sx={{ height: '1000px' }}>
              <Campus3DMap 
                buildings={buildings} 
                onBuildingSelect={handleBuildingSelect}
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
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default MapPage;