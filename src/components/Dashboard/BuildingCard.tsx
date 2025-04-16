import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Button
} from '@mui/material';
import { Space } from './DashboardContext';

interface BuildingCardProps {
  building: string;
  spaces: Space[];
}

const BuildingCard: React.FC<BuildingCardProps> = ({ building, spaces }) => {
  const navigate = useNavigate();
  
  // Calculate building statistics
  const totalCapacity = spaces.reduce((acc, space) => acc + space.capacity, 0);
  const totalOccupancy = spaces.reduce((acc, space) => acc + space.currentOccupancy, 0);
  const percentage = (totalOccupancy / totalCapacity) * 100;
  
  // Determine color based on occupancy percentage
  let color = 'success';
  if (percentage > 80) color = 'error';
  else if (percentage > 50) color = 'warning';
  
  // Find a position for this building (use first space's position)
  const buildingPosition = spaces.find(space => space.position)?.position;
  
  // Navigate to map centered on this building
  const handleViewOnMap = () => {
    if (buildingPosition) {
      navigate(`/map?lat=${buildingPosition[0]}&lng=${buildingPosition[1]}&name=${building}`);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', margin: '8px' }}>
      <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            {building}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {spaces.length} espacios monitoreados
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
          onClick={handleViewOnMap}
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
  );
};

export default BuildingCard;