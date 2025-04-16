import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDashboard } from '../../components/Dashboard/DashboardContext';
import BuildingCard from '../../components/Dashboard/BuildingCard';

const BuildingsPage: React.FC = () => {
  const { loading, error, spaces } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Group spaces by building
  const buildingsMap = spaces.reduce((buildings, space) => {
    if (!buildings[space.building]) {
      buildings[space.building] = [];
    }
    buildings[space.building].push(space);
    return buildings;
  }, {} as Record<string, typeof spaces>);
  
  // Filter buildings based on search term
  const filteredBuildings = Object.keys(buildingsMap)
    .filter(building => building.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom className="with-glow">
        Edificios
      </Typography>
      
      {/* Search filter */}
      <Box sx={{ mb: 4, mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar edificio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'var(--neon-primary)' }} />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--neon-primary)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--neon-primary)',
                borderWidth: '2px',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--neon-primary)',
                boxShadow: '0 0 5px var(--neon-primary)',
              },
            }
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div className="neon-loading"></div>
        </Box>
      ) : error ? (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        </Box>
      ) : (
        <>
          {/* Building stats */}
          <Grid container spacing={2}>
            {filteredBuildings.length > 0 ? (
              filteredBuildings.map((building) => (
                <Grid container key={building}>
                  <BuildingCard 
                    building={building} 
                    spaces={buildingsMap[building]} 
                  />
                </Grid>
              ))
            ) : (
              <Grid container>
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    mt: 4, 
                    p: 4, 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    border: '1px dashed var(--neon-primary)'
                  }}
                >
                  <Typography variant="h6">
                    No se encontraron edificios que coincidan con la búsqueda.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          
          {/* Current Time and Last Updated */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, color: 'text.secondary' }}>
            <Typography variant="body2">
              Última actualización: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </>
      )}
    </Container>
  );
};

export default BuildingsPage;