import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  Divider,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Event as EventIcon,
  Room as RoomIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  Contacts as ContactsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Interface for TabPanel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Mock recent activities
const mockRecentActivities = [
  {
    id: 1,
    type: 'reservation',
    title: 'Reserva: Sala de Estudio 101',
    date: '2023-04-20T14:30:00Z',
    icon: <EventIcon sx={{ color: 'var(--neon-blue)' }} />
  },
  {
    id: 2,
    type: 'event',
    title: 'Asistencia: Conferencia de IA',
    date: '2023-04-15T16:00:00Z',
    icon: <EventIcon sx={{ color: 'var(--neon-green)' }} />
  },
  {
    id: 3,
    type: 'location',
    title: 'Visita: Biblioteca Carlos Monge',
    date: '2023-04-14T10:15:00Z',
    icon: <RoomIcon sx={{ color: 'var(--neon-orange)' }} />
  },
  {
    id: 4,
    type: 'reservation',
    title: 'Reserva: Laboratorio Química',
    date: '2023-04-10T09:00:00Z',
    icon: <EventIcon sx={{ color: 'var(--neon-blue)' }} />
  }
];

// TabPanel component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

// Profile Page Component
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempProfileData, setTempProfileData] = useState<any>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [notifications, setNotifications] = useState({
    email: true,
    app: true,
    events: true,
    reservations: true
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info'
  });
  const [logoutDialog, setLogoutDialog] = useState(false);
  
  // Set temp profile data when user data is loaded
  useEffect(() => {
    if (user) {
      setTempProfileData({ ...user });
    }
  }, [user]);
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // Cancel edit mode and restore original data
      setTempProfileData({ ...user });
    }
    setEditMode(!editMode);
  };
  
  // Handle profile data change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempProfileData({
      ...tempProfileData,
      [name]: value
    });
  };
  
  // Handle notifications toggle
  const handleNotificationToggle = (type: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type]
    });
  };
  
  // Handle save profile changes
  const handleSaveProfile = () => {
    // Mock API call to save profile
    setLoading(true);
    
    setTimeout(() => {
      // In a real implementation, you would update the user in the auth context here
      setEditMode(false);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Perfil actualizado correctamente',
        severity: 'success'
      });
    }, 1000);
  };
  
  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };
  
  // Submit password change
  const handlePasswordSubmit = () => {
    // Simple validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Las contraseñas no coinciden',
        severity: 'error'
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setSnackbar({
        open: true,
        message: 'La nueva contraseña debe tener al menos 8 caracteres',
        severity: 'error'
      });
      return;
    }
    
    // Mock API call
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSnackbar({
        open: true,
        message: 'Contraseña actualizada correctamente',
        severity: 'success'
      });
    }, 1000);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    // Navigate handled by the auth context
  };
  
  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format recent activity date
  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  // If loading and no user data, show loading indicator
  if (authLoading || !user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: 'var(--dark-bg)'
        }}
      >
        <CircularProgress sx={{ color: 'var(--neon-primary)' }} />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Summary Card */}
        <Grid container>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: '100%',
              backgroundColor: 'rgba(5, 5, 25, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              border: '1px solid var(--neon-primary)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Profile Picture */}
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'var(--neon-primary)',
                    color: 'black',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    border: '3px solid var(--neon-primary)',
                    boxShadow: '0 0 15px var(--neon-primary)',
                    mr: 3
                  }}
                >
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </Avatar>
                
                {/* Profile Info */}
                <Box>
                  {editMode ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Nombre"
                        name="firstName"
                        value={tempProfileData?.firstName || ''}
                        onChange={handleProfileChange}
                        size="small"
                        variant="outlined"
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
                      <TextField
                        label="Apellidos"
                        name="lastName"
                        value={tempProfileData?.lastName || ''}
                        onChange={handleProfileChange}
                        size="small"
                        variant="outlined"
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
                    </Box>
                  ) : (
                    <>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {user.faculty}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Carné: {user.studentId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
              
              {/* Edit/Save Button */}
              {editMode ? (
                <Box>
                  <IconButton 
                    onClick={handleSaveProfile}
                    disabled={loading}
                    sx={{ 
                      color: 'var(--neon-green)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 128, 0.1)',
                      }
                    }}
                  >
                    <SaveIcon />
                  </IconButton>
                  <IconButton 
                    onClick={toggleEditMode}
                    sx={{ 
                      color: 'var(--neon-red)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 0, 128, 0.1)',
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ) : (
                <IconButton 
                  onClick={toggleEditMode}
                  sx={{ 
                    color: 'var(--neon-primary)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
            
            {/* Admin badge if user is admin */}
            {user.role === 'admin' && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'inline-block',
                    backgroundColor: 'var(--neon-blue)',
                    color: 'black',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    boxShadow: '0 0 8px var(--neon-blue)',
                  }}
                >
                  Administrador
                </Typography>
              </Box>
            )}
            
            <Divider sx={{ mt: 3, mb: 2, borderColor: 'rgba(0, 255, 255, 0.2)' }} />
            
            {/* Last Login Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Último acceso: {formatDate(user.lastLogin || '')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Miembro desde: {formatDate(user.createdAt || '')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Tabs Section */}
        <Grid container>
          <Paper
            elevation={6}
            sx={{
              width: '100%',
              backgroundColor: 'rgba(5, 5, 25, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              border: '1px solid var(--neon-primary)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="profile tabs"
                textColor="inherit"
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
                  label="Actividad Reciente" 
                  icon={<EventIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Información Académica" 
                  icon={<SchoolIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Preferencias" 
                  icon={<SettingsIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Seguridad" 
                  icon={<SecurityIcon />} 
                  iconPosition="start"
                />
              </Tabs>
            </Box>
            
            {/* Recent Activity Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" sx={{ mb: 3, color: 'var(--neon-primary)' }}>
                Actividad Reciente
              </Typography>
              
              <List>
                {mockRecentActivities.map((activity) => (
                  <ListItem 
                    key={activity.id}
                    sx={{
                      mb: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 255, 0.05)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      {activity.icon}
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={formatActivityDate(activity.date)}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  sx={{
                    color: 'var(--neon-primary)',
                    borderColor: 'var(--neon-primary)',
                    '&:hover': {
                      borderColor: 'var(--neon-blue)',
                      color: 'var(--neon-blue)',
                      boxShadow: '0 0 10px var(--neon-blue)',
                    },
                  }}
                >
                  Ver Historial Completo
                </Button>
              </Box>
            </TabPanel>
            
            {/* Academic Info Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" sx={{ mb: 3, color: 'var(--neon-primary)' }}>
                Información Académica
              </Typography>
              
              <Grid container spacing={3}>
                <Grid container xs={12} md={6}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 1 }}>
                      Datos Personales
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Nombre:
                      </Typography>
                      <Typography variant="body1">
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Carné Estudiantil:
                      </Typography>
                      <Typography variant="body1">
                        {user.studentId}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Correo Institucional:
                      </Typography>
                      <Typography variant="body1">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid container xs={12} md={6}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 1 }}>
                      Datos Académicos
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Facultad:
                      </Typography>
                      <Typography variant="body1">
                        {user.faculty}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Estado:
                      </Typography>
                      <Typography variant="body1">
                        Activo
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tipo de Usuario:
                      </Typography>
                      <Typography variant="body1">
                        {user.role === 'admin' ? 'Administrador' : 'Estudiante'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3, borderColor: 'rgba(0, 255, 255, 0.2)' }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<ContactsIcon />}
                  sx={{
                    color: 'var(--neon-primary)',
                    borderColor: 'var(--neon-primary)',
                    '&:hover': {
                      borderColor: 'var(--neon-blue)',
                      color: 'var(--neon-blue)',
                      boxShadow: '0 0 10px var(--neon-blue)',
                    },
                  }}
                >
                  Completar Perfil Académico
                </Button>
              </Box>
            </TabPanel>
            
            {/* Preferences Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" sx={{ mb: 3, color: 'var(--neon-primary)' }}>
                Preferencias
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 2 }}>
                  Idioma
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LanguageIcon sx={{ color: 'var(--neon-primary)', mr: 1 }} />
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    Idioma preferido:
                  </Typography>
                  <Box
                    component="select"
                    defaultValue="Español"
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      color: 'white',
                      border: '1px solid var(--neon-primary)',
                      borderRadius: '4px',
                      padding: '8px',
                      '&:focus': {
                        outline: 'none',
                        boxShadow: '0 0 5px var(--neon-primary)',
                      },
                    }}
                  >
                    <option value="Español">Español</option>
                    <option value="English">English</option>
                  </Box>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3, borderColor: 'rgba(0, 255, 255, 0.2)' }} />
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 2 }}>
                  Notificaciones
                </Typography>
                
                <List sx={{ width: '100%' }}>
                  <ListItem
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px',
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      <NotificationsIcon sx={{ color: 'var(--neon-primary)' }} />
                    </ListItemIcon>
                    <ListItemText primary="Notificaciones por correo" />
                    <Button
                      onClick={() => handleNotificationToggle('email')}
                      variant={notifications.email ? 'contained' : 'outlined'}
                      size="small"
                      sx={{
                        backgroundColor: notifications.email ? 'var(--neon-green)' : 'transparent',
                        color: notifications.email ? 'black' : 'var(--neon-green)',
                        borderColor: 'var(--neon-green)',
                        '&:hover': {
                          backgroundColor: notifications.email ? 'var(--neon-green)' : 'rgba(0, 255, 128, 0.1)',
                          opacity: 0.9,
                        },
                      }}
                    >
                      {notifications.email ? 'Activado' : 'Desactivado'}
                    </Button>
                  </ListItem>
                  
                  <ListItem
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px',
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      <NotificationsIcon sx={{ color: 'var(--neon-primary)' }} />
                    </ListItemIcon>
                    <ListItemText primary="Notificaciones en la aplicación" />
                    <Button
                      onClick={() => handleNotificationToggle('app')}
                      variant={notifications.app ? 'contained' : 'outlined'}
                      size="small"
                      sx={{
                        backgroundColor: notifications.app ? 'var(--neon-green)' : 'transparent',
                        color: notifications.app ? 'black' : 'var(--neon-green)',
                        borderColor: 'var(--neon-green)',
                        '&:hover': {
                          backgroundColor: notifications.app ? 'var(--neon-green)' : 'rgba(0, 255, 128, 0.1)',
                          opacity: 0.9,
                        },
                      }}
                    >
                      {notifications.app ? 'Activado' : 'Desactivado'}
                    </Button>
                  </ListItem>
                  
                  <ListItem
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px',
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      <EventIcon sx={{ color: 'var(--neon-primary)' }} />
                    </ListItemIcon>
                    <ListItemText primary="Recordatorios de eventos" />
                    <Button
                      onClick={() => handleNotificationToggle('events')}
                      variant={notifications.events ? 'contained' : 'outlined'}
                      size="small"
                      sx={{
                        backgroundColor: notifications.events ? 'var(--neon-green)' : 'transparent',
                        color: notifications.events ? 'black' : 'var(--neon-green)',
                        borderColor: 'var(--neon-green)',
                        '&:hover': {
                          backgroundColor: notifications.events ? 'var(--neon-green)' : 'rgba(0, 255, 128, 0.1)',
                          opacity: 0.9,
                        },
                      }}
                    >
                      {notifications.events ? 'Activado' : 'Desactivado'}
                    </Button>
                  </ListItem>
                  
                  <ListItem
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px',
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      <RoomIcon sx={{ color: 'var(--neon-primary)' }} />
                    </ListItemIcon>
                    <ListItemText primary="Recordatorios de reservaciones" />
                    <Button
                      onClick={() => handleNotificationToggle('reservations')}
                      variant={notifications.reservations ? 'contained' : 'outlined'}
                      size="small"
                      sx={{
                        backgroundColor: notifications.reservations ? 'var(--neon-green)' : 'transparent',
                        color: notifications.reservations ? 'black' : 'var(--neon-green)',
                        borderColor: 'var(--neon-green)',
                        '&:hover': {
                          backgroundColor: notifications.reservations ? 'var(--neon-green)' : 'rgba(0, 255, 128, 0.1)',
                          opacity: 0.9,
                        },
                      }}
                    >
                      {notifications.reservations ? 'Activado' : 'Desactivado'}
                    </Button>
                  </ListItem>
                </List>
              </Box>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'var(--neon-primary)',
                    color: 'black',
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px var(--neon-primary)',
                    '&:hover': {
                      backgroundColor: 'var(--neon-blue)',
                      boxShadow: '0 0 15px var(--neon-blue)',
                    }
                  }}
                >
                  Guardar Preferencias
                </Button>
              </Box>
            </TabPanel>
            
            {/* Security Tab */}
            <TabPanel value={tabValue} inde