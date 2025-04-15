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
  { _id: '1', name: 'Biblioteca Principal', building: 'Biblioteca', floor: 1, capacity: 100, currentOccupancy: 45, lastUpdated: new Date(), position: [9.937368, -84.050815] as [number, number] },
  { _id: '2', name: 'Lab de Computo', building: 'Centro Tecnológico', floor: 2, capacity: 30, currentOccupancy: 12, lastUpdated: new Date(), position: [9.939987, -84.051587] as [number, number] },
  { _id: '3', name: 'Sala de Estudio A', building: 'Centro Estudiantil', floor: 1, capacity: 10, currentOccupancy: 8, lastUpdated: new Date(), position: [9.937889, -84.048725] as [number, number] },
  { _id: '4', name: 'Cafetería', building: 'Comedor', floor: 1, capacity: 150, currentOccupancy: 75, lastUpdated: new Date(), position: [9.939028, -84.050881] as [number, number] },
  { _id: '5', name: 'Auditorio Principal', building: 'Auditorio', floor: 1, capacity: 200, currentOccupancy: 65, lastUpdated: new Date(), position: [9.935941, -84.049742] as [number, number] },
  { _id: '6', name: 'Gimnasio', building: 'Deportes', floor: 1, capacity: 80, currentOccupancy: 30, lastUpdated: new Date(), position: [9.941135, -84.048746] as [number, number] }
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
              <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', height: '100%' }}>
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

            <Grid container sx={{ width: '100%' }}>
              <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', height: '100%', width: '100%' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Ocupación por Hora
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
                      {spaces.map((space, index) => {
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
                    {spaces.map((space, index) => {
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
          </Grid>

          {/* Space Occupancy Cards */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Espacios del Campus
          </Typography>

          <Grid container spacing={2} sx={{ color: 'white' }}>
            {spaces.map((space) => (
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
                          left: '13px',
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