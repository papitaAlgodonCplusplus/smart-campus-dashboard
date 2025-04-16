import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useDashboard } from './DashboardContext';

// Colors for the pie chart
const COLORS = ['#0f8', '#f08'];

const PieChartWidget: React.FC = () => {
  const { pieData } = useDashboard();
  
  // Calculate total occupancy percentage
  const totalCapacity = pieData[0].value + pieData[1].value;
  const occupancyPercentage = Math.round((pieData[1].value / totalCapacity) * 100);

  return (
    <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', height: '100%', width: '100%' }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Ocupación Total del Campus
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body1">
            {pieData[1].value} de {totalCapacity} espacios ocupados
          </Typography>
          <Typography variant="h6" sx={{ color: 'var(--neon-primary)' }}>
            {occupancyPercentage}%
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
  );
};

export default PieChartWidget;