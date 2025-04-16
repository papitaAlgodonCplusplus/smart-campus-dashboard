import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Space, useDashboard } from './DashboardContext';

interface CategoryChartProps {
  categoryName: string;
  spaces: Space[];
}

// Line chart colors
const SPACE_COLORS = [
  '#0ff', // cyan
  '#0f8', // green
  '#f0f', // magenta
  '#f80', // orange
  '#08f', // blue
  '#ff0', // yellow
  '#f08', // pink
];

const CategoryChart: React.FC<CategoryChartProps> = ({ categoryName, spaces }) => {
  const navigate = useNavigate();
  const { hourlyData, visibleLines, toggleLineVisibility } = useDashboard();

  // Custom tooltip component
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

  // Navigate to map with selected space
  const handleViewInMap = (spaceKey: string) => {
    const space = spaces.find(space => space.name.toLowerCase().replace(/\s+/g, '_') === spaceKey);
    if (space?.position) {
      // Navigate to map page and pass location in URL params
      navigate(`/map?lat=${space.position[0]}&lng=${space.position[1]}&name=${space.name}`);
    }
  };

  if (spaces.length === 0) return null;

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
  );
};

export default CategoryChart;