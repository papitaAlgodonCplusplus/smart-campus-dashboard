import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Button,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useDashboard } from './DashboardContext';
import { Reservation } from '../../types/ReservationTypes';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  getDay,
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { es } from 'date-fns/locale';

// Utility function to group reservations by date
const groupReservationsByDate = (reservations: Reservation[]) => {
  const groupedReservations: { [key: string]: Reservation[] } = {};
  
  reservations.forEach(reservation => {
    if (!groupedReservations[reservation.date]) {
      groupedReservations[reservation.date] = [];
    }
    groupedReservations[reservation.date].push(reservation);
  });
  
  return groupedReservations;
};

const ReservationsCalendar: React.FC = () => {
  const { reservations, spaces } = useDashboard();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [groupedReservations, setGroupedReservations] = useState<{ [key: string]: Reservation[] }>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Update grouped reservations when reservations change
  useEffect(() => {
    setGroupedReservations(groupReservationsByDate(reservations));
  }, [reservations]);
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Go to current month and today
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };
  
  // Generate array of days in current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  // Get day of week (0-6) for the first day of the month
  const startDay = getDay(startOfMonth(currentMonth));
  
  // Get the date string in format YYYY-MM-DD for calendar display
  const formatDateForCalendar = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };
  
  // Function to handle date selection
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };
  
  // Get reservations for selected date
  const selectedDateStr = formatDateForCalendar(selectedDate);
  const selectedDateReservations = groupedReservations[selectedDateStr] || [];
  
  // Fill in empty days at start of calendar
  const emptyDaysAtStart = Array(startDay).fill(null);
  
  // Function to get color based on reservation count
  const getReservationColor = (count: number) => {
    if (count === 0) return 'transparent';
    if (count < 3) return 'var(--neon-green)';
    if (count < 6) return 'var(--neon-orange)';
    return 'var(--neon-red)';
  };
  
  // Find space name by ID
  const getSpaceName = (spaceId: string) => {
    const space = spaces.find(s => s._id === spaceId);
    return space ? space.name : 'Unknown Space';
  };

  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: 'var(--neon-primary)' }}>
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={prevMonth}
            sx={{ 
              color: 'var(--neon-primary)',
              border: '1px solid var(--neon-primary)',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          
          <Button 
            onClick={goToToday}
            variant="outlined"
            size="small"
            sx={{ 
              color: 'var(--neon-primary)',
              borderColor: 'var(--neon-primary)',
              '&:hover': {
                borderColor: 'var(--neon-primary)',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
              }
            }}
          >
            Hoy
          </Button>
          
          <IconButton 
            onClick={nextMonth}
            sx={{ 
              color: 'var(--neon-primary)',
              border: '1px solid var(--neon-primary)',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
              }
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Calendar Grid */}
      <Grid container spacing={1} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {/* Day names header */}
        {days.map((day, i) => (
          <Grid container key={i}>
            <Typography 
              align="center" 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'bold', 
                color: i === 0 || i === 6 ? 'var(--neon-red)' : 'white'
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
        
        {/* Empty days at start */}
        {emptyDaysAtStart.map((_, index) => (
          <Grid container key={`empty-${index}`}>
            <Paper 
              sx={{ 
                bgcolor: 'rgba(0, 0, 0, 0.3)', 
                height: isMobile ? 40 : 60,
                borderRadius: 1
              }} 
            />
          </Grid>
        ))}
        
        {/* Calendar days */}
        {daysInMonth.map((day) => {
          const dateStr = formatDateForCalendar(day);
          const reservationsCount = groupedReservations[dateStr]?.length || 0;
          const hasReservations = reservationsCount > 0;
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          
          const reservationColor = getReservationColor(reservationsCount);
          
          return (
            <Grid container key={dateStr}>
              <Paper 
                onClick={() => handleDateClick(day)}
                sx={{ 
                  position: 'relative',
                  height: isMobile ? 40 : 60,
                  bgcolor: hasReservations ? `rgba(${reservationColor === 'var(--neon-green)' ? '0, 255, 128' : 
                                              reservationColor === 'var(--neon-orange)' ? '255, 128, 0' : 
                                              reservationColor === 'var(--neon-red)' ? '255, 0, 128' : 
                                              '0, 0, 0'}, 0.2)` : 'rgba(0, 0, 0, 0.3)', 
                  border: isSelected ? `2px solid ${reservationColor !== 'transparent' ? reservationColor : 'var(--neon-primary)'}` : 
                         isTodayDate ? '1px solid var(--neon-primary)' : '1px solid transparent',
                  boxShadow: isSelected ? `0 0 8px ${reservationColor !== 'transparent' ? reservationColor : 'var(--neon-primary)'}` : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderRadius: 1,
                  '&:hover': {
                    boxShadow: `0 0 5px ${reservationColor !== 'transparent' ? reservationColor : 'var(--neon-primary)'}`
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 1
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: isTodayDate ? 'bold' : 'normal' }}>
                  {format(day, 'd')}
                </Typography>
                
                {hasReservations && (
                  <Box sx={{ 
                    alignSelf: 'flex-end', 
                    bgcolor: 'rgba(0, 0, 0, 0.5)', 
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: reservationColor !== 'transparent' ? reservationColor : 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {reservationsCount}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      
      {/* Selected Day Reservations */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ color: 'var(--neon-primary)', mb: 2 }}>
          Reservas del {format(selectedDate, 'dd MMMM yyyy', { locale: es })}
        </Typography>
        
        {selectedDateReservations.length === 0 ? (
          <Box sx={{ 
            p: 2, 
            textAlign: 'center', 
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 1
          }}>
            <Typography variant="body2" color="text.secondary">
              No hay reservas para este día
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {selectedDateReservations.map((reservation) => (
              <Paper 
                key={reservation.id}
                sx={{
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  borderLeft: '4px solid var(--neon-primary)',
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ color: 'var(--neon-primary)' }}>
                      {getSpaceName(reservation.spaceId)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon fontSize="small" sx={{ color: 'var(--neon-blue)' }} />
                      <Typography variant="body2">
                        {reservation.startTime} - {reservation.endTime}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" sx={{ color: reservation.isAnonymous ? 'var(--neon-orange)' : 'var(--neon-green)' }} />
                      <Typography variant="body2">
                        {reservation.isAnonymous ? 'Reserva anónima' : reservation.userName}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Chip 
                    label={reservation.isAnonymous ? 'Anónimo' : 'Identificado'} 
                    size="small" 
                    sx={{ 
                      bgcolor: reservation.isAnonymous ? 'rgba(255, 128, 0, 0.2)' : 'rgba(0, 255, 128, 0.2)',
                      color: reservation.isAnonymous ? 'var(--neon-orange)' : 'var(--neon-green)',
                      border: `1px solid ${reservation.isAnonymous ? 'var(--neon-orange)' : 'var(--neon-green)'}`,
                    }} 
                  />
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReservationsCalendar;