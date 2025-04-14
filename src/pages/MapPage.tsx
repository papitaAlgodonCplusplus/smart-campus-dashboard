import React, { useState } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngBounds } from 'leaflet';
import { fetchSpaces } from '../services/api';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const UCR_BOUNDS: LatLngBounds = new LatLngBounds(
  [9.934911705184872, -84.05511421696207],
  [9.946975587811632, -84.04269880939438]
);

const UCR_CENTER: [number, number] = [9.938432434210572, -84.04941327118948];

const UCR_BUILDINGS = [
  {
    id: 1,
    name: "Biblioteca Carlos Monge Alfaro",
    position: [9.937368, -84.050815],
    info: "Biblioteca principal del campus con espacios de estudio",
    capacity: 500,
    currentOccupancy: 237
  },
  {
    id: 2,
    name: "Facultad de Educación",
    position: [9.935941, -84.049742],
    info: "Servicios de apoyo académico y áreas de estudio",
    capacity: 300,
    currentOccupancy: 142
  },
  {
    id: 3,
    name: "Soda Comedor Estudiantil",
    position: [9.939028, -84.050881],
    info: "Comedor principal para estudiantes",
    capacity: 400,
    currentOccupancy: 318
  },
  {
    id: 4,
    name: "Escuela de Estudios Generales",
    position: [9.937889, -84.048725],
    info: "Edificio de estudios generales con aulas",
    capacity: 600,
    currentOccupancy: 481
  },
  {
    id: 5,
    name: "Facultad de Ciencias Sociales",
    position: [9.941135, -84.048746],
    info: "Facultad de Ciencias Sociales con aulas y oficinas",
    capacity: 800,
    currentOccupancy: 325
  },
  {
    id: 6,
    name: "Soda de la Facultad de Letras",
    position: [9.936529, -84.051534],
    info: "Comedor de la Facultad de Letras",
    capacity: 450,
    currentOccupancy: 207
  },
  {
    id: 7,
    name: "Facultad de Ingeniería",
    position: [9.939987, -84.051587],
    info: "Facultad de Ingeniería con laboratorios y talleres",
    capacity: 700,
    currentOccupancy: 492
  }
];

const fixLeafletIcon = () => {
  delete (Icon.Default.prototype as any)._getIconUrl;

  Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  });
};

const MapPage: React.FC = () => {
  fixLeafletIcon();
  
  const getOccupancyColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage < 40) return "green";
    if (percentage < 70) return "orange";
    return "red";
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mapa del Campus UCR
      </Typography>
      
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
          
          {UCR_BUILDINGS.map((building) => (
            <Marker 
              key={building.id} 
              position={building.position as [number, number]}
            >
              <Popup>
                <Box>
                  <Typography variant="h6">{building.name}</Typography>
                  <Typography variant="body2">{building.info}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Ocupación: <span style={{ color: getOccupancyColor(building.currentOccupancy, building.capacity) }}>
                        {building.currentOccupancy}/{building.capacity} 
                        ({Math.round((building.currentOccupancy / building.capacity) * 100)}%)
                      </span>
                    </Typography>
                  </Box>
                </Box>
              </Popup>
            </Marker>
          ))}
          
          <Rectangle 
            bounds={UCR_BOUNDS}
            pathOptions={{ color: 'blue', weight: 1, fillOpacity: 0.05 }}
          />
        </MapContainer>
      </Paper>
    </Container>
  );
};

export default MapPage;
