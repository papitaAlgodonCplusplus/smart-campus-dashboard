import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Fix for Leaflet icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Define UCR coordinates (center of campus)
const UCR_CENTER: [number, number] = [9.9377, -84.0500];
const DEFAULT_ZOOM = 17;

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Interface for Event data
interface EventData {
  id: string;
  title: string;
  description: string;
  location: [number, number];
  locationName: string;
  startDate: Date;
  endDate: Date;
  cost: number;
  category: string;
  isAnonymous: boolean;
  createdBy: string;
  createdAt: Date;
}

// Event Categories
const eventCategories = [
  { value: 'academic', label: 'Académico', icon: <SchoolIcon /> },
  { value: 'cultural', label: 'Cultural', icon: <MusicNoteIcon /> },
  { value: 'sports', label: 'Deportivo', icon: <SportsBasketballIcon /> },
  { value: 'social', label: 'Social', icon: <GroupsIcon /> },
  { value: 'career', label: 'Profesional', icon: <WorkIcon /> },
  { value: 'celebration', label: 'Celebración', icon: <CelebrationIcon /> },
  { value: 'other', label: 'Otro', icon: <PublicIcon /> }
];

// Helper to create marker icons for events
const createEventMarkerIcon = (category: string): L.Icon => {
  const colorMap: Record<string, string> = {
    academic: 'blue',
    cultural: 'violet',
    sports: 'green',
    social: 'orange',
    career: 'yellow',
    celebration: 'red',
    other: 'grey'
  };
  
  const color = colorMap[category] || 'blue';
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Location Picker Component
const LocationPicker: React.FC<{
  onLocationSelect: (position: [number, number], name: string) => void;
  initialPosition?: [number, number];
}> = ({ onLocationSelect, initialPosition }) => {
  const [position, setPosition] = useState<[number, number] | null>(initialPosition || null);
  const [locationName, setLocationName] = useState<string>('');
  
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2">Ubicación Seleccionada</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Nombre de ubicación"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              sx={{ mt: 1 }}
            />
            <Button 
              variant="contained" 
              size="small"
              sx={{ 
                mt: 1,
                backgroundColor: 'var(--neon-primary)',
                '&:hover': {
                  backgroundColor: 'var(--neon-blue)'
                }
              }}
              onClick={() => {
                onLocationSelect(position, locationName);
              }}
            >
              Confirmar
            </Button>
          </Box>
        </Popup>
      </Marker>
    );
  }

  return (
    <Box sx={{ height: 400, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
      <MapContainer
        center={initialPosition || UCR_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
    </Box>
  );
};

// Main EventsPage Component
const EventosPage: React.FC = () => {
  // State variables
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState<EventData[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [viewEvent, setViewEvent] = useState<EventData | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<EventData>>({
    title: '',
    description: '',
    locationName: '',
    cost: 0,
    category: 'academic',
    isAnonymous: false,
    createdBy: 'Usuario Actual' // This would come from auth system
  });
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date(Date.now() + 2 * 60 * 60 * 1000)); // +2 hours
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Load events from localStorage on initial render
  useEffect(() => {
    const savedEvents = localStorage.getItem('campus-eventos');
    if (savedEvents) {
      try {
        // Convert ISO strings back to Date objects
        const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          createdAt: new Date(event.createdAt)
        }));
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Error parsing saved events:', error);
      }
    }
  }, []);
  
  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('campus-eventos', JSON.stringify(events));
  }, [events]);
  
  // Functions for handling tabs
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle location selection
  const handleLocationSelect = (position: [number, number], name: string) => {
    setSelectedLocation(position);
    setNewEvent(prev => ({ ...prev, locationName: name }));
    setSnackbar({
      open: true,
      message: 'Ubicación seleccionada: ' + name,
      severity: 'success'
    });
  };
  
  // Handle form submission
  const handleSubmitEvent = () => {
    if (!newEvent.title || !selectedLocation || !startDate || !endDate) {
      setSnackbar({
        open: true,
        message: 'Por favor complete todos los campos requeridos',
        severity: 'error'
      });
      return;
    }
    
    if (startDate > endDate) {
      setSnackbar({
        open: true,
        message: 'La fecha de inicio debe ser anterior a la fecha de fin',
        severity: 'error'
      });
      return;
    }
    
    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === editingEvent.id 
          ? {
              ...event,
              title: newEvent.title || event.title,
              description: newEvent.description || event.description,
              location: selectedLocation,
              locationName: newEvent.locationName || event.locationName,
              startDate: startDate,
              endDate: endDate,
              cost: newEvent.cost !== undefined ? newEvent.cost : event.cost,
              category: newEvent.category || event.category,
              isAnonymous: newEvent.isAnonymous !== undefined ? newEvent.isAnonymous : event.isAnonymous
            }
          : event
      );
      
      setEvents(updatedEvents);
      
      setSnackbar({
        open: true,
        message: 'Evento actualizado correctamente',
        severity: 'success'
      });
    } else {
      // Create new event
      const eventToAdd: EventData = {
        id: uuidv4(),
        title: newEvent.title || '',
        description: newEvent.description || '',
        location: selectedLocation,
        locationName: newEvent.locationName || '',
        startDate: startDate || new Date(),
        endDate: endDate || new Date(),
        cost: newEvent.cost !== undefined ? newEvent.cost : 0,
        category: newEvent.category || 'academic',
        isAnonymous: newEvent.isAnonymous || false,
        createdBy: newEvent.isAnonymous ? 'Anónimo' : (newEvent.createdBy || 'Usuario'),
        createdAt: new Date()
      };
      
      setEvents(prev => [...prev, eventToAdd]);
      
      setSnackbar({
        open: true,
        message: 'Evento creado correctamente',
        severity: 'success'
      });
    }
    
    // Reset form and close it
    resetForm();
    setFormOpen(false);
    setEditingEvent(null);
  };
  
  // Reset form values
  const resetForm = () => {
    setNewEvent({
      title: '',
      description: '',
      locationName: '',
      cost: 0,
      category: 'academic',
      isAnonymous: false,
      createdBy: 'Usuario Actual'
    });
    setSelectedLocation(null);
    setStartDate(new Date());
    setEndDate(new Date(Date.now() + 2 * 60 * 60 * 1000));
  };
  
  // Edit an event
  const handleEditEvent = (event: EventData) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      locationName: event.locationName,
      cost: event.cost,
      category: event.category,
      isAnonymous: event.isAnonymous,
      createdBy: event.createdBy
    });
    setSelectedLocation(event.location);
    setStartDate(event.startDate);
    setEndDate(event.endDate);
    setFormOpen(true);
  };
  
  // Delete an event
  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    setSnackbar({
      open: true,
      message: 'Evento eliminado correctamente',
      severity: 'success'
    });
    
    // If we were viewing the deleted event, close the view
    if (viewEvent && viewEvent.id === id) {
      setViewEvent(null);
    }
  };
  
  // Get the upcoming events (today or future)
  const upcomingEvents = events.filter(event => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return event.startDate >= today;
  }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  
  // Get past events
  const pastEvents = events.filter(event => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return event.startDate < today;
  }).sort((a, b) => b.startDate.getTime() - a.startDate.getTime()); // Most recent first
  
  // Filter events based on category
  const getFilteredEvents = (eventsList: EventData[]) => {
    if (filterCategory === 'all') return eventsList;
    return eventsList.filter(event => event.category === filterCategory);
  };
  
  // Category icon mapping
  const getCategoryIcon = (category: string) => {
    const foundCategory = eventCategories.find(cat => cat.value === category);
    return foundCategory ? foundCategory.icon : <PublicIcon />;
  };
  
  // Category label mapping
  const getCategoryLabel = (category: string) => {
    const foundCategory = eventCategories.find(cat => cat.value === category);
    return foundCategory ? foundCategory.label : 'Otro';
  };
  
  // Get category color
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      academic: 'var(--neon-blue)',
      cultural: 'var(--neon-secondary)',
      sports: 'var(--neon-green)',
      social: 'var(--neon-orange)',
      career: 'var(--neon-primary)',
      celebration: 'var(--neon-red)',
      other: '#94a3b8'
    };
    
    return colorMap[category] || 'var(--neon-primary)';
  };
  
  // Render event cards
  const renderEventCards = (eventsList: EventData[]) => {
    const filteredEvents = getFilteredEvents(eventsList);
    
    if (filteredEvents.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No hay eventos en esta categoría.
          </Typography>
        </Box>
      );
    }
    
    return (
      <Grid container spacing={2}>
        {filteredEvents.map((event) => (
          <Grid container key={event.id}>
            <Card 
              sx={{ 
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderLeft: `4px solid ${getCategoryColor(event.category)}`,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 4px 10px ${getCategoryColor(event.category)}40`
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="h2" sx={{ color: 'white' }}>
                    {event.title}
                  </Typography>
                  <Chip 
                    icon={getCategoryIcon(event.category)}
                    label={getCategoryLabel(event.category)}
                    size="small"
                    sx={{
                      backgroundColor: `${getCategoryColor(event.category)}20`,
                      color: getCategoryColor(event.category),
                      borderColor: getCategoryColor(event.category),
                      '& .MuiChip-icon': {
                        color: getCategoryColor(event.category)
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: 'small', mr: 1, color: 'var(--neon-primary)' }} />
                  <Typography variant="body2" color="text.secondary">
                    {format(event.startDate, 'dd/MM/yyyy HH:mm')} - {format(event.endDate, 'HH:mm')}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 'small', mr: 1, color: 'var(--neon-orange)' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.locationName}
                  </Typography>
                </Box>
                
                {event.cost > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <AttachMoneyIcon sx={{ fontSize: 'small', mr: 1, color: 'var(--neon-green)' }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.cost.toLocaleString('es-CR')} colones
                    </Typography>
                  </Box>
                )}
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mt: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {event.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <PersonIcon sx={{ fontSize: 'small', mr: 1, color: event.isAnonymous ? 'var(--neon-orange)' : 'var(--neon-blue)' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.isAnonymous ? 'Anónimo' : event.createdBy}
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button 
                  size="small" 
                  onClick={() => setViewEvent(event)}
                  sx={{ color: 'var(--neon-primary)' }}
                >
                  Ver Detalles
                </Button>
                <IconButton 
                  size="small"
                  onClick={() => handleEditEvent(event)}
                  sx={{ color: 'var(--neon-blue)' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small"
                  onClick={() => handleDeleteEvent(event.id)}
                  sx={{ color: 'var(--neon-red)' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom className="with-glow">
        Eventos del Campus
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm(); // Make sure form is reset
            setFormOpen(true);
          }}
          sx={{
            backgroundColor: 'var(--neon-primary)',
            '&:hover': {
              backgroundColor: 'var(--neon-blue)',
            },
          }}
        >
          Nuevo Evento
        </Button>
        
        <FormControl 
          variant="outlined" 
          size="small" 
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'var(--neon-primary)',
              },
              '&:hover fieldset': {
                borderColor: 'var(--neon-primary)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--neon-primary)',
              },
            },
          }}
        >
          <InputLabel id="filter-category-label">Filtrar por Categoría</InputLabel>
          <Select
            labelId="filter-category-label"
            id="filter-category"
            value={filterCategory}
            label="Filtrar por Categoría"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">Todas las categorías</MenuItem>
            {eventCategories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 1 }}>{category.icon}</Box>
                  {category.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          backgroundColor: 'rgba(5, 5, 25, 0.8)',
          backdropFilter: 'blur(5px)',
          border: '1px solid var(--neon-primary)',
          boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
          borderRadius: '8px',
          mb: 4
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
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
                  <span>Próximos Eventos</span>
                  <Chip
                    label={upcomingEvents.length}
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
              id="tab-0"
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <span>Eventos Pasados</span>
                  <Chip
                    label={pastEvents.length}
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
              id="tab-1"
            />
            <Tab 
              label="Mapa de Eventos" 
              id="tab-2"
            />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {/* Upcoming Events Tab */}
          {tabValue === 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--neon-primary)' }}>
                Próximos Eventos
              </Typography>
              {renderEventCards(upcomingEvents)}
            </>
          )}
          
          {/* Past Events Tab */}
          {tabValue === 1 && (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--neon-blue)' }}>
                Eventos Pasados
              </Typography>
              {renderEventCards(pastEvents)}
            </>
          )}
          
          {/* Map View Tab */}
          {tabValue === 2 && (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--neon-primary)' }}>
                Mapa de Eventos
              </Typography>
              
              <Box sx={{ height: 500, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                <MapContainer
                  center={UCR_CENTER}
                  zoom={DEFAULT_ZOOM}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Show all events on map */}
                  {getFilteredEvents([...upcomingEvents, ...pastEvents]).map((event) => (
                    <Marker 
                      key={event.id} 
                      position={event.location}
                      icon={createEventMarkerIcon(event.category)}
                    >
                      <Popup>
                        <Box sx={{ p: 1, minWidth: 200 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {event.title}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: '0.875rem' }}>
                            <CalendarTodayIcon sx={{ fontSize: 'small', mr: 1, color: 'var(--neon-primary)' }} />
                            {format(event.startDate, 'dd/MM/yyyy HH:mm')}
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, fontSize: '0.875rem' }}>
                            <LocationOnIcon sx={{ fontSize: 'small', mr: 1, color: 'var(--neon-orange)' }} />
                            {event.locationName}
                          </Box>
                          
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              size="small"
                              label={getCategoryLabel(event.category)}
                              sx={{
                                backgroundColor: `${getCategoryColor(event.category)}20`,
                                color: getCategoryColor(event.category),
                                borderColor: getCategoryColor(event.category)
                              }}
                            />
                          </Box>
                          
                          <Button 
                            fullWidth
                            size="small" 
                            onClick={() => setViewEvent(event)}
                            sx={{ 
                              mt: 1.5,
                              color: 'var(--neon-primary)',
                              borderColor: 'var(--neon-primary)',
                              '&:hover': {
                                borderColor: 'var(--neon-blue)',
                                color: 'var(--neon-blue)'
                              }
                            }}
                            variant="outlined"
                          >
                            Ver Detalles
                          </Button>
                        </Box>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Box>
              
              <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                Leyenda: Los colores de los marcadores indican diferentes categorías de eventos.
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 1, gap: 1 }}>
                {eventCategories.map((category) => (
                  <Chip
                    key={category.value}
                    icon={category.icon}
                    label={category.label}
                    size="small"
                    sx={{
                      backgroundColor: `${getCategoryColor(category.value)}20`,
                      color: getCategoryColor(category.value),
                      borderColor: getCategoryColor(category.value),
                      '& .MuiChip-icon': {
                        color: getCategoryColor(category.value)
                      }
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Paper>
      
      {/* Event Creation/Edit Dialog */}
      <Dialog 
        open={formOpen} 
        onClose={() => {
          setFormOpen(false);
          setEditingEvent(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(5, 5, 25, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            border: '1px solid var(--neon-primary)',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'var(--neon-primary)' }}>
          {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {/* Event title */}
            <Grid container>
              <TextField
                fullWidth
                label="Título del Evento"
                name="title"
                value={newEvent.title || ''}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--neon-primary)',
                  },
                }}
              />
            </Grid>
            
            {/* Event description */}
            <Grid container>
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={newEvent.description || ''}
                onChange={handleInputChange}
                multiline
                rows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--neon-primary)',
                  },
                }}
              />
            </Grid>
            
            {/* Event category */}
            <Grid container>
              <FormControl 
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--neon-primary)',
                  },
                }}
              >
                <InputLabel id="event-category-label">Categoría</InputLabel>
                <Select
                  labelId="event-category-label"
                  id="event-category"
                  value={newEvent.category || 'academic'}
                  label="Categoría"
                  onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                >
                  {eventCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1 }}>{category.icon}</Box>
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Event dates */}
            <Grid container>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Fecha y Hora de Inicio"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'var(--neon-primary)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--neon-primary)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--neon-primary)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--neon-primary)',
                        },
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid container>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Fecha y Hora de Finalización"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  minDateTime={startDate || undefined}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'var(--neon-primary)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--neon-primary)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--neon-primary)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--neon-primary)',
                        },
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            {/* Event cost */}
            <Grid container>
              <TextField
                fullWidth
                label="Costo (en colones)"
                name="cost"
                type="number"
                value={newEvent.cost || 0}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      ₡
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--neon-primary)',
                  },
                }}
              />
            </Grid>
            
            {/* Anonymous checkbox */}
            <Grid container>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newEvent.isAnonymous || false}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                    sx={{
                      color: 'var(--neon-primary)',
                      '&.Mui-checked': {
                        color: 'var(--neon-primary)',
                      },
                    }}
                  />
                }
                label="Publicar anónimamente"
              />
            </Grid>
            
            {/* Location selector */}
            <Grid container>
              <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--neon-primary)', mt: 1 }}>
                Seleccione la ubicación del evento
              </Typography>
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialPosition={selectedLocation || undefined}
              />
              
              {selectedLocation && (
                <TextField
                  fullWidth
                  label="Nombre de la ubicación"
                  name="locationName"
                  value={newEvent.locationName || ''}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'var(--neon-primary)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'var(--neon-primary)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'var(--neon-primary)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'var(--neon-primary)',
                    },
                  }}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => {
              setFormOpen(false);
              setEditingEvent(null);
            }}
            sx={{ color: 'white' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmitEvent}
            variant="contained"
            sx={{
              backgroundColor: 'var(--neon-primary)',
              '&:hover': {
                backgroundColor: 'var(--neon-blue)',
              },
            }}
          >
            {editingEvent ? 'Actualizar' : 'Crear Evento'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Event Details Dialog */}
      <Dialog
        open={viewEvent !== null}
        onClose={() => setViewEvent(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(5, 5, 25, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            border: '1px solid var(--neon-primary)',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
          }
        }}
      >
        {viewEvent && (
          <>
            <DialogTitle sx={{ 
              color: 'white',
              borderBottom: `2px solid ${getCategoryColor(viewEvent.category)}`,
              pb: 1
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{viewEvent.title}</Typography>
                <Chip 
                  icon={getCategoryIcon(viewEvent.category)}
                  label={getCategoryLabel(viewEvent.category)}
                  size="small"
                  sx={{
                    backgroundColor: `${getCategoryColor(viewEvent.category)}20`,
                    color: getCategoryColor(viewEvent.category),
                    borderColor: getCategoryColor(viewEvent.category),
                    '& .MuiChip-icon': {
                      color: getCategoryColor(viewEvent.category)
                    }
                  }}
                />
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid container>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: 'var(--neon-primary)' }} />
                    <Typography variant="body1">
                      <strong>Fecha:</strong> {format(viewEvent.startDate, 'EEEE, dd MMMM yyyy')}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid container>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon sx={{ color: 'var(--neon-blue)' }} />
                    <Typography variant="body1">
                      <strong>Horario:</strong> {format(viewEvent.startDate, 'HH:mm')} - {format(viewEvent.endDate, 'HH:mm')}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid container>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: 'var(--neon-orange)' }} />
                    <Typography variant="body1">
                      <strong>Ubicación:</strong> {viewEvent.locationName}
                    </Typography>
                  </Box>
                </Grid>
                
                {viewEvent.cost > 0 && (
                  <Grid container>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoneyIcon sx={{ color: 'var(--neon-green)' }} />
                      <Typography variant="body1">
                        <strong>Costo:</strong> ₡{viewEvent.cost.toLocaleString('es-CR')}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                <Grid container>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: viewEvent.isAnonymous ? 'var(--neon-orange)' : 'var(--neon-blue)' }} />
                    <Typography variant="body1">
                      <strong>Creado por:</strong> {viewEvent.isAnonymous ? 'Anónimo' : viewEvent.createdBy}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid container>
                  <Typography variant="h6" sx={{ mt: 1, color: 'var(--neon-primary)' }}>
                    Descripción
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {viewEvent.description}
                  </Typography>
                </Grid>
                
                <Grid container sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: 'var(--neon-primary)' }}>
                    Ubicación en Mapa
                  </Typography>
                  
                  <Box sx={{ height: 300, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                    <MapContainer
                      center={viewEvent.location}
                      zoom={18}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker 
                        position={viewEvent.location}
                        icon={createEventMarkerIcon(viewEvent.category)}
                      >
                        <Popup>
                          <strong>{viewEvent.title}</strong><br />
                          {viewEvent.locationName}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button 
                onClick={() => handleEditEvent(viewEvent)}
                startIcon={<EditIcon />}
                sx={{ color: 'var(--neon-blue)' }}
              >
                Editar
              </Button>
              <Button 
                onClick={() => handleDeleteEvent(viewEvent.id)}
                startIcon={<DeleteIcon />}
                sx={{ color: 'var(--neon-red)' }}
              >
                Eliminar
              </Button>
              <Button 
                onClick={() => setViewEvent(null)}
                variant="contained"
                sx={{
                  backgroundColor: 'var(--neon-primary)',
                  '&:hover': {
                    backgroundColor: 'var(--neon-blue)',
                  },
                }}
              >
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EventosPage;