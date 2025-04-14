import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngBounds, Marker as LeafletMarker } from 'leaflet';
import { fetchSpaces } from '../services/api';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Define our campus bounds
const UCR_BOUNDS: LatLngBounds = new LatLngBounds(
  [9.934911705184872, -84.05511421696207],
  [9.946975587811632, -84.04269880939438]
);

const UCR_CENTER: [number, number] = [9.938432434210572, -84.04941327118948];

// Enhanced building data with more information
const UCR_BUILDINGS = [
  {
    id: 1,
    name: "Biblioteca Carlos Monge Alfaro",
    position: [9.937368, -84.050815],
    info: "Biblioteca principal del campus con espacios de estudio",
    capacity: 500,
    currentOccupancy: 237,
    openHours: "7:00 AM - 10:00 PM",
    peakHours: "10:00 AM - 2:00 PM",
    rules: "Silencio en todas las áreas, no consumir alimentos",
    services: ["Préstamo de libros", "Salas de estudio", "Computadoras", "Wi-Fi"]
  },
  {
    id: 2,
    name: "Facultad de Educación",
    position: [9.935941, -84.049742],
    info: "Servicios de apoyo académico y áreas de estudio",
    capacity: 300,
    currentOccupancy: 142,
    openHours: "7:00 AM - 7:00 PM",
    peakHours: "9:00 AM - 12:00 PM",
    rules: "Respeto en las aulas, no utilizar dispositivos durante clases",
    services: ["Servicios estudiantiles", "Laboratorios", "Wi-Fi"]
  },
  {
    id: 3,
    name: "Soda Comedor Estudiantil",
    position: [9.939028, -84.050881],
    info: "Comedor principal para estudiantes",
    capacity: 400,
    currentOccupancy: 318,
    openHours: "6:30 AM - 7:30 PM",
    peakHours: "11:30 AM - 1:30 PM",
    rules: "Depositar bandejas en áreas designadas",
    services: ["Desayunos", "Almuerzos", "Cenas", "Opciones vegetarianas"]
  },
  {
    id: 4,
    name: "Escuela de Estudios Generales",
    position: [9.937889, -84.048725],
    info: "Edificio de estudios generales con aulas",
    capacity: 600,
    currentOccupancy: 481,
    openHours: "7:00 AM - 9:00 PM",
    peakHours: "8:00 AM - 11:00 AM, 1:00 PM - 3:00 PM",
    rules: "Mantener el orden en las aulas",
    services: ["Salas de conferencias", "Wi-Fi", "Asesoría académica"]
  },
  {
    id: 5,
    name: "Facultad de Ciencias Sociales",
    position: [9.941135, -84.048746],
    info: "Facultad de Ciencias Sociales con aulas y oficinas",
    capacity: 800,
    currentOccupancy: 325,
    openHours: "7:00 AM - 8:00 PM",
    peakHours: "9:00 AM - 12:00 PM, 4:00 PM - 6:00 PM",
    rules: "Respetar los espacios de estudio compartidos",
    services: ["Salas de informática", "Auditorio", "Biblioteca especializada"]
  },
  {
    id: 6,
    name: "Soda de la Facultad de Letras",
    position: [9.936529, -84.051534],
    info: "Comedor de la Facultad de Letras",
    capacity: 150,
    currentOccupancy: 87,
    openHours: "7:30 AM - 6:30 PM",
    peakHours: "11:30 AM - 1:00 PM",
    rules: "Mantener limpia la zona de mesas",
    services: ["Comidas rápidas", "Bebidas", "Área de microondas"]
  },
  {
    id: 7,
    name: "Facultad de Ingeniería",
    position: [9.939987, -84.051587],
    info: "Facultad de Ingeniería con laboratorios y talleres",
    capacity: 700,
    currentOccupancy: 492,
    openHours: "6:30 AM - 10:00 PM",
    peakHours: "8:00 AM - 11:00 AM, 2:00 PM - 5:00 PM",
    rules: "Uso de equipo de seguridad en laboratorios",
    services: ["Laboratorios especializados", "Centro de cómputo", "Tutorías"]
  }
];

// Fix Leaflet icon issue
const fixLeafletIcon = () => {
  delete (Icon.Default.prototype as any)._getIconUrl;

  Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  });
};

// Create neon marker icons
const createNeonIcon = (color: string) => {
  return new Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: `neon-marker neon-marker-${color}`
  });
};

const MapPage: React.FC = () => {
  fixLeafletIcon();
  
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .neon-marker {
        filter: drop-shadow(0 0 5px currentColor);
        transition: all 0.3s ease;
      }
      .neon-marker-green { color: #0f8; }
      .neon-marker-orange { color: #f80; }
      .neon-marker-red { color: #f08; }
      
      .neon-marker:hover {
        transform: scale(1.2);
        filter: drop-shadow(0 0 10px currentColor);
      }
      
      .leaflet-marker-icon:hover {
        transform: scale(1.2);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const getOccupancyInfo = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    
    if (percentage < 40) {
      return {
        color: "green",
        status: "Baja",
        class: "occupancy-low",
        icon: createNeonIcon("green")
      };
    }
    
    if (percentage < 70) {
      return {
        color: "orange",
        status: "Media",
        class: "occupancy-medium",
        icon: createNeonIcon("orange")
      };
    }
    
    return {
      color: "red",
      status: "Alta",
      class: "occupancy-high",
      icon: createNeonIcon("red")
    };
  };

  // Custom popup content component
  const CustomPopup = ({ building }: { building: typeof UCR_BUILDINGS[0] }) => {
    const percentage = Math.round((building.currentOccupancy / building.capacity) * 100);
    const occupancyInfo = getOccupancyInfo(building.currentOccupancy, building.capacity);
    
    return (
      <div className="neon-popup">
        <div className="neon-popup-title">{building.name}</div>
        
        <div className="neon-popup-content">
          <div>{building.info}</div>
          
          <div className="neon-popup-section">
            <div className="neon-popup-section-title">Ocupación Actual</div>
            <div className="neon-popup-progress">
              <div 
                className={`neon-popup-progress-bar ${occupancyInfo.class}`} 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: occupancyInfo.color,
                  boxShadow: `0 0 8px ${occupancyInfo.color}`
                }}
              ></div>
            </div>
            <div className="neon-popup-stats">
              <span className={occupancyInfo.class}>
                {building.currentOccupancy}/{building.capacity} ({percentage}%)
              </span>
              <span className={occupancyInfo.class}>
                {occupancyInfo.status}
              </span>
            </div>
          </div>
          
          <div className="neon-popup-section">
            <div className="neon-popup-section-title">Horario</div>
            <div>{building.openHours}</div>
          </div>
          
          <div className="neon-popup-section">
            <div className="neon-popup-section-title">Horas Pico</div>
            <div>{building.peakHours}</div>
          </div>
          
          <div className="neon-popup-section">
            <div className="neon-popup-section-title">Reglas</div>
            <div>{building.rules}</div>
          </div>
          
          <div className="neon-popup-section">
            <div className="neon-popup-section-title">Servicios</div>
            <div>{building.services.join(", ")}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom className="with-glow">
        Mapa del Campus UCR
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <div className="neon-loading"></div>
        </Box>
      ) : (
        <Paper elevation={3} sx={{ height: 600, overflow: 'hidden' }}>
          <MapContainer 
            center={UCR_CENTER} 
            zoom={16} 
            style={{ height: "100%", width: "100%" }}
            bounds={UCR_BOUNDS}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {UCR_BUILDINGS.map((building) => {
              const occupancyInfo = getOccupancyInfo(building.currentOccupancy, building.capacity);
              
              return (
                <Marker 
                  key={building.id} 
                  position={building.position as [number, number]}
                  icon={occupancyInfo.icon}
                  eventHandlers={{
                    click: () => {
                      setSelectedBuilding(building.id);
                    }
                  }}
                >
                  <Popup className="custom-popup">
                    <CustomPopup building={building} />
                  </Popup>
                </Marker>
              );
            })}
            
            <Rectangle 
              bounds={UCR_BOUNDS}
              pathOptions={{ color: '#0ff', weight: 1, fillOpacity: 0.05 }}
            />
          </MapContainer>
        </Paper>
      )}
    </Container>
  );
};

export default MapPage;