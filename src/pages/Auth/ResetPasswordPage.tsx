// src/pages/Auth/ResetPasswordPage.tsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Link
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Key as KeyIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Mock password reset function
const mockResetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Simple validation
  if (!email.endsWith('@ucr.ac.cr')) {
    return { success: false, message: 'Debe utilizar un correo institucional (@ucr.ac.cr)' };
  }
  
  return { success: true, message: 'Código de verificación enviado al correo' };
};

// Mock verify code function
const mockVerifyCode = async (code: string): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Accept any 6-digit code for the demo
  if (!/^\d{6}$/.test(code)) {
    return { success: false, message: 'El código debe contener 6 dígitos' };
  }
  
  return { success: true, message: 'Código verificado correctamente' };
};

// Mock set new password function
const mockSetNewPassword = async (password: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Simple validation
  if (password.length < 8) {
    return { success: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  
  if (password !== confirmPassword) {
    return { success: false, message: 'Las contraseñas no coinciden' };
  }
  
  return { success: true, message: 'Contraseña restablecida correctamente' };
};

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info'
  });
  
  // Define steps
  const steps = ['Correo Electrónico', 'Verificación', 'Nueva Contraseña'];
  
  // Submit email and request verification code
  const handleSubmitEmail = async () => {
    if (!email) {
      setSnackbar({
        open: true,
        message: 'Por favor ingrese su correo electrónico',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await mockResetPassword(email);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success'
        });
        setActiveStep(1);
      } else {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al procesar la solicitud. Intente nuevamente.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Verify code
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setSnackbar({
        open: true,
        message: 'Por favor ingrese el código de verificación',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await mockVerifyCode(verificationCode);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success'
        });
        setActiveStep(2);
      } else {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al verificar el código. Intente nuevamente.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Set new password
  const handleSetNewPassword = async () => {
    if (!password || !confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Por favor complete todos los campos',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await mockSetNewPassword(password, confirmPassword);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success'
        });
        
        // Redirect to login after successful password reset
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al restablecer la contraseña. Intente nuevamente.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
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
  
  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Render current step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Ingresa tu correo electrónico institucional para recibir un código de verificación.
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Institucional"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            
            <Box sx={{ mt: 4 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmitEmail}
                disabled={loading}
                sx={{
                  py: 1.2,
                  backgroundColor: 'var(--neon-primary)',
                  color: 'black',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
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
                {loading ? 'Enviando...' : 'Enviar Código de Verificación'}
              </Button>
            </Box>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Ingresa el código de verificación de 6 dígitos que se envió a {email}.
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="verificationCode"
              label="Código de Verificación"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon sx={{ color: 'var(--neon-primary)' }} />
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
            
            <Box sx={{ mt: 4 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleVerifyCode}
                disabled={loading}
                sx={{
                  py: 1.2,
                  backgroundColor: 'var(--neon-primary)',
                  color: 'black',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
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
                {loading ? 'Verificando...' : 'Verificar Código'}
              </Button>
            </Box>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                onClick={handleSubmitEmail}
                disabled={loading}
                sx={{
                  color: 'var(--neon-blue)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 140, 255, 0.1)',
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Reenviar Código
              </Button>
            </Box>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Ingresa y confirma tu nueva contraseña.
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              name="confirmPassword"
              label="Confirmar Nueva Contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            
            <Box sx={{ mt: 4 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSetNewPassword}
                disabled={loading}
                sx={{
                  py: 1.2,
                  backgroundColor: 'var(--neon-primary)',
                  color: 'black',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
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
                {loading ? 'Procesando...' : 'Restablecer Contraseña'}
              </Button>
            </Box>
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 4 }}>
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
          <LockIcon
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
            Recuperar Contraseña
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: 'var(--neon-blue)', mb: 3 }}
          >
            Sigue los pasos para restablecer tu contraseña
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
        
        {renderStepContent()}
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            sx={{
              color: 'var(--neon-blue)',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                textShadow: '0 0 5px var(--neon-blue)',
              },
            }}
          >
            Volver a Iniciar Sesión
          </Link>
        </Box>
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

export default ResetPasswordPage;