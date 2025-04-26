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
  School as SchoolIcon,
  Language as LanguageIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

// Interface for TabPanel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Interface for activity items
interface Activity {
  id: number;
  type: string;
  title: string;
  date: string;
  icon: React.ReactNode;
}

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
  const { user, token, logout, updateProfile, loading: authLoading } = useAuth();

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
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
      setTempProfileData({ 
        firstName: user.firstName,
        lastName: user.lastName,
        faculty: user.faculty
      });
    }
  }, [user]);

  // Fetch user's recent activities
  useEffect(() => {
    const fetchActivities = async () => {
      if (!token) return;
      
      try {
        // We'll create mock activities for now, but this could be replaced with a real API call
        // For example: const response = await axios.get(`${API_URL}/reservations/user`, { headers: { Authorization: `Bearer ${token}` } });
        
        // Mock activities
        const mockActivities: Activity[] = [
          {
            id: 1,
            type: 'reservation',
            title: 'Reserva: Sala de Estudio 101',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            icon: <EventIcon sx={{ color: 'var(--neon-blue)' }} />
          },
          {
            id: 2,
            type: 'event',
            title: 'Asistencia: Conferencia de IA',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            icon: <EventIcon sx={{ color: 'var(--neon-green)' }} />
          },
          {
            id: 3,
            type: 'login',
            title: 'Inicio de sesión',
            date: user?.lastLogin || new Date().toISOString(),
            icon: <SecurityIcon sx={{ color: 'var(--neon-orange)' }} />
          }
        ];
        
        setActivities(mockActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    
    fetchActivities();
  }, [token, user?.lastLogin]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // Cancel edit mode and restore original data
      setTempProfileData({ 
        firstName: user?.firstName,
        lastName: user?.lastName,
        faculty: user?.faculty
      });
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
  const handleSaveProfile = async () => {
    if (!user || !updateProfile) return;
    
    setLoading(true);

    try {
      const success = await updateProfile(tempProfileData);
      
      if (success) {
        setEditMode(false);
        setSnackbar({
          open: true,
          message: 'Perfil actualizado correctamente',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error al actualizar perfil',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar perfil',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
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
  const handlePasswordSubmit = async () => {
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

    setLoading(true);

    try {
      // Update profile with new password
      if (updateProfile) {
        const success = await updateProfile({ ...tempProfileData, password: passwordData.newPassword });
        
        if (success) {
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
        } else {
          setSnackbar({
            open: true,
            message: 'Error al actualizar contraseña',
            severity: 'error'
          });
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar contraseña',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    // Navigation handled by the auth context
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
                      <TextField
                        label="Facultad"
                        name="faculty"
                        value={tempProfileData?.faculty || ''}
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
                Último acceso: {formatDate(user.lastLogin)}
              </Typography>
              <Button
                color="error"
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={() => setLogoutDialog(true)}
                sx={{
                  color: 'var(--neon-red)',
                  borderColor: 'var(--neon-red)',
                  '&:hover': {
                    borderColor: 'var(--neon-red)',
                    backgroundColor: 'rgba(255, 0, 128, 0.1)',
                    boxShadow: '0 0 8px var(--neon-red)',
                  }
                }}
              >
                Cerrar Sesión
              </Button>
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
                {activities.map((activity) => (
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
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 1 }}>
                  Facultad
                </Typography>
                <Typography variant="body1">{user.faculty}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 1 }}>
                  Carné Estudiantil
                </Typography>
                <Typography variant="body1">{user.studentId}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 1 }}>
                  Correo Institucional
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 1 }}>
                  Miembro desde
                </Typography>
                <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
              </Box>
            </TabPanel>

            {/* Preferences Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" sx={{ mb: 3, color: 'var(--neon-primary)' }}>
                Preferencias
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 2 }}>
                  Notificaciones
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon sx={{ color: 'var(--neon-primary)' }} />
                    </ListItemIcon>
                    <ListItemText primary="Notificaciones por Email" />
                    <Button
                      variant={notifications.email ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleNotificationToggle('email')}
                      sx={{
                        backgroundColor: notifications.email ? 'var(--neon-primary)' : 'transparent',
                        color: notifications.email ? 'black' : 'var(--neon-primary)',
                        borderColor: 'var(--neon-primary)',
                        '&:hover': {
                          backgroundColor: notifications.email ? 'var(--neon-blue)' : 'rgba(0, 255, 255, 0.1)',
                          borderColor: 'var(--neon-primary)',
                        },
                      }}
                    >
                      {notifications.email ? 'Activado' : 'Desactivado'}
                    </Button>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon sx={{ color: 'var(--neon-primary)' }} />
                    </ListItemIcon>
                    <ListItemText primary="Notificaciones en la App" />
                    <Button
                      variant={notifications.app ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleNotificationToggle('app')}
                      sx={{
                        backgroundColor: notifications.app ? 'var(--neon-primary)' : 'transparent',
                        color: notifications.app ? 'black' : 'var(--neon-primary)',
                        borderColor: 'var(--neon-primary)',
                        '&:hover': {
                          backgroundColor: notifications.app ? 'var(--neon-blue)' : 'rgba(0, 255, 255, 0.1)',
                          borderColor: 'var(--neon-primary)',
                        },
                      }}
                    >
                      {notifications.app ? 'Activado' : 'Desactivado'}
                    </Button>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon sx={{ color: 'var(--neon-primary)' }} />
                    </ListItemIcon>
                    <ListItemText primary="Notificaciones de Eventos" />
                    <Button
                      variant={notifications.events ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleNotificationToggle('events')}
                      sx={{
                        backgroundColor: notifications.events ? 'var(--neon-primary)' : 'transparent',
                        color: notifications.events ? 'black' : 'var(--neon-primary)',
                        borderColor: 'var(--neon-primary)',
                        '&:hover': {
                          backgroundColor: notifications.events ? 'var(--neon-blue)' : 'rgba(0, 255, 255, 0.1)',
                          borderColor: 'var(--neon-primary)',
                        },
                      }}
                    >
                      {notifications.events ? 'Activado' : 'Desactivado'}
                    </Button>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon sx={{ color: 'var(--neon-primary)' }} />
                    </ListItemIcon>
                    <ListItemText primary="Notificaciones de Reservaciones" />
                    <Button
                      variant={notifications.reservations ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleNotificationToggle('reservations')}
                      sx={{
                        backgroundColor: notifications.reservations ? 'var(--neon-primary)' : 'transparent',
                        color: notifications.reservations ? 'black' : 'var(--neon-primary)',
                        borderColor: 'var(--neon-primary)',
                        '&:hover': {
                          backgroundColor: notifications.reservations ? 'var(--neon-blue)' : 'rgba(0, 255, 255, 0.1)',
                          borderColor: 'var(--neon-primary)',
                        },
                      }}
                    >
                      {notifications.reservations ? 'Activado' : 'Desactivado'}
                    </Button>
                  </ListItem>
                </List>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 2 }}>
                  Tema de la Interfaz
                </Typography>
                
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'var(--neon-primary)',
                    color: 'black',
                    mr: 2,
                    '&:hover': {
                      backgroundColor: 'var(--neon-blue)',
                      boxShadow: '0 0 10px var(--neon-blue)',
                    },
                  }}
                >
                  Neón (Actual)
                </Button>
                
                <Button
                  variant="outlined"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Clásico
                </Button>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 2 }}>
                  Idioma
                </Typography>
                
                <Button
                  variant="contained"
                  startIcon={<LanguageIcon />}
                  sx={{
                    backgroundColor: 'var(--neon-primary)',
                    color: 'black',
                    mr: 2,
                    '&:hover': {
                      backgroundColor: 'var(--neon-blue)',
                      boxShadow: '0 0 10px var(--neon-blue)',
                    },
                  }}
                >
                  Español (Actual)
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<LanguageIcon />}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  English
                </Button>
              </Box>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" sx={{ mb: 3, color: 'var(--neon-primary)' }}>
                Seguridad
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 2 }}>
                  Cambiar Contraseña
                </Typography>
                
                {showChangePassword ? (
                  <Box component="form" sx={{ maxWidth: 400 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="currentPassword"
                      label="Contraseña Actual"
                      type={showPassword.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('current')}
                              edge="end"
                              sx={{ color: 'var(--neon-primary)' }}
                            >
                              {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
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
                    
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="newPassword"
                      label="Nueva Contraseña"
                      type={showPassword.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('new')}
                              edge="end"
                              sx={{ color: 'var(--neon-primary)' }}
                            >
                              {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
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
                    
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirmar Contraseña"
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('confirm')}
                              edge="end"
                              sx={{ color: 'var(--neon-primary)' }}
                            >
                              {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
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
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handlePasswordSubmit}
                        disabled={loading}
                        sx={{
                          backgroundColor: 'var(--neon-primary)',
                          color: 'black',
                          '&:hover': {
                            backgroundColor: 'var(--neon-blue)',
                            boxShadow: '0 0 10px var(--neon-blue)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 255, 255, 0.3)',
                            color: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowChangePassword(false);
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        sx={{
                          color: 'var(--neon-primary)',
                          borderColor: 'var(--neon-primary)',
                          '&:hover': {
                            borderColor: 'var(--neon-primary)',
                            backgroundColor: 'rgba(0, 255, 255, 0.1)',
                          },
                        }}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => setShowChangePassword(true)}
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
                    Cambiar Contraseña
                  </Button>
                )}
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--neon-blue)', mb: 2 }}>
                  Sesiones Activas
                </Typography>
                
                <List>
                  <ListItem
                    sx={{
                      backgroundColor: 'rgba(0, 255, 255, 0.1)',
                      borderRadius: '4px',
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      <SecurityIcon sx={{ color: 'var(--neon-green)' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Sesión Actual" 
                      secondary="Iniciada el: hoy" 
                    />
                    <Typography variant="body2" color="var(--neon-green)">
                      Activa
                    </Typography>
                  </ListItem>
                </List>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--neon-red)', mb: 2 }}>
                  Zona de Peligro
                </Typography>
                
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setLogoutDialog(true)}
                  sx={{
                    color: 'var(--neon-red)',
                    borderColor: 'var(--neon-red)',
                    '&:hover': {
                      borderColor: 'var(--neon-red)',
                      backgroundColor: 'rgba(255, 0, 128, 0.1)',
                      boxShadow: '0 0 8px var(--neon-red)',
                    },
                  }}
                >
                  Cerrar Sesión en Todos los Dispositivos
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        aria-labelledby="logout-dialog-title"
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(5, 5, 25, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            border: '1px solid var(--neon-primary)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
          }
        }}
      >
        <DialogTitle id="logout-dialog-title" sx={{ color: 'var(--neon-primary)' }}>
          Cerrar Sesión
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'white' }}>
            ¿Estás seguro de que deseas cerrar tu sesión?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setLogoutDialog(false)}
            sx={{ color: 'white' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              backgroundColor: 'var(--neon-red)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'var(--neon-red)',
                opacity: 0.9,
                boxShadow: '0 0 10px var(--neon-red)',
              }
            }}
          >
            Cerrar Sesión
          </Button>
        </DialogActions>
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

export default ProfilePage;