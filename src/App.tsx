import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navigation/Navbar';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import './main.css'; // Import the main.css file

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/map" element={<MapPage />} />
          {/* Add more routes as you develop */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;