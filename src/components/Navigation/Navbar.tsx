import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  
  // Determine active route
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Toggle mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Navigation links - making sure all properties are properly typed
  const navLinks = [
    { name: 'Dashboard', path: '/', external: false },
    { name: 'Campus UCR', path: '/map', external: false },
    { name: 'Eventos', path: '/dashboard/eventos', external: false }, // Updated to internal route
  ];
  
  // Close drawer when path changes
  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname]);
  
  // Add glow effect to active button
  const buttonStyle = (isActiveRoute: boolean) => ({
    color: 'inherit',
    position: 'relative',
    overflow: 'hidden',
    mx: 1,
    textTransform: 'none',
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: '1rem',
    fontWeight: 'medium',
    letterSpacing: '1px',
    ...(isActiveRoute && {
      color: 'var(--neon-primary)',
      textShadow: '0 0 8px var(--neon-primary)',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '2px',
        backgroundColor: 'var(--neon-primary)',
        boxShadow: '0 0 8px var(--neon-primary)',
      }
    })
  });

  // Mobile drawer content
  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ 
        backgroundColor: 'var(--darker-bg)', 
        height: '100%',
        borderRight: '1px solid var(--neon-primary)'
      }}
    >
      <List>
        {navLinks.map((link) => (
          <ListItem 
            key={link.name}
            component={link.external ? 'a' : Link as any}
            to={!link.external ? link.path : undefined}
            href={link.external ? link.path : undefined}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            sx={{
              color: !link.external && isActive(link.path) ? 'var(--neon-primary)' : 'white',
              textShadow: !link.external && isActive(link.path) ? '0 0 8px var(--neon-primary)' : 'none',
              fontFamily: 'Rajdhani, sans-serif',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemText 
              primary={link.name}
              primaryTypographyProps={{
                sx: {
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 'medium'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 'bold',
              letterSpacing: '1px',
              color: 'white',
              textShadow: '0 0 5px var(--neon-primary)'
            }}
          >
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Campus Dashboard
            </Link>
          </Typography>
          
          {!isMobile && (
            <Box>
              {navLinks.map((link) => {
                if (link.external) {
                  return (
                    <Button 
                      key={link.name}
                      component="a"
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={buttonStyle(isActive(link.path))}>
                      {link.name}
                    </Button>
                  );
                } else {
                  return (
                    <Button 
                      key={link.name}
                      component={Link as any}
                      to={link.path}
                      sx={buttonStyle(isActive(link.path))}
                    >
                      {link.name}
                    </Button>
                  );
                }
              })}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            backgroundColor: 'var(--darker-bg)',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;