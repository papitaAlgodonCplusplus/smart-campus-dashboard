import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

interface SpaceProps {
  name: string;
  currentOccupancy: number;
  maxCapacity: number;
  sx?: React.CSSProperties;
}

const SpaceOccupancy: React.FC<SpaceProps> = ({ name, currentOccupancy, maxCapacity, sx }) => {
  const occupancyPercentage = (currentOccupancy / maxCapacity) * 100;
  
  return (
    <Card sx={{ minWidth: 275, m: 1 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={occupancyPercentage}
              color={occupancyPercentage > 80 ? "error" : occupancyPercentage > 50 ? "warning" : "success"}
            />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">
              {currentOccupancy}/{maxCapacity}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SpaceOccupancy;