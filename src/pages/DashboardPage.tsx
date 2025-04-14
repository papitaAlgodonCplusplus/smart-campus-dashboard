import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, LinearProgress, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SpaceOccupancy from '../components/Dashboard/SpaceOccupancy';
import { fetchSpaces } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Interface for space data
interface Space {
  _id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  lastUpdated: Date;
}

// Mock data for initial state and charts
const mockSpaceData = [
  { _id: '1', name: 'Biblioteca Principal', building: 'Biblioteca', floor: 1, capacity: 100, currentOccupancy: 45, lastUpdated: new Date() },
  { _id: '2', name: 'Lab de Computación', building: 'Centro Tecnológico', floor: 2, capacity: 30, currentOccupancy: 12, lastUpdated: new Date() },
  { _id: '3', name: 'Sala de Estudio A', building: 'Centro Estudiantil', floor: 1, capacity: 10, currentOccupancy: 8, lastUpdated: new Date() },
  { _id: '4', name: 'Cafetería', building: 'Comedor', floor: 1, capacity: 150, currentOccupancy: 75, lastUpdated: new Date() },
  { _id: '5', name: 'Auditorio Principal', building: 'Auditorio', floor: 1, capacity: 200, currentOccupancy: 65, lastUpdated: new Date() },
  { _id: '6', name: 'Gimnasio', building: 'Deportes', floor: 1, capacity: 80, currentOccupancy: 30, lastUpdated: new Date() }
];

const hourlyData = [
  { hour: '7AM', biblioteca: 20, laboratorio: 5, cafeteria: 30 },
  { hour: '8AM', biblioteca: 35, laboratorio: 15, cafeteria: 45 },
  { hour: '9AM', biblioteca: 50, laboratorio: 25, cafeteria: 40 },
  { hour: '10AM', biblioteca: 65, laboratorio: 30, cafeteria: 35 },
  { hour: '11AM', biblioteca: 70, laboratorio: 20, cafeteria: 60 },
  { hour: '12PM', biblioteca: 75, laboratorio: 15, cafeteria: 80 },
  { hour: '1PM', biblioteca: 80, laboratorio: 25, cafeteria: 90 },
  { hour: '2PM', biblioteca: 65, laboratorio: 30, cafeteria: 60 },
  { hour: '3PM', biblioteca: 60, laboratorio: 25, cafeteria: 45 },
  { hour: '4PM', biblioteca: 55, laboratorio: 20, cafeteria: 50 },
  { hour: '5PM', biblioteca: 45, laboratorio: 10, cafeteria: 65 },
  { hour: '6PM', biblioteca: 30, laboratorio: 5, cafeteria: 40 },
];

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const [spaces, setSpaces] = useState<Space[]>(mockSpaceData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data for pie chart
  const pieData = [
    { name: 'Disponible', value: spaces.reduce((acc, space) => acc + (space.capacity - space.currentOccupancy), 0) },
    { name: 'Ocupado', value: spaces.reduce((acc, space) => acc + space.currentOccupancy, 0) }
  ];
  
  const COLORS = ['#0f8', '#f08'];
  
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
        setError('No se pudieron cargar los espacios. Por favor, inténtelo de nuevo más tarde.');
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