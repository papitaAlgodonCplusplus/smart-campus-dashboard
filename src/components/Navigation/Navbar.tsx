import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Campus Dashboard
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/map">Campus UCR</Button>
            <Button color="inherit" component="a" href="https://www.ucr.ac.cr/actividades/" target="_blank" rel="noopener noreferrer">Eventos</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;