import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Switch, FormControlLabel } from '@mui/material';
import { fetchSpaces } from '../services/api';
import Campus3DMap from '../components/Map/Campus3DMap';
import 'leaflet/dist/leaflet.css';
import '../components/Map/Campus3DMap.css';

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
    services: ["Préstamo de libros", "Salas de estudio", "Computadoras", "Wi-Fi"],
    height: 4.5,
    width: 6,
    depth: 6
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
    services: ["Servicios estudiantiles", "Laboratorios", "Wi-Fi"],
    height: 3.5,
    width: 5,
    depth: 4
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
    services: ["Desayunos", "Almuerzos", "Cenas", "Opciones vegetarianas"],
    height: 2.5,
    width: 7,
    depth: 5
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
    services: ["Salas de conferencias", "Wi-Fi", "Asesoría académica"],
    height: 5,
    width: 6,
    depth: 6
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
    services: ["Salas de informática", "Auditorio", "Biblioteca especializada"],
    height: 6,
    width: 8,
    depth: 6
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
    services: ["Comidas rápidas", "Bebidas", "Área de microondas"],
    height: 2,
    width: 4,
    depth: 3
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
    services: ["Laboratorios especializados", "Centro de cómputo", "Tutorías"],
    height: 5.5,
    width: 7,
    depth: 5
  }
];

const MapPage: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Simulate loading delay for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBuildingSelect = (building: any) => {
    setSelectedBuilding(building.id);
    // You could also implement additional actions here
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom className="with-glow">
        Mapa 3D del Campus UCR
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <div className="neon-loading"></div>
        </Box>
      ) : (
        <Paper elevation={3} sx={{ height: 600, overflow: 'hidden', position: 'relative' }}>
          {/* 3D Campus Map */}
          <Campus3DMap 
            buildings={UCR_BUILDINGS} 
            onBuildingSelect={handleBuildingSelect}
          />
          
          {/* Instructions overlay */}
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 10, 
              left: 10, 
              backgroundColor: 'rgba(0,0,0,0.7)', 
              padding: '8px', 
              borderRadius: '4px',
              border: '1px solid var(--neon-primary)',
              boxShadow: '0 0 10px var(--neon-primary)',
              maxWidth: '300px',
              backdropFilter: 'blur(5px)'
            }}
          >
            <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem' }}>
              <strong style={{ color: 'var(--neon-primary)' }}>Controles:</strong> Arrastra para rotar, 
              rueda del mouse para zoom, clic derecho para mover, clic en edificios para información
            </Typography>
          </Box>
        </Paper>
      )}
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: 'var(--neon-primary)', fontFamily: 'Orbitron, sans-serif' }}>
          Vista interactiva en 3D del campus universitario
        </Typography>
      </Box>
    </Container>
  );
};

export default MapPage;