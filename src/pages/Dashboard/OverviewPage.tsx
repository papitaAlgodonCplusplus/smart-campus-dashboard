import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { useDashboard } from '../../components/Dashboard/DashboardContext';
import PieChartWidget from '../../components/Dashboard/PieChartWidget';
import CategoryChart from '../../components/Dashboard/CategoryChart';

const OverviewPage: React.FC = () => {
  const { loading, error, categorizedSpaces } = useDashboard();

  // Calculate total spaces
  const totalSpaces = Object.values(categorizedSpaces).reduce(
    (total, category) => total + category.length, 
    0
  );

  // Calculate total capacity and occupancy
  const totalCapacity = Object.values(categorizedSpaces).reduce(
    (total, category) => total + category.reduce(
      (acc, space) => acc + space.capacity, 0
    ), 
    0
  );

  const totalOccupancy = Object.values(categorizedSpaces).reduce(
    (total, category) => total + category.reduce(
      (acc, space) => acc + space.currentOccupancy, 0
    ), 
    0
  );

  // Calculate category occupancy stats
  const categoryStats = Object.entries(categorizedSpaces).map(([key, spaces]) => {
    const capacity = spaces.reduce((acc, space) => acc + space.capacity, 0);
    const occupancy = spaces.reduce((acc, space) => acc + space.currentOccupancy, 0);
    const percentage = capacity > 0 ? (occupancy / capacity) * 100 : 0;
    
    return {
      name: key,
      capacity,
      occupancy,
      percentage: Math.round(percentage)
    };
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom className="with-glow">
        Resumen del Campus UCR
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
              <PieChartWidget />
            </Grid>
            <Grid container>
              <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Estadísticas Generales
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Total de Espacios: <strong>{totalSpaces}</strong>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Capacidad Total: <strong>{totalCapacity}</strong>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Ocupación Actual: <strong>{totalOccupancy}</strong>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Porcentaje de Ocupación: <strong>{Math.round((totalOccupancy / totalCapacity) * 100)}%</strong>
                  </Typography>
                  
                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    Por Categoría:
                  </Typography>
                  {categoryStats.map(stat => (
                    <Box key={stat.name} sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        color: stat.percentage > 80 
                          ? 'var(--neon-red)' 
                          : stat.percentage > 50 
                            ? 'var(--neon-orange)' 
                            : 'var(--neon-green)'
                      }}>
                        <span>{stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}:</span>
                        <span>{stat.percentage}%</span>
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Featured Category Chart - show the busiest category */}
          {categoryStats.length > 0 && (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Categoría Destacada
              </Typography>
              {(() => {
                // Find the busiest non-empty category
                const busiestCategory = categoryStats
                  .filter(stat => categorizedSpaces[stat.name as keyof typeof categorizedSpaces].length > 0)
                  .sort((a, b) => b.percentage - a.percentage)[0];
                
                if (busiestCategory) {
                  const categoryName = busiestCategory.name.charAt(0).toUpperCase() + busiestCategory.name.slice(1);
                  return (
                    <CategoryChart 
                      categoryName={categoryName} 
                      spaces={categorizedSpaces[busiestCategory.name as keyof typeof categorizedSpaces]}
                    />
                  );
                }
                return null;
              })()}
            </>
          )}

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

export default OverviewPage;