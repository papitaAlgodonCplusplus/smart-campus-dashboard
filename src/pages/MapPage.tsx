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

// Enhanced building data with more accurate coordinates from the GeoData CSV
const UCR_BUILDINGS: Building[] = [
  {
    id: 1,
    name: "Biblioteca Carlos Monge Alfaro",
    position: [9.936058, -84.051060] as [number, number],
    info: "Biblioteca principal del campus con espacios de estudio",
    capacity: 500,
    currentOccupancy: 237,
    openHours: "7:00 AM - 8:55 PM (L-V), 8:00 AM - 6:00 PM (S)",
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
    position: [9.936004, -84.048674] as [number, number],
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
    name: "Comedor Estudiantil",
    position: [9.937167, -84.053081] as [number, number],
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
    position: [9.936153, -84.050379] as [number, number],
    info: "Edificio Enrique Macaya Lahmann, estudios generales con aulas",
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
    name: "Edificio de Aulas (Antigua Facultad de Ciencias Sociales)",
    position: [9.936731, -84.050758] as [number, number],
    info: "Edificio de Aulas con oficinas administrativas",
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
    name: "Facultad de Letras",
    position: [9.938592, -84.052863] as [number, number],
    info: "Facultad de Letras y Humanidades",
    capacity: 350,
    currentOccupancy: 187,
    openHours: "7:30 AM - 6:30 PM",
    peakHours: "9:30 AM - 12:00 PM, 2:00 PM - 4:00 PM",
    rules: "Mantener silencio en las áreas de lectura",
    services: ["Salas de conferencias", "Laboratorio de idiomas", "Cafetería"],
    height: 3.5,
    width: 5,
    depth: 4
  },
  {
    id: 7,
    name: "Facultad de Ingeniería (Edificio antiguo)",
    position: [9.936173, -84.051970] as [number, number],
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
  },
  {
    id: 8,
    name: "Facultad de Ciencias Económicas",
    position: [9.937149, -84.051689] as [number, number],
    info: "Facultad con escuelas de Estadística, Administración, Economía",
    capacity: 550,
    currentOccupancy: 320,
    openHours: "7:00 AM - 8:00 PM",
    peakHours: "8:30 AM - 11:30 AM, 5:00 PM - 7:00 PM",
    rules: "Mantener el orden en las aulas y laboratorios",
    services: ["Laboratorios de computación", "Biblioteca especializada", "Wi-Fi"],
    height: 5,
    width: 7,
    depth: 6
  },
  {
    id: 9,
    name: "Facultad de Derecho",
    position: [9.936368, -84.053911] as [number, number],
    info: "Facultad de Derecho con aulas y biblioteca jurídica",
    capacity: 450,
    currentOccupancy: 270,
    openHours: "7:00 AM - 9:00 PM",
    peakHours: "8:00 AM - 12:00 PM, 5:00 PM - 7:00 PM",
    rules: "Silencio en áreas de estudio, no consumir alimentos en la biblioteca",
    services: ["Biblioteca jurídica", "Salas de juicios", "Consultorio jurídico"],
    height: 6,
    width: 5.9,
    depth: 4.8
  },
  {
    id: 10,
    name: "Biblioteca Luis Demetrio Tinoco",
    position: [9.936010, -84.052726] as [number, number],
    info: "Biblioteca con amplia colección en ciencias sociales",
    capacity: 480,
    currentOccupancy: 230,
    openHours: "7:00 AM - 8:00 PM (L-V), 8:00 AM - 4:00 PM (S)",
    peakHours: "9:00 AM - 2:00 PM",
    rules: "Guardar silencio, no ingresar alimentos",
    services: ["Préstamo de libros", "Bases de datos", "Salas de estudio", "Wi-Fi"],
    height: 5.5,
    width: 3.5,
    depth: 5.5
  },
  {
    id: 11,
    name: "Facultad de Medicina",
    position: [9.938594, -84.050590] as [number, number],
    info: "Facultad de Medicina con aulas y laboratorios",
    capacity: 700,
    currentOccupancy: 410,
    openHours: "6:30 AM - 10:00 PM",
    peakHours: "8:00 AM - 12:00 PM, 1:00 PM - 4:00 PM",
    rules: "Uso de bata en laboratorios, mantener orden y limpieza",
    services: ["Laboratorios de anatomía", "Biblioteca médica", "Salas de simulación"],
    height: 4.5,
    width: 9,
    depth: 4.5
  },
  {
    id: 12,
    name: "Escuela de Química",
    position: [9.937249, -84.048989] as [number, number],
    info: "Escuela con laboratorios especializados en química",
    capacity: 400,
    currentOccupancy: 220,
    openHours: "7:00 AM - 9:00 PM",
    peakHours: "9:00 AM - 12:00 PM, 2:00 PM - 5:00 PM",
    rules: "Uso obligatorio de equipo de seguridad en laboratorios",
    services: ["Laboratorios químicos", "Tutorías", "Biblioteca especializada"],
    height: 3,
    width: 7.5,
    depth: 7.5
  },
  {
    id: 13,
    name: "Escuela de Física y Matemática",
    position: [9.936491, -84.051588] as [number, number],
    info: "Escuela de Física y Matemática con aulas y laboratorios",
    capacity: 350,
    currentOccupancy: 180,
    openHours: "7:30 AM - 8:00 PM",
    peakHours: "8:30 AM - 11:30 AM, 1:30 PM - 4:30 PM",
    rules: "Mantener silencio en pasillos durante clases",
    services: ["Laboratorios de física", "Centro de cálculo", "Tutorías"],
    height: 4,
    width: 2,
    depth: 5.3
  },
  {
    id: 14,
    name: "Facultad de Bellas Artes",
    position: [9.936598, -84.048422] as [number, number],
    info: "Facultad con espacios para artes visuales, música y teatro",
    capacity: 300,
    currentOccupancy: 190,
    openHours: "7:00 AM - 9:00 PM",
    peakHours: "9:00 AM - 12:00 PM, 4:00 PM - 7:00 PM",
    rules: "Cuidar los instrumentos y materiales, limpieza en talleres",
    services: ["Talleres de arte", "Salas de música", "Auditorios"],
    height: 2,
    width: 8.1,
    depth: 6.1
  },
  {
    id: 15,
    name: "Escuela de Artes Musicales",
    position: [9.937429, -84.048234] as [number, number],
    info: "Escuela con aulas especializadas para música",
    capacity: 250,
    currentOccupancy: 135,
    openHours: "7:00 AM - 9:00 PM",
    peakHours: "8:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
    rules: "Respetar horarios de práctica, cuidar instrumentos",
    services: ["Salas de práctica", "Auditorios", "Préstamo de instrumentos"],
    height: 5,
    width: 5.2,
    depth: 5
  },
  {
    id: 16,
    name: "Facultad de Farmacia",
    position: [9.938940, -84.049794] as [number, number],
    info: "Facultad de Farmacia con laboratorios especializados",
    capacity: 380,
    currentOccupancy: 210,
    openHours: "7:00 AM - 8:00 PM",
    peakHours: "9:00 AM - 12:00 PM, 2:00 PM - 5:00 PM",
    rules: "Uso de equipo de protección en laboratorios",
    services: ["Laboratorios farmacéuticos", "Centro de información de medicamentos", "Biblioteca"],
    height: 5,
    width: 6.1,
    depth: 5.1
  },
  {
    id: 17,
    name: "Facultad de Microbiología",
    position: [9.938047, -84.049196] as [number, number],
    info: "Facultad con laboratorios de investigación en microbiología",
    capacity: 320,
    currentOccupancy: 175,
    openHours: "7:00 AM - 8:00 PM",
    peakHours: "8:30 AM - 11:30 AM, 1:30 PM - 4:30 PM",
    rules: "Protocolos de bioseguridad, uso de equipo de protección",
    services: ["Laboratorios microbiológicos", "Centro de investigación", "Biblioteca especializada"],
    height: 3.5,
    width: 8.7,
    depth: 6.1
  },
  {
    id: 18,
    name: "Biblioteca de Ciencias de la Salud",
    position: [9.938394, -84.051333] as [number, number],
    info: "Biblioteca especializada en ciencias médicas y de la salud",
    capacity: 180,
    currentOccupancy: 85,
    openHours: "7:00 AM - 8:00 PM (L-V), 8:00 AM - 5:00 PM (S)",
    peakHours: "9:00 AM - 2:00 PM",
    rules: "Silencio absoluto, no alimentos ni bebidas",
    services: ["Colecciones médicas", "Bases de datos científicas", "Salas de estudio"],
    height: 3,
    width: 3,
    depth: 2.7
  },
  {
    id: 19,
    name: "Escuela de Arquitectura",
    position: [9.934783, -84.052608] as [number, number],
    info: "Escuela con talleres y estudios para arquitectura",
    capacity: 250,
    currentOccupancy: 160,
    openHours: "7:00 AM - 10:00 PM",
    peakHours: "10:00 AM - 8:00 PM",
    rules: "Mantener orden en los talleres, limpieza en mesas de trabajo",
    services: ["Talleres de diseño", "Laboratorio de fabricación digital", "Biblioteca especializada"],
    height: 6,
    width: 4,
    depth: 4.7
  },
  {
    id: 20,
    name: "Edificio Administrativo A",
    position: [9.935491, -84.054193] as [number, number],
    info: "Edificio con oficinas administrativas universitarias",
    capacity: 420,
    currentOccupancy: 280,
    openHours: "8:00 AM - 5:00 PM",
    peakHours: "9:00 AM - 11:30 AM, 1:30 PM - 4:00 PM",
    rules: "Respetar horarios de atención, mantener orden",
    services: ["Oficina de Registro", "Oficina de Becas", "Recursos Humanos", "Administración Financiera"],
    height: 7,
    width: 4.8,
    depth: 5.1
  },
  {
    id: 21,
    name: "Centro de Informática",
    position: [9.937736, -84.052048] as [number, number],
    info: "Centro de tecnologías de información y servicios informáticos",
    capacity: 150,
    currentOccupancy: 95,
    openHours: "7:30 AM - 7:00 PM",
    peakHours: "9:00 AM - 11:00 AM, 2:00 PM - 4:00 PM",
    rules: "Uso responsable de equipos, no consumir alimentos",
    services: ["Soporte técnico", "Desarrollo de sistemas", "Servicios web"],
    height: 2,
    width: 6.4,
    depth: 3.9
  },
  {
    id: 22,
    name: "Escuela de Ciencias de la Computación e Informática",
    position: [9.937967, -84.051959] as [number, number],
    info: "Escuela con laboratorios de computación e investigación",
    capacity: 280,
    currentOccupancy: 190,
    openHours: "7:00 AM - 9:00 PM",
    peakHours: "9:00 AM - 12:00 PM, 5:00 PM - 8:00 PM",
    rules: "Uso exclusivamente académico de equipos",
    services: ["Laboratorios computacionales", "Centro de investigación", "Servicios estudiantiles"],
    height: 3,
    width: 3.1,
    depth: 2.4
  },
  {
    id: 23,
    name: "Escuela de Biología",
    position: [9.937612, -84.049506] as [number, number],
    info: "Escuela con laboratorios biológicos y colecciones",
    capacity: 300,
    currentOccupancy: 170,
    openHours: "7:00 AM - 8:00 PM",
    peakHours: "8:30 AM - 11:30 AM, 1:30 PM - 4:30 PM",
    rules: "Protocolos de bioseguridad, cuidado con especímenes",
    services: ["Laboratorios biológicos", "Museo de zoología", "Herbario", "Invernaderos"],
    height: 3,
    width: 8.3,
    depth: 6.3
  },
  {
    id: 24,
    name: "Oficina de Bienestar y Salud",
    position: [9.935158, -84.052424] as [number, number],
    info: "Centro de atención médica y promoción de la salud",
    capacity: 120,
    currentOccupancy: 65,
    openHours: "7:00 AM - 5:00 PM",
    peakHours: "8:00 AM - 11:00 AM, 1:00 PM - 3:00 PM",
    rules: "Respetar horarios de cita, mantener orden en sala de espera",
    services: ["Atención médica", "Psicología", "Odontología", "Promoción de la salud"],
    height: 2,
    width: 2.3,
    depth: 3.6
  },
  {
    id: 25,
    name: "FEUCR",
    position: [9.937351, -84.053294] as [number, number],
    info: "Federación de Estudiantes de la Universidad de Costa Rica",
    capacity: 80,
    currentOccupancy: 35,
    openHours: "8:00 AM - 6:00 PM",
    peakHours: "10:00 AM - 2:00 PM",
    rules: "Espacio abierto para estudiantes, respeto mutuo",
    services: ["Representación estudiantil", "Asesoría legal", "Actividades culturales"],
    height: 2,
    width: 1.2,
    depth: 2.6
  },
  {
    id: 26,
    name: "Auditorio Abelardo Bonilla",
    position: [9.936408, -84.050290] as [number, number],
    info: "Auditorio para eventos académicos y culturales",
    capacity: 200,
    currentOccupancy: 0,
    openHours: "Según programación de eventos",
    peakHours: "Variable según eventos",
    rules: "No ingresar alimentos, mantener silencio durante presentaciones",
    services: ["Equipo audiovisual", "Acústica especial", "Aire acondicionado"],
    height: 2,
    width: 1.5,
    depth: 1.6
  },
  {
    id: 27,
    name: "Facultad de Ciencias Agroalimentarias",
    position: [9.939027, -84.048140] as [number, number],
    info: "Facultad con programas en agronomía y tecnología de alimentos",
    capacity: 350,
    currentOccupancy: 210,
    openHours: "7:00 AM - 8:00 PM",
    peakHours: "8:00 AM - 12:00 PM, 1:00 PM - 4:00 PM",
    rules: "Cuidar las áreas verdes y cultivos experimentales",
    services: ["Laboratorios agrícolas", "Fincas experimentales", "Talleres"],
    height: 4,
    width: 7.1,
    depth: 8.2
  },
  {
    id: 28,
    name: "Instituto Confucio",
    position: [9.934765, -84.052973] as [number, number],
    info: "Centro para la enseñanza del idioma y cultura chinos",
    capacity: 120,
    currentOccupancy: 60,
    openHours: "8:00 AM - 8:00 PM",
    peakHours: "4:00 PM - 7:00 PM",
    rules: "Respeto a las normas culturales, puntualidad",
    services: ["Cursos de idioma", "Biblioteca", "Actividades culturales"],
    height: 2,
    width: 2,
    depth: 2.9
  },
  {
    id: 29,
    name: "Museo de Insectos",
    position: [9.9375461, -84.0480803] as [number, number],
    info: "Colección entomológica con especímenes de insectos de Costa Rica",
    capacity: 80,
    currentOccupancy: 35,
    openHours: "8:00 AM - 12:00 PM, 1:00 PM - 4:45 PM (L-V)",
    peakHours: "9:00 AM - 11:00 AM",
    rules: "No tocar los especímenes, no usar flash en fotografías",
    services: ["Visitas guiadas", "Colecciones científicas", "Material didáctico"],
    height: 3,
    width: 2.5,
    depth: 2.5
  },
  {
    id: 30,
    name: "Teatro Universitario",
    position: [9.9351473, -84.0505921] as [number, number],
    info: "Espacio para presentaciones artísticas y culturales",
    capacity: 250,
    currentOccupancy: 120,
    openHours: "Variables según programación",
    peakHours: "6:30 PM - 9:00 PM",
    rules: "Silencio durante las presentaciones, no consumir alimentos",
    services: ["Obras de teatro", "Presentaciones culturales", "Talleres"],
    height: 4,
    width: 3.5,
    depth: 4
  },
  {
    id: 31,
    name: "Museo Integral de Cultura e Identidad Nacional",
    position: [9.9387108, -84.0526236] as [number, number],
    info: "Museo operado por el CIICLA con exhibiciones históricas y culturales",
    capacity: 100,
    currentOccupancy: 40,
    openHours: "9:00 AM - 4:00 PM (L-V)",
    peakHours: "10:00 AM - 2:00 PM",
    rules: "No tocar las exhibiciones, mantener silencio en salas",
    services: ["Exposiciones temporales", "Materiales históricos", "Visitas guiadas"],
    height: 3,
    width: 3,
    depth: 3
  },
  {
    id: 32,
    name: "Soda de Generales",
    position: [9.9360374, -84.0504853] as [number, number],
    info: "Cafetería ubicada en Estudios Generales",
    capacity: 150,
    currentOccupancy: 90,
    openHours: "7:00 AM - 7:00 PM (L-V)",
    peakHours: "11:30 AM - 1:30 PM",
    rules: "Depositar bandejas en áreas designadas",
    services: ["Desayunos", "Almuerzos", "Café", "Snacks"],
    height: 2.5,
    width: 2.5,
    depth: 2.5
  },
  {
    id: 33,
    name: "Soda de Educación",
    position: [9.9362101, -84.048928] as [number, number],
    info: "Cafetería ubicada en la Facultad de Educación",
    capacity: 120,
    currentOccupancy: 70,
    openHours: "7:30 AM - 6:30 PM (L-V)",
    peakHours: "11:30 AM - 1:00 PM",
    rules: "Mantener orden y limpieza",
    services: ["Almuerzos", "Café", "Repostería", "Snacks"],
    height: 2,
    width: 2,
    depth: 2
  },
  {
    id: 34,
    name: "Soda de Económicas",
    position: [9.9373607, -84.0519182] as [number, number],
    info: "Cafetería ubicada en la Facultad de Ciencias Económicas",
    capacity: 130,
    currentOccupancy: 75,
    openHours: "7:00 AM - 8:00 PM (L-V)",
    peakHours: "12:00 PM - 2:00 PM",
    rules: "Depositar residuos en los contenedores correspondientes",
    services: ["Almuerzos", "Café", "Comida rápida", "Wi-Fi"],
    height: 2,
    width: 2.5,
    depth: 2.5
  },
  {
    id: 35,
    name: "Soda de Agroalimentarias",
    position: [9.9389716, -84.0484428] as [number, number],
    info: "Cafetería en la Facultad de Ciencias Agroalimentarias",
    capacity: 100,
    currentOccupancy: 55,
    openHours: "7:30 AM - 6:00 PM (L-V)",
    peakHours: "11:30 AM - 1:30 PM",
    rules: "No consumir alimentos fuera de las áreas designadas",
    services: ["Desayunos", "Almuerzos", "Café", "Frutas"],
    height: 2,
    width: 2,
    depth: 2
  },
  {
    id: 36,
    name: "Soda de Farmacia",
    position: [9.938747, -84.0496005] as [number, number],
    info: "Cafetería ubicada en la Facultad de Farmacia",
    capacity: 80,
    currentOccupancy: 45,
    openHours: "8:00 AM - 6:00 PM (L-V)",
    peakHours: "12:00 PM - 1:30 PM",
    rules: "Mantener el orden y la limpieza",
    services: ["Almuerzos", "Café", "Snacks", "Área de mesas"],
    height: 2,
    width: 1.5,
    depth: 1.5
  },
  {
    id: 37,
    name: "Control de Ingreso Ciudad Universitaria",
    position: [9.9365233, -84.0532717] as [number, number],
    info: "Punto principal de control de acceso al campus",
    capacity: 20,
    currentOccupancy: 10,
    openHours: "5:00 AM - 11:00 PM (L-D)",
    peakHours: "7:00 AM - 9:00 AM, 4:00 PM - 6:00 PM",
    rules: "Presentar identificación, registro de visitantes",
    services: ["Seguridad", "Información", "Control de acceso"],
    height: 2.5,
    width: 2.5,
    depth: 2.5
  },
  {
    id: 38,
    name: "Centro de Asesoría Estudiantil",
    position: [9.9366332, -84.0488604] as [number, number],
    info: "Centro de apoyo académico y psicológico para estudiantes",
    capacity: 60,
    currentOccupancy: 30,
    openHours: "8:00 AM - 5:00 PM (L-V)",
    peakHours: "9:00 AM - 12:00 PM, 1:00 PM - 3:00 PM",
    rules: "Solicitar cita previa para atención personalizada",
    services: ["Asesoría académica", "Apoyo psicológico", "Orientación vocacional", "Talleres"],
    height: 2.5,
    width: 2.5,
    depth: 2.5
  },
  {
    id: 39,
    name: "Red Sismológica Nacional",
    position: [9.9380336, -84.052239] as [number, number],
    info: "Centro de monitoreo sismológico y vulcanológico",
    capacity: 40,
    currentOccupancy: 25,
    openHours: "7:00 AM - 4:00 PM (L-V)",
    peakHours: "9:00 AM - 11:00 AM",
    rules: "Visitas programadas solamente, no tocar los equipos",
    services: ["Monitoreo sísmico", "Investigación", "Información sobre amenazas naturales"],
    height: 4,
    width: 3,
    depth: 3
  },
  {
    id: 40,
    name: "CIICLA",
    position: [9.9389097, -84.0527094] as [number, number],
    info: "Centro de Investigación en Identidad y Cultura Latinoamericana",
    capacity: 70,
    currentOccupancy: 35,
    openHours: "8:00 AM - 5:00 PM (L-V)",
    peakHours: "10:00 AM - 3:00 PM",
    rules: "Silencio en áreas de estudio, respetar material bibliográfico",
    services: ["Biblioteca especializada", "Investigación", "Publicaciones", "Seminarios"],
    height: 3,
    width: 3,
    depth: 2.5
  },
  {
    id: 41,
    name: "Fuente de Cupido y el Cisne",
    position: [9.9357604, -84.0511821] as [number, number],
    info: "Fuente ornamental ubicada en el área central del campus",
    capacity: 0,
    currentOccupancy: 0,
    openHours: "24 horas",
    peakHours: "10:00 AM - 3:00 PM",
    rules: "No arrojar monedas ni objetos, no ingresar a la fuente",
    services: ["Punto de encuentro", "Área de descanso"],
    height: 2,
    width: 3,
    depth: 3
  },
  {
    id: 42,
    name: "Sección de Correo - UCR",
    position: [9.9349976, -84.0508776] as [number, number],
    info: "Oficina de servicios postales universitarios",
    capacity: 30,
    currentOccupancy: 15,
    openHours: "8:00 AM - 4:00 PM (L-V)",
    peakHours: "9:00 AM - 11:00 AM",
    rules: "Presentar identificación para retirar correspondencia",
    services: ["Envío de correspondencia", "Casilleros", "Paquetería"],
    height: 2.5,
    width: 2,
    depth: 2
  },
  {
    id: 43,
    name: "Butterfly Garden",
    position: [9.9370255, -84.050435] as [number, number],
    info: "Jardín de mariposas para observación e investigación",
    capacity: 40,
    currentOccupancy: 20,
    openHours: "8:00 AM - 4:00 PM (L-V)",
    peakHours: "9:00 AM - 11:00 AM",
    rules: "No tocar las mariposas, mantener la tranquilidad del espacio",
    services: ["Visitas guiadas", "Observación de especies", "Información educativa"],
    height: 3,
    width: 4,
    depth: 4
  },
  {
    id: 44,
    name: "Centro de Investigación en Protección de Cultivos",
    position: [9.9389959, -84.0480981] as [number, number],
    info: "Centro especializado en investigación agrícola",
    capacity: 50,
    currentOccupancy: 30,
    openHours: "7:30 AM - 4:30 PM (L-V)",
    peakHours: "9:00 AM - 2:00 PM",
    rules: "Acceso restringido a áreas de laboratorio",
    services: ["Investigación en protección vegetal", "Asesoría técnica", "Capacitación"],
    height: 3,
    width: 2.5,
    depth: 2.5
  },
  {
    id: 45,
    name: "Equipo de Migración a Software Libre",
    position: [9.9377169, -84.0523201] as [number, number],
    info: "Oficina dedicada a la implementación de software libre",
    capacity: 25,
    currentOccupancy: 15,
    openHours: "8:00 AM - 5:00 PM (L-V)",
    peakHours: "9:00 AM - 12:00 PM",
    rules: "Solicitar cita para asesorías técnicas",
    services: ["Asesoría en software libre", "Capacitación", "Soporte técnico"],
    height: 2.5,
    width: 2,
    depth: 2
  },
  {
    id: 46,
    name: "Monumento a Rodrigo Facio Brenes",
    position: [9.9357298, -84.050846] as [number, number],
    info: "Monumento al ex rector y reformador universitario",
    capacity: 0,
    currentOccupancy: 0,
    openHours: "24 horas",
    peakHours: "Sin horario específico",
    rules: "Respetar el monumento, no dañar la estructura",
    services: ["Punto de referencia histórico", "Área de descanso"],
    height: 2.5,
    width: 2,
    depth: 2
  },
  {
    id: 47,
    name: "FEUCR",
    position: [9.937351, -84.053294] as [number, number],
    info: "Federación de Estudiantes de la Universidad de Costa Rica",
    capacity: 80,
    currentOccupancy: 40,
    openHours: "8:00 AM - 6:00 PM (L-V)",
    peakHours: "10:00 AM - 3:00 PM",
    rules: "Espacio disponible para todos los estudiantes federados",
    services: ["Representación estudiantil", "Asesoría legal", "Actividades culturales", "Apoyo estudiantil"],
    height: 2.5,
    width: 3,
    depth: 2.5
  },
  {
    id: 48,
    name: "Monumento a Carlos Monge Alfaro",
    position: [9.9356051, -84.0512781] as [number, number],
    info: "Busto en honor al ex rector e historiador",
    capacity: 0,
    currentOccupancy: 0,
    openHours: "24 horas",
    peakHours: "Sin horario específico",
    rules: "Respetar el monumento, no dañar la estructura",
    services: ["Punto de referencia histórico"],
    height: 2,
    width: 1.5,
    depth: 1.5
  },
  {
    id: 49,
    name: "Monumento XXV Aniversario de Ingeniería Eléctrica",
    position: [9.9356424, -84.0521828] as [number, number],
    info: "Monumento conmemorativo del 25 aniversario de la carrera",
    capacity: 0,
    currentOccupancy: 0,
    openHours: "24 horas",
    peakHours: "Sin horario específico",
    rules: "Respetar el monumento, no dañar la estructura",
    services: ["Punto de referencia"],
    height: 2,
    width: 1.5,
    depth: 1.5
  },
  {
    id: 50,
    name: "Soy UCR",
    position: [9.9358579, -84.0514281] as [number, number],
    info: "Escultura icónica de letras metálicas",
    capacity: 0,
    currentOccupancy: 0,
    openHours: "24 horas",
    peakHours: "8:00 AM - 4:00 PM",
    rules: "No dañar la estructura, punto fotográfico",
    services: ["Punto de encuentro", "Área fotográfica"],
    height: 2,
    width: 4,
    depth: 1
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