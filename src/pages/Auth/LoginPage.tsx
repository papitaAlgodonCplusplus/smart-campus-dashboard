import React, { useState, useEffect } from 'react';
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
  Lock as LockIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Check if user is already authenticated and redirect if necessary
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setSnackbar({
        open: true,
        message: 'Por favor ingrese su correo y contraseña',
        severity: 'error',
      });
      return;
    }

    try {
      setIsLoading(true);
      const success = await login({ email, password });

      if (success) {
        setSnackbar({
          open: true,
          message: 'Inicio de sesión exitoso',
          severity: 'success',
        });
        
        // Redirection will be handled by the useEffect above
      } else {
        setSnackbar({
          open: true,
          message: authError || 'Credenciales inválidas',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error de conexión. Intente nuevamente.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
          <SchoolIcon
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
            Campus UCR
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: 'var(--neon-blue)', mb: 1 }}
          >
            Accede a tu cuenta
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Institucional"
            name="email"
            autoComplete="email"
            autoFocus
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

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
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
                    onClick={toggleShowPassword}
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

          <Box sx={{ textAlign: 'right', mt: 1 }}>
            <Link
              component={RouterLink}
              to="/reset-password"
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
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 3,
              mb: 2,
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
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>

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
              ¿Nuevo en la plataforma?
            </Typography>
          </Divider>

          <Grid container justifyContent="center">
            <Button
              component={RouterLink}
              to="/register"
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
              Crear una cuenta
            </Button>
          </Grid>
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

      {/* Demo access info */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'var(--neon-orange)' }}>
          Demo: Use email "student@ucr.ac.cr" with password "password123"
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--neon-orange)' }}>
          Admin: Use email "admin@ucr.ac.cr" with password "admin123"
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;