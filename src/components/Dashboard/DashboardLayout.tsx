import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import MuseumIcon from '@mui/icons-material/Museum';
import LandscapeIcon from '@mui/icons-material/Landscape';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MapIcon from '@mui/icons-material/Map';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Resumen', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Facultades', icon: <SchoolIcon />, path: '/dashboard/facultades' },
    { text: 'Sodas', icon: <RestaurantIcon />, path: '/dashboard/sodas' },
    { text: 'Amenidades', icon: <LocalLibraryIcon />, path: '/dashboard/amenidades' },
    { text: 'Museos', icon: <MuseumIcon />, path: '/dashboard/museos' },
    { text: 'Monumentos', icon: <LandscapeIcon />, path: '/dashboard/monumentos' },
    { text: 'Edificios', icon: <ApartmentIcon />, path: '/dashboard/edificios' },
    { text: 'Mapa', icon: <MapIcon />, path: '/map' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: 'Orbitron, sans-serif',
            color: 'var(--neon-primary)',
            textShadow: '0 0 5px var(--neon-primary)',
            fontWeight: 'bold'
          }}
        >
          Campus Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  backgroundColor: isActive ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 255, 0.2)',
                  },
                  borderLeft: isActive ? '3px solid var(--neon-primary)' : '3px solid transparent',
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? 'var(--neon-primary)' : 'inherit',
                    minWidth: '40px'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    sx: { 
                      color: isActive ? 'var(--neon-primary)' : 'white',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: isActive ? 'bold' : 'normal',
                      textShadow: isActive ? '0 0 5px var(--neon-primary)' : 'none',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'var(--darker-bg)',
          borderBottom: '1px solid var(--neon-primary)',
          boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 'bold',
              textShadow: '0 0 5px rgba(0, 255, 255, 0.8)'
            }}
          >
            Campus UCR
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: 'var(--darker-bg)',
              borderRight: '1px solid var(--neon-primary)',
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: 'var(--darker-bg)',
              borderRight: '1px solid var(--neon-primary)',
              boxShadow: '5px 0 10px rgba(0, 0, 0, 0.3)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // Account for app bar height
          overflow: 'auto',
          backgroundColor: 'var(--dark-bg)',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;