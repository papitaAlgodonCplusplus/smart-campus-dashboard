// src/pages/Dashboard/ReservationsPage.tsx

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Tab,
  Tabs,
  Paper,
  Button,
  Collapse,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Event as EventIcon,
  Group as GroupIcon,
  CalendarMonth as CalendarIcon,
  List as ListIcon
} from '@mui/icons-material';
import { useDashboard } from '../../components/Dashboard/DashboardContext';
import ReservationForm from '../../components/Dashboard/ReservationForm';
import ReservationsList from '../../components/Dashboard/ReservationsList';
import ReservationsCalendar from '../../components/Dashboard/ReservationsCalendar';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reservations-tabpanel-${index}`}
      aria-labelledby={`reservations-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ReservationsPage: React.FC = () => {
  const { reservations, spaces } = useDashboard();
  const [tabValue, setTabValue] = useState(0);
  const [formExpanded, setFormExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Toggle form expansion
  const toggleFormExpanded = () => {
    setFormExpanded(!formExpanded);
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'calendar' : 'list');
  };

  // Get current date for filtering
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Filter reservations for upcoming tab (today and future)
  const upcomingReservations = reservations.filter(
    (reservation) => isAfter(parseISO(reservation.date), parseISO(today)) || 
                      reservation.date === today
  );
  
  // Filter for recent tab (last 7 days excluding today)
  const recentReservations = reservations.filter(
    (reservation) => 
      isBefore(parseISO(reservation.date), parseISO(today)) && 
      isAfter(parseISO(reservation.date), parseISO(format(addDays(new Date(), -7), 'yyyy-MM-dd')))
  );
  
  // Calculate stats for dashboard
  const totalSpaces = spaces.length;
  const totalReservations = reservations.length;
  const spacesWithReservations = new Set(reservations.map(r => r.spaceId)).size;
  const reservationsToday = reservations.filter(r => r.date === today).length;

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom className="with-glow">
        Reservaciones de Espacios
      </Typography>

      {/* Stats Dashboard */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid container>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: '1px solid var(--neon-primary)',
              boxShadow: '0 0 10px var(--neon-primary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <EventIcon sx={{ fontSize: 40, color: 'var(--neon-primary)', mb: 1 }} />
            <Typography variant="h5" sx={{ color: 'var(--neon-primary)' }}>
              {totalReservations}
            </Typography>
            <Typography variant="body2">Reservaciones Totales</Typography>
          </Paper>
        </Grid>
        
        <Grid container>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: '1px solid var(--neon-blue)',
              boxShadow: '0 0 10px var(--neon-blue)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <GroupIcon sx={{ fontSize: 40, color: 'var(--neon-blue)', mb: 1 }} />
            <Typography variant="h5" sx={{ color: 'var(--neon-blue)' }}>
              {spacesWithReservations} / {totalSpaces}
            </Typography>
            <Typography variant="body2">Espacios Reservados</Typography>
          </Paper>
        </Grid>
        
        <Grid container>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: '1px solid var(--neon-green)',
              boxShadow: '0 0 10px var(--neon-green)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <EventIcon sx={{ fontSize: 40, color: 'var(--neon-green)', mb: 1 }} />
            <Typography variant="h5" sx={{ color: 'var(--neon-green)' }}>
              {upcomingReservations.length}
            </Typography>
            <Typography variant="body2">Reservas Futuras</Typography>
          </Paper>
        </Grid>
        
        <Grid container>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: '1px solid var(--neon-orange)',
              boxShadow: '0 0 10px var(--neon-orange)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <EventIcon sx={{ fontSize: 40, color: 'var(--neon-orange)', mb: 1 }} />
            <Typography variant="h5" sx={{ color: 'var(--neon-orange)' }}>
              {reservationsToday}
            </Typography>
            <Typography variant="body2">Reservas Hoy</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        {/* Toggle View Mode Button */}
        <Button
          variant="outlined"
          startIcon={viewMode === 'list' ? <CalendarIcon /> : <ListIcon />}
          onClick={toggleViewMode}
          sx={{
            borderColor: 'var(--neon-blue)',
            color: 'var(--neon-blue)',
            '&:hover': {
              borderColor: 'var(--neon-blue)',
              color: 'var(--neon-blue)',
              boxShadow: '0 0 10px var(--neon-blue)'
            }
          }}
        >
          {viewMode === 'list' ? 'Ver Calendario' : 'Ver Lista'}
        </Button>

        {/* New Reservation Form Toggle Button */}
        <Button
          variant="contained"
          startIcon={formExpanded ? <ExpandLess /> : <ExpandMore />}
          onClick={toggleFormExpanded}
          sx={{
            backgroundColor: 'var(--neon-primary)',
            color: 'black',
            '&:hover': {
              backgroundColor: 'var(--neon-blue)',
              boxShadow: '0 0 15px var(--neon-blue)',
            },
          }}
        >
          {formExpanded ? 'Ocultar Formulario' : 'Nueva Reserva'}
        </Button>
      </Box>

      {/* Reservation Form */}
      <Collapse in={formExpanded} timeout="auto" unmountOnExit>
        <ReservationForm />
      </Collapse>

      {/* Different views based on viewMode */}
      {viewMode === 'list' ? (
        <>
          {/* List View with Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="reservation tabs"
              sx={{
                '& .MuiTab-root': {
                  color: 'white',
                  '&.Mui-selected': {
                    color: 'var(--neon-primary)',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'var(--neon-primary)',
                },
              }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>Todas</span>
                    <Chip
                      label={reservations.length}
                      size="small"
                      sx={{
                        ml: 1,
                        backgroundColor: 'var(--neon-primary)',
                        color: 'black',
                        height: '20px',
                        minWidth: '20px',
                      }}
                    />
                  </Box>
                } 
                id="reservations-tab-0"
                aria-controls="reservations-tabpanel-0" 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>Próximas</span>
                    <Chip
                      label={upcomingReservations.length}
                      size="small"
                      sx={{
                        ml: 1,
                        backgroundColor: 'var(--neon-green)',
                        color: 'black',
                        height: '20px',
                        minWidth: '20px',
                      }}
                    />
                  </Box>
                }
                id="reservations-tab-1"
                aria-controls="reservations-tabpanel-1" 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>Recientes</span>
                    <Chip
                      label={recentReservations.length}
                      size="small"
                      sx={{
                        ml: 1,
                        backgroundColor: 'var(--neon-blue)',
                        color: 'black',
                        height: '20px',
                        minWidth: '20px',
                      }}
                    />
                  </Box>
                }
                id="reservations-tab-2"
                aria-controls="reservations-tabpanel-2" 
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <ReservationsList />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ReservationsList />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <ReservationsList />
          </TabPanel>
        </>
      ) : (
        /* Calendar View */
        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundColor: 'rgba(5, 5, 25, 0.8)',
            backdropFilter: 'blur(5px)',
            border: '1px solid var(--neon-primary)',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
            borderRadius: '8px',
            mb: 4
          }}
        >
          <ReservationsCalendar />
        </Paper>
      )}
    </Container>
  );
};

export default ReservationsPage;