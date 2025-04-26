import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  // Determine active route
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Toggle mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Handle profile menu
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle navigation to profile
  const handleProfileClick = () => {
    navigate('/profile');
    handleProfileMenuClose();
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };
  
  // Navigation links - making sure all properties are properly typed
  const navLinks = [
    { name: 'Dashboard', path: '/', external: false },
    { name: 'Campus UCR', path: '/map', external: false },
    { name: 'Marketplace', path: '/marketplace', external: false },
    { name: 'Eventos', path: '/dashboard/eventos', external: false },
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
        
        {isAuthenticated && (
          <>
            <Divider sx={{ my: 1, borderColor: 'rgba(0, 255, 255, 0.2)' }} />
            
            <ListItem
              component={Link as any}
              to="/profile"
              sx={{
                color: isActive('/profile') ? 'var(--neon-primary)' : 'white',
                textShadow: isActive('/profile') ? '0 0 8px var(--neon-primary)' : 'none',
                fontFamily: 'Rajdhani, sans-serif',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemText 
                primary="Mi Perfil"
                primaryTypographyProps={{
                  sx: {
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 'medium'
                  }
                }}
              />
            </ListItem>
            
            <ListItem
              component="button"
              onClick={handleLogout}
              sx={{
                color: 'var(--neon-red)',
                fontFamily: 'Rajdhani, sans-serif',
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 128, 0.1)'
                }
              }}
            >
              <ListItemText 
                primary="Cerrar Sesión"
                primaryTypographyProps={{
                  sx: {
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 'medium'
                  }
                }}
              />
            </ListItem>
          </>
        )}
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
          
          {/* User profile section */}
          {isAuthenticated ? (
            <Box sx={{ ml: 2 }}>
              <IconButton
                aria-label="user account"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {user?.profilePicture ? (
                  <Avatar 
                    src={user.profilePicture} 
                    alt={user.firstName}
                    sx={{ 
                      border: '2px solid var(--neon-primary)',
                      boxShadow: '0 0 10px var(--neon-primary)'
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      bgcolor: 'var(--neon-primary)',
                      color: 'black',
                      border: '2px solid var(--neon-primary)',
                      boxShadow: '0 0 10px var(--neon-primary)'
                    }}
                  >
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </Avatar>
                )}
              </IconButton>
              
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: 'rgba(5, 5, 25, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '8px',
                    border: '1px solid var(--neon-primary)',
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
                    minWidth: '180px',
                    overflow: 'hidden'
                  }
                }}
              >
                {user && (
                  <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0, 255, 255, 0.2)' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                )}
                
                <MenuItem onClick={handleProfileClick} sx={{ 
                  py: 1.5,
                  '&:hover': { 
                    bgcolor: 'rgba(0, 255, 255, 0.1)' 
                  }
                }}>
                  <PersonIcon sx={{ mr: 1, color: 'var(--neon-primary)' }} />
                  <Typography variant="body1">Mi Perfil</Typography>
                </MenuItem>
                
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    color: 'var(--neon-red)', 
                    py: 1.5,
                    '&:hover': { 
                      bgcolor: 'rgba(255, 0, 128, 0.1)' 
                    }
                  }}
                >
                  <LogoutIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">Cerrar Sesión</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              component={Link as any}
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
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;