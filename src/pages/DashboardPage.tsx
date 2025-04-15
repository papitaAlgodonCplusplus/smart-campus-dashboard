import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Chip,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SpaceOccupancy from '../components/Dashboard/SpaceOccupancy';
import { fetchSpaces } from '../services/api';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';


// Interface for space data
interface Space {
  _id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  lastUpdated: Date;
  position?: [number, number]; // Coordinates for map location
}

// Mock data for initial state and charts
const mockSpaceData = [
  { 
    _id: '1', 
    name: 'Biblioteca Carlos Monge Alfaro', 
    building: 'Biblioteca', 
    floor: 1, 
    capacity: 500, 
    currentOccupancy: 237, 
    lastUpdated: new Date(), 
    position: [9.936058, -84.051060] as [number, number] 
  },
  { 
    _id: '2', 
    name: 'Facultad de Educación', 
    building: 'Educación', 
    floor: 1, 
    capacity: 300, 
    currentOccupancy: 142, 
    lastUpdated: new Date(), 
    position: [9.936004, -84.048674] as [number, number] 
  },
  { 
    _id: '3', 
    name: 'Comedor Estudiantil', 
    building: 'Comedor', 
    floor: 1, 
    capacity: 400, 
    currentOccupancy: 318, 
    lastUpdated: new Date(), 
    position: [9.937167, -84.053081] as [number, number] 
  },
  { 
    _id: '4', 
    name: 'Escuela de Estudios Generales', 
    building: 'Estudios Generales', 
    floor: 1, 
    capacity: 600, 
    currentOccupancy: 481, 
    lastUpdated: new Date(), 
    position: [9.936153, -84.050379] as [number, number] 
  },
  { 
    _id: '5', 
    name: 'Edificio de Aulas (Antigua Facultad de Ciencias Sociales)', 
    building: 'Ciencias Sociales', 
    floor: 1, 
    capacity: 800, 
    currentOccupancy: 325, 
    lastUpdated: new Date(), 
    position: [9.936731, -84.050758] as [number, number] 
  },
  { 
    _id: '6', 
    name: 'Facultad de Letras', 
    building: 'Letras', 
    floor: 1, 
    capacity: 350, 
    currentOccupancy: 187, 
    lastUpdated: new Date(), 
    position: [9.938592, -84.052863] as [number, number] 
  },
  { 
    _id: '7', 
    name: 'Facultad de Ingeniería (Edificio antiguo)', 
    building: 'Ingeniería', 
    floor: 1, 
    capacity: 700, 
    currentOccupancy: 492, 
    lastUpdated: new Date(), 
    position: [9.936173, -84.051970] as [number, number] 
  },
  { 
    _id: '8', 
    name: 'Facultad de Ciencias Económicas', 
    building: 'Ciencias Económicas', 
    floor: 1, 
    capacity: 550, 
    currentOccupancy: 320, 
    lastUpdated: new Date(), 
    position: [9.937149, -84.051689] as [number, number] 
  },
  { 
    _id: '9', 
    name: 'Facultad de Derecho', 
    building: 'Derecho', 
    floor: 1, 
    capacity: 450, 
    currentOccupancy: 270, 
    lastUpdated: new Date(), 
    position: [9.936368, -84.053911] as [number, number] 
  },
  { 
    _id: '10', 
    name: 'Biblioteca Luis Demetrio Tinoco', 
    building: 'Biblioteca Tinoco', 
    floor: 1, 
    capacity: 480, 
    currentOccupancy: 230, 
    lastUpdated: new Date(), 
    position: [9.936010, -84.052726] as [number, number] 
  },
  { 
    _id: '11', 
    name: 'Facultad de Medicina', 
    building: 'Medicina', 
    floor: 1, 
    capacity: 700, 
    currentOccupancy: 410, 
    lastUpdated: new Date(), 
    position: [9.938594, -84.050590] as [number, number] 
  },
  { 
    _id: '12', 
    name: 'Escuela de Química', 
    building: 'Química', 
    floor: 1, 
    capacity: 400, 
    currentOccupancy: 220, 
    lastUpdated: new Date(), 
    position: [9.937249, -84.048989] as [number, number] 
  },
  { 
    _id: '13', 
    name: 'Escuela de Física y Matemática', 
    building: 'Física y Matemática', 
    floor: 1, 
    capacity: 350, 
    currentOccupancy: 180, 
    lastUpdated: new Date(), 
    position: [9.936491, -84.051588] as [number, number] 
  },
  { 
    _id: '14', 
    name: 'Facultad de Bellas Artes', 
    building: 'Bellas Artes', 
    floor: 1, 
    capacity: 300, 
    currentOccupancy: 190, 
    lastUpdated: new Date(), 
    position: [9.936598, -84.048422] as [number, number] 
  },
  { 
    _id: '15', 
    name: 'Escuela de Artes Musicales', 
    building: 'Artes Musicales', 
    floor: 1, 
    capacity: 250, 
    currentOccupancy: 135, 
    lastUpdated: new Date(), 
    position: [9.937429, -84.048234] as [number, number] 
  },
  { 
    _id: '16', 
    name: 'Facultad de Farmacia', 
    building: 'Farmacia', 
    floor: 1, 
    capacity: 380, 
    currentOccupancy: 210, 
    lastUpdated: new Date(), 
    position: [9.938940, -84.049794] as [number, number] 
  },
  { 
    _id: '17', 
    name: 'Facultad de Microbiología', 
    building: 'Microbiología', 
    floor: 1, 
    capacity: 320, 
    currentOccupancy: 175, 
    lastUpdated: new Date(), 
    position: [9.938047, -84.049196] as [number, number] 
  },
  { 
    _id: '18', 
    name: 'Biblioteca de Ciencias de la Salud', 
    building: 'Biblioteca Salud', 
    floor: 1, 
    capacity: 180, 
    currentOccupancy: 85, 
    lastUpdated: new Date(), 
    position: [9.938394, -84.051333] as [number, number] 
  },
  { 
    _id: '19', 
    name: 'Escuela de Arquitectura', 
    building: 'Arquitectura', 
    floor: 1, 
    capacity: 250, 
    currentOccupancy: 160, 
    lastUpdated: new Date(), 
    position: [9.934783, -84.052608] as [number, number] 
  },
  { 
    _id: '20', 
    name: 'Edificio Administrativo A', 
    building: 'Administrativo', 
    floor: 1, 
    capacity: 420, 
    currentOccupancy: 280, 
    lastUpdated: new Date(), 
    position: [9.935491, -84.054193] as [number, number] 
  },
  { 
    _id: '21', 
    name: 'Centro de Informática', 
    building: 'Informática', 
    floor: 1, 
    capacity: 150, 
    currentOccupancy: 95, 
    lastUpdated: new Date(), 
    position: [9.937736, -84.052048] as [number, number] 
  },
  { 
    _id: '22', 
    name: 'Escuela de Ciencias de la Computación e Informática', 
    building: 'ECCI', 
    floor: 1, 
    capacity: 280, 
    currentOccupancy: 190, 
    lastUpdated: new Date(), 
    position: [9.937967, -84.051959] as [number, number] 
  },
  { 
    _id: '23', 
    name: 'Escuela de Biología', 
    building: 'Biología', 
    floor: 1, 
    capacity: 300, 
    currentOccupancy: 170, 
    lastUpdated: new Date(), 
    position: [9.937612, -84.049506] as [number, number] 
  },
  { 
    _id: '24', 
    name: 'Oficina de Bienestar y Salud', 
    building: 'Bienestar y Salud', 
    floor: 1, 
    capacity: 120, 
    currentOccupancy: 65, 
    lastUpdated: new Date(), 
    position: [9.935158, -84.052424] as [number, number] 
  },
  { 
    _id: '25', 
    name: 'FEUCR', 
    building: 'Federación de Estudiantes', 
    floor: 1, 
    capacity: 80, 
    currentOccupancy: 35, 
    lastUpdated: new Date(), 
    position: [9.937351, -84.053294] as [number, number] 
  },
  { 
    _id: '26', 
    name: 'Auditorio Abelardo Bonilla', 
    building: 'Auditorio', 
    floor: 1, 
    capacity: 200, 
    currentOccupancy: 0, 
    lastUpdated: new Date(), 
    position: [9.936408, -84.050290] as [number, number] 
  },
  { 
    _id: '27', 
    name: 'Facultad de Ciencias Agroalimentarias', 
    building: 'Agroalimentarias', 
    floor: 1, 
    capacity: 350, 
    currentOccupancy: 210, 
    lastUpdated: new Date(), 
    position: [9.939027, -84.048140] as [number, number] 
  },
  { 
    _id: '28', 
    name: 'Instituto Confucio', 
    building: 'Confucio', 
    floor: 1, 
    capacity: 120, 
    currentOccupancy: 60, 
    lastUpdated: new Date(), 
    position: [9.934765, -84.052973] as [number, number] 
  },
  { 
    _id: '29', 
    name: 'Museo de Insectos', 
    building: 'Museo', 
    floor: 1, 
    capacity: 80, 
    currentOccupancy: 35, 
    lastUpdated: new Date(), 
    position: [9.9375461, -84.0480803] as [number, number] 
  },
  { 
    _id: '30', 
    name: 'Teatro Universitario', 
    building: 'Teatro', 
    floor: 1, 
    capacity: 250, 
    currentOccupancy: 120, 
    lastUpdated: new Date(), 
    position: [9.9351473, -84.0505921] as [number, number] 
  },
  { 
    _id: '31', 
    name: 'Museo Integral de Cultura e Identidad Nacional', 
    building: 'Museo CIICLA', 
    floor: 1, 
    capacity: 100, 
    currentOccupancy: 40, 
    lastUpdated: new Date(), 
    position: [9.9387108, -84.0526236] as [number, number] 
  },
  { 
    _id: '32', 
    name: 'Soda de Generales', 
    building: 'Soda', 
    floor: 1, 
    capacity: 150, 
    currentOccupancy: 90, 
    lastUpdated: new Date(), 
    position: [9.9360374, -84.0504853] as [number, number] 
  },
  { 
    _id: '33', 
    name: 'Soda de Educación', 
    building: 'Soda', 
    floor: 1, 
    capacity: 120, 
    currentOccupancy: 70, 
    lastUpdated: new Date(), 
    position: [9.9362101, -84.048928] as [number, number] 
  },
  { 
    _id: '34', 
    name: 'Soda de Económicas', 
    building: 'Soda', 
    floor: 1, 
    capacity: 130, 
    currentOccupancy: 75, 
    lastUpdated: new Date(), 
    position: [9.9373607, -84.0519182] as [number, number] 
  },
  { 
    _id: '35', 
    name: 'Soda de Agroalimentarias', 
    building: 'Soda', 
    floor: 1, 
    capacity: 100, 
    currentOccupancy: 55, 
    lastUpdated: new Date(), 
    position: [9.9389716, -84.0484428] as [number, number] 
  },
  { 
    _id: '36', 
    name: 'Soda de Farmacia', 
    building: 'Soda', 
    floor: 1, 
    capacity: 80, 
    currentOccupancy: 45, 
    lastUpdated: new Date(), 
    position: [9.938747, -84.0496005] as [number, number] 
  },
  { 
    _id: '37', 
    name: 'Control de Ingreso Ciudad Universitaria', 
    building: 'Control', 
    floor: 1, 
    capacity: 20, 
    currentOccupancy: 10, 
    lastUpdated: new Date(), 
    position: [9.9365233, -84.0532717] as [number, number] 
  },
  { 
    _id: '38', 
    name: 'Centro de Asesoría Estudiantil', 
    building: 'Asesoría', 
    floor: 1, 
    capacity: 60, 
    currentOccupancy: 30, 
    lastUpdated: new Date(), 
    position: [9.9366332, -84.0488604] as [number, number] 
  },
  { 
    _id: '39', 
    name: 'Red Sismológica Nacional', 
    building: 'Red Sismológica', 
    floor: 1, 
    capacity: 40, 
    currentOccupancy: 25, 
    lastUpdated: new Date(), 
    position: [9.9380336, -84.052239] as [number, number] 
  },
  { 
    _id: '40', 
    name: 'CIICLA', 
    building: 'Centro de Investigación', 
    floor: 1, 
    capacity: 70, 
    currentOccupancy: 35, 
    lastUpdated: new Date(), 
    position: [9.9389097, -84.0527094] as [number, number] 
  },
  { 
    _id: '41', 
    name: 'Fuente de Cupido y el Cisne', 
    building: 'Espacio Común', 
    floor: 1, 
    capacity: 0, 
    currentOccupancy: 0, 
    lastUpdated: new Date(), 
    position: [9.9357604, -84.0511821] as [number, number] 
  },
  { 
    _id: '42', 
    name: 'Sección de Correo - UCR', 
    building: 'Servicios', 
    floor: 1, 
    capacity: 30, 
    currentOccupancy: 15, 
    lastUpdated: new Date(), 
    position: [9.9349976, -84.0508776] as [number, number] 
  },
  { 
    _id: '43', 
    name: 'Butterfly Garden', 
    building: 'Jardín', 
    floor: 1, 
    capacity: 40, 
    currentOccupancy: 20, 
    lastUpdated: new Date(), 
    position: [9.9370255, -84.050435] as [number, number] 
  },
  { 
    _id: '44', 
    name: 'Centro de Investigación en Protección de Cultivos', 
    building: 'Investigación', 
    floor: 1, 
    capacity: 50, 
    currentOccupancy: 30, 
    lastUpdated: new Date(), 
    position: [9.9389959, -84.0480981] as [number, number] 
  },
  { 
    _id: '45', 
    name: 'Equipo de Migración a Software Libre', 
    building: 'Software Libre', 
    floor: 1, 
    capacity: 25, 
    currentOccupancy: 15, 
    lastUpdated: new Date(), 
    position: [9.9377169, -84.0523201] as [number, number] 
  },
  { 
    _id: '46', 
    name: 'Monumento a Rodrigo Facio Brenes', 
    building: 'Monumento', 
    floor: 1, 
    capacity: 0, 
    currentOccupancy: 0, 
    lastUpdated: new Date(), 
    position: [9.9357298, -84.050846] as [number, number] 
  },
  { 
    _id: '47', 
    name: 'FEUCR', 
    building: 'Federación de Estudiantes', 
    floor: 2, 
    capacity: 80, 
    currentOccupancy: 40, 
    lastUpdated: new Date(), 
    position: [9.937351, -84.053294] as [number, number] 
  },
  { 
    _id: '48', 
    name: 'Monumento a Carlos Monge Alfaro', 
    building: 'Monumento', 
    floor: 1, 
    capacity: 0, 
    currentOccupancy: 0, 
    lastUpdated: new Date(), 
    position: [9.9356051, -84.0512781] as [number, number] 
  },
  { 
    _id: '49', 
    name: 'Monumento XXV Aniversario de Ingeniería Eléctrica', 
    building: 'Monumento', 
    floor: 1, 
    capacity: 0, 
    currentOccupancy: 0, 
    lastUpdated: new Date(), 
    position: [9.9356424, -84.0521828] as [number, number] 
  },
  { 
    _id: '50', 
    name: 'Soy UCR', 
    building: 'Monumento', 
    floor: 1, 
    capacity: 0, 
    currentOccupancy: 0, 
    lastUpdated: new Date(), 
    position: [9.9358579, -84.0514281] as [number, number] 
  }
];

