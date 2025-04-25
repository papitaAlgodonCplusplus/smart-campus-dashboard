// src/pages/Auth/RegisterPage.tsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Grid,
  Link
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School as SchoolIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  AccountBox as AccountBoxIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Faculty options
const facultyOptions = [
  'Facultad de Ingeniería',
  'Facultad de Ciencias',
  'Facultad de Ciencias Sociales',
  'Facultad de Derecho',
  'Facultad de Educación',
  'Facultad de Medicina',
  'Facultad de Letras',
  'Facultad de Ciencias Económicas',
  'Facultad de Farmacia',
  'Facultad de Odontología',
  'Facultad de Microbiología',
  'Facultad de Bellas Artes',
  'Facultad de Ciencias Agroalimentarias',
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    faculty: '',
    password: '',
    confirmPassword: '',
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    faculty: '',
    password: '',
    confirmPassword: '',
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  
  // Steps definition
  const steps = ['Información Personal', 'Información Académica', 'Credenciales de Acceso'];
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
      
      // Clear error when field is modified
      if (errors[name as keyof typeof errors]) {
        setErrors({
          ...errors,
          [name]: '',
        });
      }
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  
  // Validate step 1
  const validateStep1 = () => {
    const newErrors = { ...errors };
    let isValid = true;
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
      isValid = false;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Validate step 2
  const validateStep2 = () => {
    const newErrors = { ...errors };
    let isValid = true;
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!formData.email.endsWith('@ucr.ac.cr')) {
      newErrors.email = 'Debe utilizar un correo institucional (@ucr.ac.cr)';
      isValid = false;
    }
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'El carné estudiantil es requerido';
      isValid = false;
    } else if (!/^[A-B][0-9]{7}$/.test(formData.studentId)) {
      newErrors.studentId = 'Formato inválido. Debe ser letra (A-B) seguida de 7 dígitos';
      isValid = false;
    }
    
    if (!formData.faculty) {
      newErrors.faculty = 'La facultad es requerida';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Validate step 3
  const validateStep3 = () => {
    const newErrors = { ...errors };
    let isValid = true;
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      isValid = false;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debe confirmar la contraseña';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }
    
    if (!accepted) {
      setSnackbar({
        open: true,
        message: 'Debe aceptar los términos y condiciones',
        severity: 'error',
      });
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle next step
  const handleNext = () => {
    let isValid = false;
    
    switch (activeStep) {
      case 0:
        isValid = validateStep1();
        break;
      case 1:
        isValid = validateStep2();
        break;
      case 2:
        isValid = validateStep3();
        if (isValid) {
          handleSubmit();
          return;
        }
        break;
      default:
        isValid = true;
    }
    
    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    clearError();
    
    try {
      const success = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        studentId: formData.studentId,
        faculty: formData.faculty,
        password: formData.password,
      });
      
      if (success) {
        setSnackbar({
          open: true,
          message: 'Registro exitoso',
          severity: 'success',
        });
        
        // Redirect to login after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: error || 'Error durante el registro',
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error durante el registro. Intente nuevamente.',
        severity: 'error',
      });
    }
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Render current step
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: 'var(--neon-primary)' }}>
              Información Personal
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="Nombre"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'var(--neon-primary)' }} />
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
              id="lastName"
              label="Apellidos"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'var(--neon-primary)' }} />
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
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: 'var(--neon-primary)' }}>
              Información Académica
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Institucional"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'var(--neon-primary)' }} />
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
              id="studentId"
              label="Carné Estudiantil"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              error={!!errors.studentId}
              helperText={errors.studentId || 'Ejemplo: B12345678'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon sx={{ color: 'var(--neon-primary)' }} />
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
            
            <FormControl 
              fullWidth 
              required 
              margin="normal"
              error={!!errors.faculty}
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
              <InputLabel id="faculty-label">Facultad</InputLabel>
              <Select
                labelId="faculty-label"
                id="faculty"
                name="faculty"
                value={formData.faculty}
                label="Facultad"
                onChange={(e) => handleSelectChange(e)}
                startAdornment={
                  <InputAdornment position="start">
                    <SchoolIcon sx={{ color: 'var(--neon-primary)' }} />
                  </InputAdornment>
                }
              >
                {facultyOptions.map((faculty) => (
                  <MenuItem key={faculty} value={faculty}>
                    {faculty}
                  </MenuItem>
                ))}
              </Select>
              {errors.faculty && <FormHelperText>{errors.faculty}</FormHelperText>}
            </FormControl>
          </Box>
        );
        
      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: 'var(--neon-primary)' }}>
              Credenciales de Acceso
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password || 'Mínimo 8 caracteres'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'var(--neon-primary)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => togglePasswordVisibility('password')}
                      edge="end"
                      sx={{ color: 'var(--neon-primary)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
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
              id="confirmPassword"
              label="Confirmar Contraseña"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'var(--neon-primary)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      edge="end"
                      sx={{ color: 'var(--neon-primary)' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  sx={{
                    color: 'var(--neon-primary)',
                    '&.Mui-checked': {
                      color: 'var(--neon-primary)',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  Acepto los{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => {
                      setSnackbar({
                        open: true,
                        message: 'Los términos y condiciones se abrirían en una nueva ventana',
                        severity: 'info',
                      });
                    }}
                    sx={{
                      color: 'var(--neon-blue)',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                        textShadow: '0 0 5px var(--neon-blue)',
                      },
                    }}
                  >
                    términos y condiciones
                  </Link>
                  {' '}y la{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => {
                      setSnackbar({
                        open: true,
                        message: 'La política de privacidad se abriría en una nueva ventana',
                        severity: 'info',
                      });
                    }}
                    sx={{
                      color: 'var(--neon-blue)',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                        textShadow: '0 0 5px var(--neon-blue)',
                      },
                    }}
                  >
                    política de privacidad
                  </Link>
                </Typography>
              }
              sx={{ mt: 2 }}
            />
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          backgroundColor: 'rgba(5, 5, 25, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          border: '1px solid var(--neon-primary)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <AccountBoxIcon
            sx={{
              fontSize: 50,
              color: 'var(--neon-primary)',
              mb: 2,
              filter: 'drop-shadow(0 0 8px var(--neon-primary))',
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            className="with-glow"
            sx={{
              fontFamily: 'Orbitron, sans-serif',
              letterSpacing: '2px',
              mb: 1,
            }}
          >
            Registro
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: 'var(--neon-blue)', mb: 3 }}
          >
            Crea tu cuenta para Campus UCR
          </Typography>
        </Box>
        
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{
            mb: 4,
            '& .MuiStepLabel-root .Mui-active': {
              color: 'var(--neon-primary)',
            },
            '& .MuiStepLabel-root .Mui-completed': {
              color: 'var(--neon-green)',
            },
            '& .MuiStepConnector-line': {
              borderColor: 'var(--neon-primary)',
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box component="form" sx={{ mt: 1 }}>
          {renderStep()}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                color: 'var(--neon-primary)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 255, 0.1)',
                },
                '&.Mui-disabled': {
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Atrás
            </Button>
            
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              sx={{
                backgroundColor: 'var(--neon-primary)',
                color: 'black',
                fontWeight: 'bold',
                boxShadow: '0 0 10px var(--neon-primary)',
                '&:hover': {
                  backgroundColor: 'var(--neon-blue)',
                  boxShadow: '0 0 15px var(--neon-blue)',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(0, 255, 255, 0.3)',
                  color: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              {activeStep === steps.length - 1
                ? (loading ? 'Procesando...' : 'Registrarse')
                : 'Siguiente'}
            </Button>
          </Box>
        </Box>
        
        <Divider
          sx={{
            my: 3,
            '&::before, &::after': {
              borderColor: 'var(--neon-primary)',
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'var(--neon-primary)', px: 1 }}
          >
            ¿Ya tienes una cuenta?
          </Typography>
        </Divider>
        
        <Grid container justifyContent="center">
          <Button
            component={RouterLink}
            to="/login"
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
            Iniciar Sesión
          </Button>
        </Grid>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterPage;