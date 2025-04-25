import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navigation/Navbar';
import DashboardProviderWrapper from './components/Dashboard/DashboardProviderWrapper';
import MapPage from './pages/MapPage';
import { AuthProvider, RequireAuth, LoginPage, RegisterPage, ProfilePage, ResetPasswordPage } from './contexts/AuthContext';
import './main.css';

// Create a theme that complements the 3D visualization
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffff', // Neon cyan
    },
    secondary: {
      main: '#ff00ff', // Neon magenta
    },
    background: {
      default: '#08080f',
      paper: 'rgba(5, 5, 25, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Rajdhani", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
    },
    h2: {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
    },
    h3: {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
    },
    h4: {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
    },
    h5: {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
    },
    h6: {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.3)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#00ffff',
            borderRadius: '4px',
            boxShadow: '0 0 5px #00ffff',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#00ccff',
            boxShadow: '0 0 8px #00ccff',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(5, 5, 25, 0.8)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          transition: '0.3s',
          '&:hover': {
            transform: 'scale(1.2)',
          },
        },
      },
    },
  },
});

// Ensure fonts are loaded
const loadFonts = () => {
  const linkOrbitron = document.createElement('link');
  linkOrbitron.rel = 'stylesheet';
  linkOrbitron.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap';
  document.head.appendChild(linkOrbitron);

  const linkRajdhani = document.createElement('link');
  linkRajdhani.rel = 'stylesheet';
  linkRajdhani.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;700&display=swap';
  document.head.appendChild(linkRajdhani);
};

function App() {
  // Load fonts when the app initializes
  useEffect(() => {
    loadFonts();
    
    // Add Leaflet CSS for maps
    const linkLeaflet = document.createElement('link');
    linkLeaflet.rel = 'stylesheet';
    linkLeaflet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    linkLeaflet.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    linkLeaflet.crossOrigin = '';
    document.head.appendChild(linkLeaflet);
    
    return () => {
      document.head.removeChild(linkLeaflet);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/profile" element={
              <RequireAuth>
                <>
                  <Navbar />
                  <ProfilePage />
                </>
              </RequireAuth>
            } />
            
            {/* Dashboard Routes - Protected */}
            <Route path="/dashboard/*" element={
              <RequireAuth>
                <DashboardProviderWrapper />
              </RequireAuth>
            } />
            
            {/* Map Route with Navbar - Protected */}
            <Route
              path="/map"
              element={
                <RequireAuth>
                  <>
                    <Navbar />
                    <MapPage />
                  </>
                </RequireAuth>
              }
            />
            
            {/* Default redirect to login if not authenticated, dashboard if authenticated */}
            <Route path="/" element={
              localStorage.getItem('auth_token') ? 
                <Navigate replace to="/dashboard" /> : 
                <Navigate replace to="/login" />
            } />
            
            {/* Catch all routes */}
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;