// Enhanced hourly data with all spaces
const generateHourlyData = (spaces: Space[]) => {
  const hours = ['7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM'];

  return hours.map(hour => {
    // Create base object with hour
    const dataPoint: any = { hour };

    // Generate random but realistic occupancy data for each space
    spaces.forEach(space => {
      // Create a space key that's safe for object properties
      const spaceKey = space.name.toLowerCase().replace(/\s+/g, '_');

      // Generate percentage based on typical patterns
      let basePercentage = 0;
      const hourNum = parseInt(hour.replace('AM', '').replace('PM', ''));

      // Morning hours gradually increase
      if (hour.includes('AM')) {
        basePercentage = hourNum * 8;
      }
      // Peak at noon
      else if (hour === '12PM') {
        basePercentage = 80;
      }
      // Afternoon has higher occupancy with gradual decline
      else {
        basePercentage = 75 - ((hourNum) * 10);
      }

      // Add some randomness for realism
      const percentage = Math.min(100, Math.max(5,
        basePercentage + (Math.random() * 20 - 10)
      ));

      dataPoint[spaceKey] = Math.round(percentage);
    });

    return dataPoint;
  });
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<Space[]>(mockSpaceData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [visibleLines, setVisibleLines] = useState<{ [key: string]: boolean }>({});

  // Define space categories
  const categories = {
    facultades: ["Biblioteca", "Educación", "Estudios Generales", "Ciencias Sociales", "Letras", "Ingeniería", 
                 "Ciencias Económicas", "Derecho", "Biblioteca Tinoco", "Medicina", "Química", "Física y Matemática", 
                 "Bellas Artes", "Artes Musicales", "Farmacia", "Microbiología", "Biblioteca Salud", "Arquitectura", 
                 "ECCI", "Biología", "Agroalimentarias"],
    sodas: ["Comedor", "Soda", "Cafetería"],
    amenidades: ["Administrativo", "Informática", "Bienestar y Salud", "Federación de Estudiantes", "Auditorio", 
                 "Confucio", "Teatro", "Control", "Asesoría", "Red Sismológica", "Centro de Investigación", 
                 "Servicios", "Investigación", "Software Libre"],
    museos: ["Museo", "Jardín", "CIICLA"],
    monumentos: ["Espacio Común", "Monumento"]
  };

  // Function to categorize spaces
  const categorizeSpaces = () => {
    return {
      facultades: spaces.filter(space => categories.facultades.some(cat => space.building.includes(cat))),
      sodas: spaces.filter(space => categories.sodas.some(cat => space.building.includes(cat))),
      amenidades: spaces.filter(space => categories.amenidades.some(cat => space.building.includes(cat))),
      museos: spaces.filter(space => categories.museos.some(cat => space.building.includes(cat))),
      monumentos: spaces.filter(space => categories.monumentos.some(cat => space.building.includes(cat)))
    };
  };

  // Data for pie chart
  const pieData = [
    { name: 'Disponible', value: spaces.reduce((acc, space) => acc + (space.capacity - space.currentOccupancy), 0) },
    { name: 'Ocupado', value: spaces.reduce((acc, space) => acc + space.currentOccupancy, 0) }
  ];

  const COLORS = ['#0f8', '#f08'];

  // Line chart colors for spaces
  const SPACE_COLORS = [
    '#0ff', // cyan
    '#0f8', // green
    '#f0f', // magenta
    '#f80', // orange
    '#08f', // blue
    '#ff0', // yellow
    '#f08', // pink
  ];

  // Initialize hourly data and visible lines
  useEffect(() => {
    if (spaces.length > 0) {
      const hourlyData = generateHourlyData(spaces);
      setHourlyData(hourlyData);

      // Initialize all lines as visible
      const initialVisibleLines: { [key: string]: boolean } = {};
      spaces.forEach(space => {
        const spaceKey = space.name.toLowerCase().replace(/\s+/g, '_');
        initialVisibleLines[spaceKey] = true;
      });
      setVisibleLines(initialVisibleLines);
    }
  }, [spaces]);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic glow effect
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes neon-pulse {
        0% { text-shadow: 0 0 5px rgba(0, 255, 255, 0.8); }
        50% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.4); }
        100% { text-shadow: 0 0 5px rgba(0, 255, 255, 0.8); }
      }
      
      .with-glow {
        animation: neon-pulse 2s infinite;
      }
      
      .recharts-text {
        fill: white !important;
        font-family: 'Rajdhani', sans-serif !important;
      }
      
      .recharts-cartesian-grid-horizontal line,
      .recharts-cartesian-grid-vertical line {
        stroke: rgba(0, 255, 255, 0.2) !important;
      }
      
      .recharts-line-curve {
        filter: drop-shadow(0 0 3px currentColor);
      }
    `;
    document.head.appendChild(style);

    // Add Google Font
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Rajdhani:wght@300;400;500;700&display=swap';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(style);
      document.head.removeChild(link);
    };
  }, []);

  // Fetch real data from API
  useEffect(() => {
    const getSpaces = async () => {
      try {
        setLoading(true);
        const data = await fetchSpaces();
        // If we get data back, use it, otherwise keep using mock data
        if (data && data.length > 0) {
          setSpaces(data);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch spaces', err);
        // setError('No se pudieron cargar los espacios. Por favor, inténtelo de nuevo más tarde.');
      } finally {
        // We'll keep the artificial delay for demo purposes
        // In production, you'd remove this
        setTimeout(() => setLoading(false), 1000);
      }
    };

    getSpaces();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'var(--panel-bg)',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
            color: 'white',
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '14px',
            textAlign: 'center',
            animation: 'neon-pulse 2s infinite',
          }}
        >
          <Typography sx={{ fontWeight: 'bold', color: 'var(--neon-primary)', fontSize: '16px', mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box key={`tooltip-${index}`} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography sx={{ color: entry.color, mr: 2 }}>
                {entry.name.replace(/_/g, ' ')}: {entry.value}%
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Toggle visibility of specific lines
  const toggleLineVisibility = (spaceKey: string) => {
    setVisibleLines(prev => ({
      ...prev,
      [spaceKey]: !prev[spaceKey]
    }));
  };

  // Navigate to map with selected space
  const handleViewInMap = (spaceKey: string) => {
    const space = spaces.find(space => space.name.toLowerCase().replace(/\s+/g, '_') === spaceKey);
    if (space?.position) {
      // Navigate to map page and pass location in URL params
      navigate(`/map?lat=${space.position[0]}&lng=${space.position[1]}&name=${space.name}`);
    }
  };

  // Render a category chart
  const renderCategoryChart = (categoryName: string, categorySpaces: Space[]) => {
    if (categorySpaces.length === 0) return null;
    
    return (
      <Grid container sx={{ mb: 4, width: '100%' }}>
        <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', height: '100%', width: '100%' }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Ocupación por Hora - {categoryName}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={hourlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {categorySpaces.map((space, index) => {
                  const spaceKey = space.name.toLowerCase().replace(/\s+/g, '_');
                  return visibleLines[spaceKey] ? (
                    <Line
                      key={spaceKey}
                      type="monotone"
                      dataKey={spaceKey}
                      name={space.name}
                      stroke={SPACE_COLORS[index % SPACE_COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, onClick: () => handleViewInMap(spaceKey) }}
                    />
                  ) : null;
                })}
              </LineChart>
            </ResponsiveContainer>

            {/* Filter chips for toggling line visibility */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}
            >
              {categorySpaces.map((space, index) => {
                const spaceKey = space.name.toLowerCase().replace(/\s+/g, '_');
                return (
                  <Chip
                    key={spaceKey}
                    label={space.name}
                    onClick={() => toggleLineVisibility(spaceKey)}
                    sx={{
                      color: visibleLines[spaceKey] ? SPACE_COLORS[index % SPACE_COLORS.length] : 'gray',
                      borderColor: visibleLines[spaceKey] ? SPACE_COLORS[index % SPACE_COLORS.length] : 'gray',
                      backgroundColor: visibleLines[spaceKey] ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                      boxShadow: visibleLines[spaceKey] ? `0 0 5px ${SPACE_COLORS[index % SPACE_COLORS.length]}` : 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 255, 0.2)',
                      },
                      mb: 1
                    }}
                    variant="outlined"
                  />
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  // Render space occupancy cards for a category
  const renderCategorySpaces = (categoryName: string, categorySpaces: Space[]) => {
    if (categorySpaces.length === 0) return null;
    
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          {categoryName}
        </Typography>

        <Grid container spacing={2} sx={{ color: 'white' }}>
          {categorySpaces.map((space) => (
            <Grid container key={space._id}>
              <Box sx={{ position: 'relative' }}>
                <SpaceOccupancy
                  name={space.name}
                  currentOccupancy={space.currentOccupancy}
                  maxCapacity={space.capacity}
                  sx={{ color: 'white' }}
                />
                {space.position && (
                  <Button
                    size="small"
                    onClick={() => handleViewInMap(space.name.toLowerCase().replace(/\s+/g, '_'))}
                    sx={{
                      position: 'absolute',
                      right: '-5px',
                      top: '4px',
                      fontSize: '20px',
                    }}
                  >
                    🌎
                  </Button>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Categorize spaces
  const categorizedSpaces = categorizeSpaces();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom className="with-glow">
        Dashboard de Ocupación - Campus UCR
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div className="neon-loading"></div>
        </Box>
      ) : error ? (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        </Box>
      ) : (
        <>
          {/* Overview Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid container>
              <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', height: '100%', width: '100%' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    Ocupación Total del Campus
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      {pieData[1].value} de {pieData[0].value + pieData[1].value} espacios ocupados
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'var(--neon-primary)' }}>
                      {Math.round((pieData[1].value / (pieData[0].value + pieData[1].value)) * 100)}%
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Separate category charts */}
          {renderCategoryChart("Facultades", categorizedSpaces.facultades)}
          {renderCategoryChart("Sodas", categorizedSpaces.sodas)}
          {renderCategoryChart("Amenidades", categorizedSpaces.amenidades)}
          {renderCategoryChart("Museos y Reservas", categorizedSpaces.museos)}
          {renderCategoryChart("Monumentos", categorizedSpaces.monumentos)}

          {/* Separate category space occupancy cards */}
          {renderCategorySpaces("Facultades", categorizedSpaces.facultades)}
          {renderCategorySpaces("Sodas", categorizedSpaces.sodas)}
          {renderCategorySpaces("Amenidades", categorizedSpaces.amenidades)}
          {renderCategorySpaces("Museos y Reservas", categorizedSpaces.museos)}
          {renderCategorySpaces("Monumentos", categorizedSpaces.monumentos)}

          {/* Buildings Stats */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Estadísticas por Edificio
          </Typography>

          <Grid container spacing={2}>
            {Array.from(new Set(spaces.map(space => space.building))).map((building, index) => {
              const buildingSpaces = spaces.filter(space => space.building === building);
              const totalCapacity = buildingSpaces.reduce((acc, space) => acc + space.capacity, 0);
              const totalOccupancy = buildingSpaces.reduce((acc, space) => acc + space.currentOccupancy, 0);
              const percentage = (totalOccupancy / totalCapacity) * 100;

              let color = 'success';
              if (percentage > 80) color = 'error';
              else if (percentage > 50) color = 'warning';

              // Find a position for this building (use first space's position)
              const buildingPosition = buildingSpaces.find(space => space.position)?.position;

              return (
                <Grid container key={index}>
                  <Box sx={{ position: 'relative' }}>
                    <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>
                      <CardContent>
                        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                          {building}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {buildingSpaces.length} espacios monitoreados
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              color={color as "success" | "error" | "warning" | "primary" | "secondary" | "info" | undefined}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">
                              {Math.round(percentage)}%
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
                          {totalOccupancy} de {totalCapacity} ocupados
                        </Typography>
                      </CardContent>
                    </Card>
                    {buildingPosition && (
                      <Button
                        size="small"
                        onClick={() => navigate(`/map?lat=${buildingPosition[0]}&lng=${buildingPosition[1]}&name=${building}`)}
                        sx={{
                          position: 'absolute',
                          left: '5px',
                          bottom: '20px',
                          fontSize: '20px',
                        }}
                      >
                        🌎
                      </Button>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Current Time and Last Updated */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, color: 'text.secondary' }}>
            <Typography variant="body2">
              Última actualización: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </>
      )}
    </Container>
  );
};

export default DashboardPage;