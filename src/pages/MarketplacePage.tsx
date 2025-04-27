import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Badge,
  Tooltip,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { ListingCategory, ListingCondition } from '../types/MarketplaceTypes';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MapIcon from '@mui/icons-material/Map';
import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ReportIcon from '@mui/icons-material/Report';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { format, formatDistanceToNow } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// API Services
import * as marketplaceApi from '../services/marketplaceApi';

// Types
import {
  Listing,
  ListingFormData,
  ListingFilters,
  productCategories,
  productConditions,
  campusLocations
} from '../types/MarketplaceTypes';

// Fix for Leaflet icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Define UCR coordinates (center of campus)
const UCR_CENTER: [number, number] = [9.9377, -84.0500];
const DEFAULT_ZOOM = 15;

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to create marker icons for listings
const createMarkerIcon = (category: string): L.Icon => {
  const colorMap: Record<string, string> = {
    books: 'blue',
    electronics: 'red',
    clothing: 'green',
    furniture: 'orange',
    services: 'violet',
    tickets: 'gold',
    housing: 'yellow',
    other: 'grey'
  };

  const color = colorMap[category] || 'blue';

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Location Picker Component
const LocationPicker: React.FC<{
  onLocationSelect: (position: [number, number], name: string) => void;
  initialPosition?: [number, number];
}> = ({ onLocationSelect, initialPosition }) => {
  const [position, setPosition] = useState<[number, number] | null>(initialPosition || null);
  const [locationName, setLocationName] = useState<string>('');

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2">Ubicación Seleccionada</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Nombre de ubicación"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              sx={{ mt: 1 }}
            />
            <Button
              variant="contained"
              size="small"
              sx={{
                mt: 1,
                backgroundColor: 'var(--neon-primary)',
                '&:hover': {
                  backgroundColor: 'var(--neon-blue)'
                }
              }}
              onClick={() => {
                onLocationSelect(position, locationName);
              }}
            >
              Confirmar
            </Button>
          </Box>
        </Popup>
      </Marker>
    );
  }

  return (
    <Box sx={{ height: 300, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
      <MapContainer
        center={initialPosition || UCR_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
    </Box>
  );
};

// Main MarketplacePage Component
const MarketplacePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);

  // Filters state
  const [filters, setFilters] = useState<ListingFilters>({
    sortBy: 'newest',
    search: '',
    category: 'all',
    subcategory: 'all',
    condition: 'all',
    locationType: 'all',
    priceMin: 0,
    priceMax: null
  });

  const [savedOnly, setSavedOnly] = useState(false);

  // New listing form state
  const [newListing, setNewListing] = useState<Partial<ListingFormData>>({
    title: '',
    description: '',
    price: 0,
    category: '' as ListingCategory,
    subcategory: '',
    condition: '' as ListingCondition,
    location: {
      type: 'campus',
      campus: ''
    },
    photos: [],
    contactInfo: {},
    isAnonymous: false,
    startDate: new Date()
  });

  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // Fetch listings on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await marketplaceApi.fetchListings();
        setListings(data);
        setFilteredListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setSnackbar({
          open: true,
          message: 'Error al cargar los anuncios',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (savedOnly) {
      const fetchSaved = async () => {
        try {
          setIsLoading(true);
          const data = await marketplaceApi.fetchSavedListings();
          setFilteredListings(data);
        } catch (error) {
          console.error('Error fetching saved listings:', error);
          setSnackbar({
            open: true,
            message: 'Error al cargar los anuncios guardados',
            severity: 'error'
          });
        } finally {
          setIsLoading(false);
        }
      };

      if (isAuthenticated) {
        fetchSaved();
      } else {
        setFilteredListings([]);
      }
    } else {
      const fetchFilteredListings = async () => {
        try {
          setIsLoading(true);
          const data = await marketplaceApi.fetchListings(filters);
          setFilteredListings(data);
          for (const listing of data) {
            const isLiked = listing.likedBy.includes(user?._id || '');
            setFavoriteListings(prev => {
              const existing = prev.find(fav => fav._id === listing._id);
              if (existing) {
                return prev.map(fav => (fav._id === listing._id ? { ...fav, isLiked } : fav));
              } else {
                return [...prev, { ...listing, isLiked }];
              }
            });
          }
        } catch (error) {
          console.error('Error fetching filtered listings:', error);
          setSnackbar({
            open: true,
            message: 'Error al aplicar los filtros',
            severity: 'error'
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchFilteredListings();
    }
  }, [filters, savedOnly, isAuthenticated]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      sortBy: 'newest',
      search: '',
      category: 'all',
      subcategory: 'all',
      condition: 'all',
      locationType: 'all',
      priceMin: 0,
      priceMax: null
    });
    setSavedOnly(false);
  };

  // Toggle like on a listing
  const toggleLike = async (id: string) => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para dar me gusta',
        severity: 'warning'
      });
      return;
    }

    try {
      const result = await marketplaceApi.toggleLikeListing(id);
      console.log('Toggle Like Result:', result); // Debugging line

      // Update listings
      setListings(prev =>
        prev.map(listing => {
          if (listing._id === id) {
            return {
              ...listing,
              isLiked: result.isLiked,
              likes: result.likes
            };
          }
          return listing;
        })
      );

      // Also update filtered listings
      setFilteredListings(prev =>
        prev.map(listing => {
          if (listing._id === id) {
            return {
              ...listing,
              isLiked: result.isLiked,
              likes: result.likes
            };
          }
          return listing;
        })
      );

      // Update selected listing if it's the one being liked
      if (selectedListing && selectedListing._id === id) {
        setSelectedListing({
          ...selectedListing,
          isLiked: result.isLiked,
          likes: result.likes
        });
      }

      setFavoriteListings(prev =>
        prev.map(listing => {
          if (listing._id === id) {
            return {
              ...listing,
              isLiked: result.isLiked,
              likes: result.likes
            };
          }
          return listing;
        })
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      setSnackbar({
        open: true,
        message: 'Error al dar me gusta',
        severity: 'error'
      });
    }
  };

  // Toggle save on a listing
  const toggleSave = async (id: string) => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para guardar anuncios',
        severity: 'warning'
      });
      return;
    }

    try {
      const result = await marketplaceApi.toggleSaveListing(id);

      // Update listings
      setListings(prev =>
        prev.map(listing => {
          if (listing._id === id) {
            return {
              ...listing,
              isSaved: result.isSaved
            };
          }
          return listing;
        })
      );

      // Update filtered listings
      setFilteredListings(prev =>
        prev.map(listing => {
          if (listing._id === id) {
            return {
              ...listing,
              isSaved: result.isSaved
            };
          }
          return listing;
        })
      );

      // Update selected listing if it's the one being saved
      if (selectedListing && selectedListing._id === id) {
        setSelectedListing({
          ...selectedListing,
          isSaved: result.isSaved
        });
      }

      // If we're in saved only mode and the listing was unsaved, refresh the list
      if (savedOnly && !result.isSaved) {
        const savedListings = await marketplaceApi.fetchSavedListings();
        setFilteredListings(savedListings);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar el anuncio',
        severity: 'error'
      });
    }
  };

  // Handle selecting a listing to view
  const handleViewListing = async (listingId: string) => {
    try {
      // Fetch the latest version of the listing
      const listing = await marketplaceApi.fetchListingById(listingId);
      setSelectedListing(listing);
    } catch (error) {
      console.error('Error fetching listing:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar el anuncio',
        severity: 'error'
      });
    }
  };

  // Handle closing the selected listing view
  const handleCloseListing = () => {
    setSelectedListing(null);
  };

  // Handle new listing form input changes
  const handleNewListingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;

    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewListing(prev => ({
        ...prev,
        [parent]: {
          ...(typeof prev[parent as keyof typeof prev] === 'object' && prev[parent as keyof typeof prev] !== null && !Array.isArray(prev[parent as keyof typeof prev])
            ? (prev[parent as keyof typeof prev] as Record<string, unknown>)
            : {}),
          [child]: value
        }
      }));
    } else {
      setNewListing(prev => ({
        ...prev,
        [name]: value
      }));

      // Clear validation error when field is updated
      if (validationErrors[name]) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }

      // If category changes, reset subcategory
      if (name === 'category') {
        setNewListing(prev => ({
          ...prev,
          subcategory: ''
        }));
      }
    }
  };

  // Get subcategories for the selected category
  const getSubcategories = () => {
    const category = productCategories.find(cat => cat.value === newListing.category);
    return category ? category.subcategories : [];
  };

  // Handle location type change
  const handleLocationTypeChange = (type: 'campus' | 'express') => {
    setNewListing(prev => ({
      ...prev,
      location: {
        type,
        campus: type === 'campus' ? (prev.location?.campus || '') : '',
        ...(type === 'express' ? { locationName: '' } : {})
      }
    }));

    if (type === 'express') {
      setSelectedLocation(null);
    }
  };

  // Handle location selection
  const handleLocationSelect = (position: [number, number], name: string) => {
    setSelectedLocation(position);
    setNewListing(prev => ({
      ...prev,
      location: {
        ...prev.location as any,
        position,
        locationName: name
      }
    }));

    setSnackbar({
      open: true,
      message: 'Ubicación seleccionada: ' + name,
      severity: 'success'
    });

    // Clear validation error
    if (validationErrors['location']) {
      setValidationErrors(prev => ({
        ...prev,
        location: ''
      }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewListing(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle date changes
  const handleDateChange = (date: Date | null, field: 'startDate' | 'endDate') => {
    if (date) {
      setNewListing(prev => ({
        ...prev,
        [field]: date
      }));
    }
  };

  // Validate new listing form
  const validateNewListing = () => {
    const errors: Record<string, string> = {};

    if (!newListing.title?.trim()) {
      errors.title = 'El título es requerido';
    }

    if (!newListing.description?.trim()) {
      errors.description = 'La descripción es requerida';
    }

    if (!newListing.price || newListing.price <= 0) {
      errors.price = 'El precio debe ser mayor a 0';
    }

    if (!newListing.category) {
      errors.category = 'La categoría es requerida';
    }

    if (!newListing.subcategory && newListing.category !== 'other') {
      errors.subcategory = 'La subcategoría es requerida';
    }

    if (!newListing.condition) {
      errors.condition = 'La condición es requerida';
    }

    // Validate location
    if (newListing.location?.type === 'campus') {
      if (!newListing.location.campus) {
        errors.location = 'Debe seleccionar un campus';
      }
      if (!selectedLocation) {
        errors.location = 'Debe seleccionar una ubicación en el mapa';
      }
    }

    if (newListing.location?.type === 'express' && !newListing.location.locationName) {
      errors.location = 'Debe proporcionar un nombre de ubicación';
    }

    // Validate contact info - at least one contact method is required
    const hasContactInfo = newListing.contactInfo?.phone ||
      newListing.contactInfo?.email ||
      newListing.contactInfo?.whatsapp;

    if (!hasContactInfo) {
      errors.contactInfo = 'Debe proporcionar al menos un método de contacto';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create new listing
  const handleCreateListing = async () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para publicar anuncios',
        severity: 'warning'
      });
      return;
    }

    if (!validateNewListing()) {
      setSnackbar({
        open: true,
        message: 'Por favor corrija los errores en el formulario',
        severity: 'error'
      });
      return;
    }

    try {
      const response = await marketplaceApi.createListing(newListing as ListingFormData);

      // Add the new listing to state
      setListings(prev => [response, ...prev]);

      // Apply filters again to update filtered listings
      const updatedListings = await marketplaceApi.fetchListings(filters);
      setFilteredListings(updatedListings);

      // Close dialog and show success message
      setCreateDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Anuncio creado exitosamente',
        severity: 'success'
      });

      // Reset form
      setNewListing({
        title: '',
        description: '',
        price: 0,
        category: '' as ListingCategory,
        subcategory: '',
        condition: '' as ListingCondition,
        location: {
          type: 'campus',
          campus: ''
        },
        photos: [],
        contactInfo: {},
        isAnonymous: false,
        startDate: new Date()
      });
      setSelectedLocation(null);

    } catch (error) {
      console.error('Error creating listing:', error);
      setSnackbar({
        open: true,
        message: 'Error al crear el anuncio',
        severity: 'error'
      });
    }
  };

  // Handle deleting a listing
  const handleDeleteListing = async (id: string) => {
    try {
      await marketplaceApi.deleteListing(id);

      // Remove the listing from state
      setListings(prev => prev.filter(listing => listing._id !== id));
      setFilteredListings(prev => prev.filter(listing => listing._id !== id));

      if (selectedListing?._id === id) {
        setSelectedListing(null);
      }

      setSnackbar({
        open: true,
        message: 'Anuncio eliminado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting listing:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el anuncio',
        severity: 'error'
      });
    }
  };

  // Format date string
  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  // Get subcategory label from values
  const getSubcategoryLabel = (categoryValue: string, subcategoryValue: string) => {
    const category = productCategories.find(cat => cat.value === categoryValue);
    if (!category) return subcategoryValue;

    const subcategory = category.subcategories.find(sub => sub.value === subcategoryValue);
    return subcategory ? subcategory.label : subcategoryValue;
  };

  // Get condition label from value
  const getConditionLabel = (conditionValue: string) => {
    const condition = productConditions.find(cond => cond.value === conditionValue);
    return condition ? condition.label : conditionValue;
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      books: 'var(--neon-blue)',
      electronics: 'var(--neon-red)',
      clothing: 'var(--neon-green)',
      furniture: 'var(--neon-orange)',
      services: 'var(--neon-secondary)',
      tickets: 'var(--neon-primary)',
      housing: 'var(--neon-yellow)',
      other: '#94a3b8'
    };

    return colorMap[category] || 'var(--neon-primary)';
  };

  // Render loading state
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div className="neon-loading"></div>
        </Box>
      </Container>
    );
  }

  // Render listing cards for grid view
  const renderListingCards = () => {
    console.log('Filtered Listings:', filteredListings); // Debugging line

    if (filteredListings.length === 0) {
      return (
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron anuncios con los criterios seleccionados
          </Typography>
          <Button
            variant="outlined"
            onClick={resetFilters}
            sx={{
              mt: 2,
              color: 'var(--neon-primary)',
              borderColor: 'var(--neon-primary)',
              '&:hover': {
                borderColor: 'var(--neon-blue)',
                color: 'var(--neon-blue)',
                boxShadow: '0 0 10px var(--neon-blue)'
              }
            }}
          >
            Reiniciar filtros
          </Button>
        </Box>
      );
    }

    return (
      <Grid container spacing={2}>
        {filteredListings.map(listing => (
          <Grid container key={listing._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                boxShadow: listing.isSaved
                  ? '0 0 10px var(--neon-primary)'
                  : '0 0 5px rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 12px rgba(0, 255, 255, 0.2)'
                },
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {/* Top indicators */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 1,
                  display: 'flex',
                  gap: 1
                }}
              >
                {listing.isAnonymous && (
                  <Chip
                    size="small"
                    label="Anónimo"
                    sx={{
                      bgcolor: 'rgba(255, 128, 0, 0.7)',
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: '0.7rem'
                    }}
                  />
                )}

                {listing.location.type === 'express' && (
                  <Chip
                    size="small"
                    icon={<LocalShippingIcon sx={{ fontSize: '0.9rem !important' }} />}
                    label="Express"
                    sx={{
                      bgcolor: 'rgba(0, 255, 255, 0.7)',
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      '& .MuiChip-icon': {
                        color: 'black'
                      }
                    }}
                  />
                )}
              </Box>

              {/* Image */}
              <Box
                onClick={() => {
                  console.error('handleViewListing is not defined');
                }}
                sx={{
                  cursor: 'pointer',
                  height: 140,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.2)',
                  position: 'relative'
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={listing.photos[0] || '/images/default.jpg'}
                  alt={listing.title}
                  sx={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    py: 0.5,
                    px: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <VisibilityIcon sx={{ fontSize: '0.9rem' }} />
                    {listing.views}
                  </Box>
                  <Box>
                    {formatRelativeTime(listing.createdAt)}
                  </Box>
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      mb: 0.5,
                      height: '2.4rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {listing.title}
                  </Typography>

                  <Typography
                    variant="h6"
                    color="var(--neon-green)"
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textShadow: '0 0 5px var(--neon-green)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ₡{listing.price.toLocaleString()}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 1,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5
                  }}
                >
                  <Chip
                    size="small"
                    label={getCategoryLabel(listing.category)}
                    sx={{
                      backgroundColor: 'rgba(0, 140, 255, 0.2)',
                      border: '1px solid var(--neon-blue)',
                      color: 'var(--neon-blue)',
                      fontSize: '0.7rem'
                    }}
                  />

                  <Chip
                    size="small"
                    label={getConditionLabel(listing.condition)}
                    sx={{
                      backgroundColor: listing.condition === 'new' || listing.condition === 'like_new'
                        ? 'rgba(0, 255, 128, 0.2)'
                        : listing.condition === 'poor'
                          ? 'rgba(255, 0, 128, 0.2)'
                          : 'rgba(255, 136, 0, 0.2)',
                      border: `1px solid ${listing.condition === 'new' || listing.condition === 'like_new'
                        ? 'var(--neon-green)'
                        : listing.condition === 'poor'
                          ? 'var(--neon-red)'
                          : 'var(--neon-orange)'
                        }`,
                      color: listing.condition === 'new' || listing.condition === 'like_new'
                        ? 'var(--neon-green)'
                        : listing.condition === 'poor'
                          ? 'var(--neon-red)'
                          : 'var(--neon-orange)',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>

                <Box sx={{ mt: 1.5, mb: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      height: '3rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {listing.description}
                  </Typography>
                </Box>

                {/* Location info */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: 1,
                  color: 'var(--neon-primary)',
                  fontSize: '0.8rem'
                }}>
                  <LocationOnIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: 'inherit'
                    }}
                  >
                    {listing.location.locationName || (listing.location.type === 'express' ? 'Entrega Express' : 'Ubicación en Campus')}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => toggleLike(listing._id)}
                    sx={{ color: favoriteListings.some(fav => fav._id === listing._id) ? 'var(--neon-red)' : 'white' }}
                  >
                    {favoriteListings.some(fav => fav._id === listing._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
                    {listing.likes}
                  </Typography>
                </Box>

                <Box>
                  <IconButton
                    size="small"
                    onClick={() => toggleSave(listing._id)}
                    sx={{ color: listing.isSaved ? 'var(--neon-primary)' : 'white' }}
                  >
                    {listing.isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => handleViewListing(listing._id)}
                    sx={{ color: 'white' }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom className="with-glow">
        Marketplace UCR
      </Typography>

      {/* Search and Filter Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 2 }}>
          <TextField
            placeholder="Buscar productos o servicios..."
            value={filters.search}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'var(--neon-primary)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flexGrow: 1,
              maxWidth: 500,
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
            }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDialogOpen(true)}
            sx={{
              color: 'var(--neon-primary)',
              borderColor: 'var(--neon-primary)',
              '&:hover': {
                borderColor: 'var(--neon-blue)',
                color: 'var(--neon-blue)',
                boxShadow: '0 0 10px var(--neon-blue)'
              }
            }}
          >
            Filtros
          </Button>

          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="sort-select-label" sx={{ color: 'var(--neon-primary)' }}>Ordenar</InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={filters.sortBy || 'newest'}
              label="Ordenar"
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--neon-primary)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--neon-primary)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--neon-primary)',
                },
              }}
            >
              <MenuItem value="newest">Más recientes</MenuItem>
              <MenuItem value="oldest">Más antiguos</MenuItem>
              <MenuItem value="price_low">Precio: menor a mayor</MenuItem>
              <MenuItem value="price_high">Precio: mayor a menor</MenuItem>
              <MenuItem value="popular">Más vistos</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            backgroundColor: 'var(--neon-primary)',
            color: 'black',
            '&:hover': {
              backgroundColor: 'var(--neon-blue)',
              boxShadow: '0 0 15px var(--neon-blue)'
            }
          }}
        >
          Publicar Anuncio
        </Button>
      </Box>

      {/* Applied filters chips */}
      {(filters.category !== 'all' ||
        filters.subcategory !== 'all' ||
        filters.condition !== 'all' ||
        filters.locationType !== 'all' ||
        (filters.priceMin && filters.priceMin > 0) ||
        filters.priceMax !== null ||
        savedOnly) && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {filters.category !== 'all' && (
              <Chip
                label={`Categoría: ${getCategoryLabel(filters.category || '')}`}
                onDelete={() => setFilters(prev => ({ ...prev, category: 'all', subcategory: 'all' }))}
                sx={{
                  backgroundColor: 'rgba(0, 140, 255, 0.2)',
                  color: 'var(--neon-blue)',
                  borderColor: 'var(--neon-blue)'
                }}
              />
            )}

            {filters.subcategory !== 'all' && (
              <Chip
                label={`Subcategoría: ${getSubcategoryLabel(filters.category || '', filters.subcategory || '')}`}
                onDelete={() => setFilters(prev => ({ ...prev, subcategory: 'all' }))}
                sx={{
                  backgroundColor: 'rgba(0, 140, 255, 0.2)',
                  color: 'var(--neon-blue)',
                  borderColor: 'var(--neon-blue)'
                }}
              />
            )}

            {filters.condition !== 'all' && (
              <Chip
                label={`Condición: ${getConditionLabel(filters.condition || '')}`}
                onDelete={() => setFilters(prev => ({ ...prev, condition: 'all' }))}
                sx={{
                  backgroundColor: 'rgba(0, 255, 128, 0.2)',
                  color: 'var(--neon-green)',
                  borderColor: 'var(--neon-green)'
                }}
              />
            )}

            {filters.locationType !== 'all' && (
              <Chip
                label={`Ubicación: ${filters.locationType === 'campus' ? 'Campus' : 'Express'}`}
                onDelete={() => setFilters(prev => ({ ...prev, locationType: 'all' }))}
                sx={{
                  backgroundColor: 'rgba(255, 0, 255, 0.2)',
                  color: 'var(--neon-secondary)',
                  borderColor: 'var(--neon-secondary)'
                }}
              />
            )}

            {((filters.priceMin && filters.priceMin > 0) || filters.priceMax !== null) && (
              <Chip
                label={`Precio: ${filters.priceMin || 0} - ${filters.priceMax ? filters.priceMax : 'Max'}`}
                onDelete={() => setFilters(prev => ({ ...prev, priceMin: 0, priceMax: null }))}
                sx={{
                  backgroundColor: 'rgba(0, 255, 255, 0.2)',
                  color: 'var(--neon-primary)',
                  borderColor: 'var(--neon-primary)'
                }}
              />
            )}

            {savedOnly && (
              <Chip
                label="Solo guardados"
                onDelete={() => setSavedOnly(false)}
                sx={{
                  backgroundColor: 'rgba(0, 255, 255, 0.2)',
                  color: 'var(--neon-primary)',
                  borderColor: 'var(--neon-primary)'
                }}
              />
            )}

            <Button
              size="small"
              onClick={resetFilters}
              sx={{
                ml: 1,
                color: 'var(--neon-red)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 128, 0.1)'
                }
              }}
            >
              Limpiar filtros
            </Button>
          </Box>
        )}

      {/* Stats bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 1,
          p: 1
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Mostrando {filteredListings.length} de {listings.length} anuncios
        </Typography>

        <Box>
          <Button
            size="small"
            onClick={() => setSavedOnly(!savedOnly)}
            startIcon={savedOnly ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            sx={{
              color: savedOnly ? 'var(--neon-primary)' : 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 255, 0.1)'
              }
            }}
          >
            {savedOnly ? 'Todos los anuncios' : 'Solo guardados'}
          </Button>
        </Box>
      </Box>

      {/* View Mode Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              color: 'white',
              '&.Mui-selected': {
                color: 'var(--neon-primary)',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--neon-primary)',
            },
          }}
        >
          <Tab icon={<StoreIcon />} label="Cuadrícula" />
          <Tab icon={<MapIcon />} label="Mapa" />
        </Tabs>
      </Box>

      {/* Main Content Based on Tab Value */}
      {tabValue === 0 ? renderListingCards() : renderMapView(filteredListings, setSelectedListing)}

      {/* Selected Listing Details Dialog */}
      <Dialog
        open={selectedListing !== null}
        onClose={handleCloseListing}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(5, 5, 25, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            border: '1px solid var(--neon-primary)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
          }
        }}
      >
        {selectedListing && (
          <>
            <Box sx={{ position: 'relative', height: 300 }}>
              <img
                src={selectedListing.photos[0] || '/images/default.jpg'}
                alt={selectedListing.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Back button */}
              <IconButton
                onClick={handleCloseListing}
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  }
                }}
              >
                <CloseIcon />
              </IconButton>

              {/* Category chip */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  display: 'flex',
                  gap: 1
                }}
              >
                <Chip
                  label={getCategoryLabel(selectedListing.category)}
                  sx={{
                    backgroundColor: 'rgba(0, 140, 255, 0.6)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                  icon={<CategoryIcon sx={{ color: 'white !important' }} />}
                />

                <Chip
                  label={getConditionLabel(selectedListing.condition)}
                  sx={{
                    backgroundColor: selectedListing.condition === 'new' || selectedListing.condition === 'like_new'
                      ? 'rgba(0, 255, 128, 0.6)'
                      : selectedListing.condition === 'poor'
                        ? 'rgba(255, 0, 128, 0.6)'
                        : 'rgba(255, 136, 0, 0.6)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                  icon={<LocalOfferIcon sx={{ color: 'white !important' }} />}
                />
              </Box>

              {/* Action buttons */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  display: 'flex',
                  gap: 1
                }}
              >
                <IconButton
                  onClick={() => toggleLike(selectedListing._id)}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: favoriteListings.some(fav => fav._id === selectedListing._id) ? 'var(--neon-red)' : 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }
                  }}
                >
                  {favoriteListings.some(fav => fav._id === selectedListing._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>

                <IconButton
                  onClick={() => toggleSave(selectedListing._id)}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: selectedListing.isSaved ? 'var(--neon-primary)' : 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }
                  }}
                >
                  {selectedListing.isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>

                <IconButton
                  onClick={() => {
                    navigator.share({
                      title: selectedListing.title,
                      text: selectedListing.description,
                      url: window.location.href
                    }).catch(() => {
                      setSnackbar({
                        open: true,
                        message: 'Compartir no está disponible en este navegador',
                        severity: 'warning'
                      });
                    });
                  }}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {selectedListing.title}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'var(--neon-green)',
                    fontWeight: 'bold',
                    textShadow: '0 0 5px var(--neon-green)'
                  }}
                >
                  ₡{selectedListing.price.toLocaleString()}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Publicado {formatRelativeTime(selectedListing.createdAt)}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3, borderColor: 'rgba(0, 255, 255, 0.2)' }} />

              <Grid container spacing={3}>
                <Grid container>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1, color: 'var(--neon-primary)' }}>
                      Descripción
                    </Typography>
                    <Typography variant="body1">
                      {selectedListing.description}
                    </Typography>
                  </Box>
                </Grid>

                <Grid >
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1, color: 'var(--neon-primary)' }}>
                      Detalles
                    </Typography>

                    <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                      <LocalOfferIcon sx={{ mr: 1, color: 'var(--neon-orange)' }} />
                      <Typography variant="body2">
                        <strong>Categoría:</strong> {getCategoryLabel(selectedListing.category)} - {getSubcategoryLabel(selectedListing.category, selectedListing.subcategory)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon sx={{ mr: 1, color: 'var(--neon-blue)' }} />
                      <Typography variant="body2">
                        <strong>Disponible desde:</strong> {formatDate(selectedListing.startDate)}
                        {selectedListing.endDate && <> hasta {formatDate(selectedListing.endDate)}</>}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <VisibilityIcon sx={{ mr: 1, color: 'var(--neon-green)' }} />
                      <Typography variant="body2">
                        <strong>Vistas:</strong> {selectedListing.views} | <strong>Me gusta:</strong> {selectedListing.likes}
                      </Typography>
                    </Box>

                    {selectedListing.location.position && (
                      <Box sx={{ mt: 2, height: 200, borderRadius: '8px', overflow: 'hidden' }}>
                        <MapContainer
                          center={selectedListing.location.position}
                          zoom={16}
                          style={{ height: '100%', width: '100%' }}
                          scrollWheelZoom={false}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Marker position={selectedListing.location.position}>
                            <Popup>{selectedListing.location.locationName}</Popup>
                          </Marker>
                        </MapContainer>
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid >
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1, color: 'var(--neon-primary)' }}>
                      Vendedor
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: selectedListing.isAnonymous ? 'var(--neon-orange)' : 'var(--neon-blue)',
                          color: 'black',
                          width: 40,
                          height: 40,
                          mr: 2
                        }}
                      >
                        {selectedListing.isAnonymous ? 'A' : selectedListing.createdBy.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedListing.isAnonymous ? 'Anónimo' : selectedListing.createdBy.name}
                        </Typography>
                        {!selectedListing.isAnonymous && (
                          <Typography variant="body2" color="text.secondary">
                            {selectedListing.createdBy.faculty}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ mb: 1, mt: 3, color: 'var(--neon-primary)' }}>
                      Contacto
                    </Typography>

                    {selectedListing.contactInfo.phone && (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<PhoneIcon />}
                        sx={{
                          mb: 1,
                          justifyContent: 'flex-start',
                          color: 'var(--neon-green)',
                          borderColor: 'var(--neon-green)',
                          '&:hover': {
                            borderColor: 'var(--neon-green)',
                            color: 'var(--neon-green)',
                            boxShadow: '0 0 10px var(--neon-green)'
                          }
                        }}
                        onClick={() => window.open(`tel:${selectedListing.contactInfo.phone}`)}
                      >
                        {selectedListing.contactInfo.phone}
                      </Button>
                    )}

                    {selectedListing.contactInfo.whatsapp && (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<WhatsAppIcon />}
                        sx={{
                          mb: 1,
                          justifyContent: 'flex-start',
                          color: 'var(--neon-green)',
                          borderColor: 'var(--neon-green)',
                          '&:hover': {
                            borderColor: 'var(--neon-green)',
                            color: 'var(--neon-green)',
                            boxShadow: '0 0 10px var(--neon-green)'
                          }
                        }}
                        onClick={() => window.open(`https://wa.me/${(selectedListing.contactInfo.whatsapp ?? '').replace(/[^\d]/g, '')}`)}
                      >
                        WhatsApp
                      </Button>
                    )}

                    {selectedListing.contactInfo.email && (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<EmailIcon />}
                        sx={{
                          mb: 1,
                          justifyContent: 'flex-start',
                          color: 'var(--neon-blue)',
                          borderColor: 'var(--neon-blue)',
                          '&:hover': {
                            borderColor: 'var(--neon-blue)',
                            color: 'var(--neon-blue)',
                            boxShadow: '0 0 10px var(--neon-blue)'
                          }
                        }}
                        onClick={() => window.open(`mailto:${selectedListing.contactInfo.email}`)}
                      >
                        {selectedListing.contactInfo.email}
                      </Button>
                    )}

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                      <IconButton
                        color="error"
                        aria-label="report listing"
                        onClick={() => {
                          setSnackbar({
                            open: true,
                            message: 'Reporte enviado. Gracias por mantener segura nuestra comunidad.',
                            severity: 'info'
                          });
                        }}
                        sx={{ color: 'var(--neon-red)', mr: 2 }}
                      >
                        <ReportIcon />
                      </IconButton>

                      {isAuthenticated && user && selectedListing.createdBy.id === user._id && (
                        <IconButton
                          color="error"
                          aria-label="delete listing"
                          onClick={() => {
                            handleDeleteListing(selectedListing._id);
                            handleCloseListing();
                          }}
                          sx={{ color: 'var(--neon-red)' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Dialog>

      {/* Create Listing Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(5, 5, 25, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            border: '1px solid var(--neon-primary)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'var(--neon-primary)' }}>
            Publicar Nuevo Anuncio
          </Typography>

          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid container>
              <TextField
                fullWidth
                label="Título del anuncio"
                name="title"
                value={newListing.title || ''}
                onChange={handleNewListingChange}
                required
                error={!!validationErrors.title}
                helperText={validationErrors.title}
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
            </Grid>

            <Grid container>
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={newListing.description || ''}
                onChange={handleNewListingChange}
                required
                multiline
                rows={4}
                error={!!validationErrors.description}
                helperText={validationErrors.description}
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
            </Grid>

            <Grid >
              <TextField
                fullWidth
                label="Precio (colones)"
                name="price"
                type="number"
                value={newListing.price || ''}
                onChange={handleNewListingChange}
                required
                error={!!validationErrors.price}
                helperText={validationErrors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon sx={{ color: 'var(--neon-primary)' }} />
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
            </Grid>

            <Grid >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newListing.isAnonymous || false}
                    onChange={handleCheckboxChange}
                    name="isAnonymous"
                    sx={{
                      color: 'var(--neon-primary)',
                      '&.Mui-checked': {
                        color: 'var(--neon-primary)',
                      },
                    }}
                  />
                }
                label="Publicar anónimamente"
              />
            </Grid>

            <Grid >
              <FormControl
                fullWidth
                required
                error={!!validationErrors.category}
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
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={newListing.category || ''}
                  label="Categoría"
                  onChange={handleNewListingChange}
                >
                  {productCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.category && (
                  <Typography variant="caption" color="error">
                    {validationErrors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid >
              <FormControl
                fullWidth
                required
                disabled={!newListing.category}
                error={!!validationErrors.subcategory}
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
                <InputLabel id="subcategory-label">Subcategoría</InputLabel>
                <Select
                  labelId="subcategory-label"
                  id="subcategory"
                  name="subcategory"
                  value={newListing.subcategory || ''}
                  label="Subcategoría"
                  onChange={handleNewListingChange}
                >
                  {getSubcategories().map((subcategory) => (
                    <MenuItem key={subcategory.value} value={subcategory.value}>
                      {subcategory.label}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.subcategory && (
                  <Typography variant="caption" color="error">
                    {validationErrors.subcategory}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid >
              <FormControl
                fullWidth
                required
                error={!!validationErrors.condition}
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
                <InputLabel id="condition-label">Condición</InputLabel>
                <Select
                  labelId="condition-label"
                  id="condition"
                  name="condition"
                  value={newListing.condition || ''}
                  label="Condición"
                  onChange={handleNewListingChange}
                >
                  {productConditions.map((condition) => (
                    <MenuItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.condition && (
                  <Typography variant="caption" color="error">
                    {validationErrors.condition}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid >
              <Box sx={{ width: '100%' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Disponible hasta (opcional)"
                    value={newListing.endDate || null}
                    onChange={(date) => handleDateChange(date, 'endDate')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
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
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Grid>

            {/* Contact info */}
            <Grid container>
              <Typography variant="h6" sx={{ mb: 1, mt: 2, color: 'var(--neon-primary)' }}>
                Información de Contacto
              </Typography>
              {validationErrors.contactInfo && (
                <Typography variant="caption" color="error" sx={{ ml: 2, mb: 1 }}>
                  {validationErrors.contactInfo}
                </Typography>
              )}
            </Grid>

            <Grid >
              <TextField
                fullWidth
                label="Teléfono (opcional)"
                name="contactInfo.phone"
                value={newListing.contactInfo?.phone || ''}
                onChange={handleNewListingChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: 'var(--neon-primary)' }} />
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
            </Grid>

            <Grid >
              <TextField
                fullWidth
                label="WhatsApp (opcional)"
                name="contactInfo.whatsapp"
                value={newListing.contactInfo?.whatsapp || ''}
                onChange={handleNewListingChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WhatsAppIcon sx={{ color: 'var(--neon-primary)' }} />
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
            </Grid>

            <Grid >
              <TextField
                fullWidth
                label="Email (opcional)"
                name="contactInfo.email"
                type="email"
                value={newListing.contactInfo?.email || ''}
                onChange={handleNewListingChange}
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
            </Grid>

            {/* Location */}
            <Grid container>
              <Typography variant="h6" sx={{ mb: 1, mt: 2, color: 'var(--neon-primary)' }}>
                Ubicación
              </Typography>
              {validationErrors.location && (
                <Typography variant="caption" color="error" sx={{ ml: 2, mb: 1 }}>
                  {validationErrors.location}
                </Typography>
              )}
            </Grid>

            <Grid container>
              <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant={newListing.location?.type === 'campus' ? 'contained' : 'outlined'}
                  onClick={() => handleLocationTypeChange('campus')}
                  startIcon={<LocationOnIcon />}
                  sx={{
                    backgroundColor: newListing.location?.type === 'campus' ? 'var(--neon-primary)' : 'transparent',
                    color: newListing.location?.type === 'campus' ? 'black' : 'var(--neon-primary)',
                    borderColor: 'var(--neon-primary)',
                    '&:hover': {
                      backgroundColor: newListing.location?.type === 'campus' ? 'var(--neon-primary)' : 'rgba(0, 140, 255, 0.1)',
                      color: newListing.location?.type === 'campus' ? 'black' : 'var(--neon-primary)',
                      borderColor: 'var(--neon-primary)',
                    }
                  }}
                >
                  Campus
                </Button>

                <Button
                  variant={newListing.location?.type === 'express' ? 'contained' : 'outlined'}
                  onClick={() => handleLocationTypeChange('express')}
                  startIcon={<LocalShippingIcon />}
                  sx={{
                    backgroundColor: newListing.location?.type === 'express' ? 'var(--neon-primary)' : 'transparent',
                    color: newListing.location?.type === 'express' ? 'black' : 'var(--neon-primary)',
                    borderColor: 'var(--neon-primary)',
                    '&:hover': {
                      backgroundColor: newListing.location?.type === 'express' ? 'var(--neon-primary)' : 'rgba(0, 140, 255, 0.1)',
                      color: newListing.location?.type === 'express' ? 'black' : 'var(--neon-primary)',
                      borderColor: 'var(--neon-primary)',
                    }
                  }}
                >
                  Express
                </Button>
              </Box>

              {newListing.location?.type === 'campus' && (
                <>
                  <FormControl
                    fullWidth
                    required
                    error={!!validationErrors.location}
                    sx={{
                      mb: 2,
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
                    <InputLabel id="location-label">Ubicación</InputLabel>
                    <Select
                      labelId="location-label"
                      id="location.campus"
                      name="location.campus"
                      value={newListing.location?.campus || ''}
                      label="Ubicación"
                      onChange={handleNewListingChange}
                    >
                      {campusLocations.map((location) => (
                        <MenuItem key={location.value} value={location.value}>
                          {location.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialPosition={selectedLocation ?? undefined}
                  />
                </>
              )}

              {newListing.location?.type === 'express' && (
                <TextField
                  fullWidth
                  label="Nombre de la ubicación"
                  name="location.locationName"
                  value={newListing.location?.locationName || ''}
                  onChange={handleNewListingChange}
                  required
                  error={!!validationErrors.location}
                  helperText={validationErrors.location}
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
              )}
            </Grid>

            <Grid container sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleCreateListing}
                sx={{
                  backgroundColor: 'var(--neon-primary)',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: 'var(--neon-primary)',
                    boxShadow: '0 0 10px var(--neon-primary)',
                  },
                }}
              >
                Publicar Anuncio
              </Button>

              <Button
                variant="outlined"
                onClick={() => setCreateDialogOpen(false)}
                sx={{
                  ml: 2,
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(5, 5, 25, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            border: '1px solid var(--neon-primary)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'var(--neon-primary)' }}>
            Filtrar Anuncios
          </Typography>

          <Typography variant="subtitle2" gutterBottom sx={{ color: 'var(--neon-blue)', mt: 2 }}>
            Categoría
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              value={filters.category || 'all'}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                category: e.target.value,
                subcategory: 'all' // Reset subcategory when category changes
              }))}
              displayEmpty
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--neon-primary)',
                },
              }}
            >
              <MenuItem value="all">Todas las categorías</MenuItem>
              {productCategories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {filters.category !== 'all' && (
            <>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'var(--neon-blue)' }}>
                Subcategoría
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Select
                  value={filters.subcategory || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, subcategory: e.target.value }))}
                  displayEmpty
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--neon-primary)',
                    },
                  }}
                >
                  <MenuItem value="all">Todas las subcategorías</MenuItem>
                  {productCategories
                    .find(cat => cat.value === filters.category)
                    ?.subcategories.map((subcategory) => (
                      <MenuItem key={subcategory.value} value={subcategory.value}>
                        {subcategory.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </>
          )}

          <Typography variant="subtitle2" gutterBottom sx={{ color: 'var(--neon-blue)' }}>
            Condición
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              value={filters.condition || 'all'}
              onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
              displayEmpty
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--neon-primary)',
                },
              }}
            >
              <MenuItem value="all">Todas las condiciones</MenuItem>
              {productConditions.map((condition) => (
                <MenuItem key={condition.value} value={condition.value}>
                  {condition.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle2" gutterBottom sx={{ color: 'var(--neon-blue)' }}>
            Ubicación
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              value={filters.locationType || 'all'}
              onChange={(e) => setFilters(prev => ({ ...prev, locationType: e.target.value }))}
              displayEmpty
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--neon-primary)',
                },
              }}
            >
              <MenuItem value="all">Todas las ubicaciones</MenuItem>
              <MenuItem value="campus">Campus</MenuItem>
              <MenuItem value="express">Express</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle2" gutterBottom sx={{ color: 'var(--neon-blue)' }}>
            Rango de precio (colones)
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Mínimo"
              type="number"
              value={filters.priceMin || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                priceMin: e.target.value ? Number(e.target.value) : 0
              }))}
              InputProps={{
                startAdornment: <InputAdornment position="start">₡</InputAdornment>,
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--neon-primary)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--neon-primary)',
                },
              }}
            />
            <TextField
              label="Máximo"
              type="number"
              value={filters.priceMax || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                priceMax: e.target.value ? Number(e.target.value) : null
              }))}
              InputProps={{
                startAdornment: <InputAdornment position="start">₡</InputAdornment>,
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--neon-primary)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--neon-primary)',
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => {
                resetFilters();
                setFilterDialogOpen(false);
              }}
              sx={{
                color: 'var(--neon-red)',
                borderColor: 'var(--neon-red)',
                '&:hover': {
                  borderColor: 'var(--neon-red)',
                  backgroundColor: 'rgba(255, 0, 128, 0.1)',
                },
              }}
            >
              Reiniciar
            </Button>
            <Button
              variant="contained"
              onClick={() => setFilterDialogOpen(false)}
              sx={{
                backgroundColor: 'var(--neon-primary)',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'var(--neon-blue)',
                  boxShadow: '0 0 15px var(--neon-blue)',
                },
              }}
            >
              Aplicar Filtros
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MarketplacePage;

// Render map view with listings
const renderMapView = (filteredListings: Listing[], setSelectedListing: (listing: Listing) => void) => {
  // Filter for campus listings only
  const campusListings = filteredListings.filter(
    listing => listing.location.type === 'campus' && listing.location.position
  );

  // Render express listings separately below the map
  const expressListings = filteredListings.filter(
    listing => listing.location.type === 'express'
  );

  return (
    <Box>
      <Box sx={{ height: 500, width: '100%', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <MapContainer
          center={UCR_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {campusListings.map(listing => (
            listing.location.position && (
              <Marker
                key={listing._id}
                position={listing.location.position}
                icon={createMarkerIcon(listing.category)}
              >
                <Popup>
                  <Box sx={{ p: 1, minWidth: 200 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {listing.title}
                    </Typography>

                    <Typography variant="body2" fontWeight="bold" color="var(--neon-green)">
                      ₡{listing.price.toLocaleString()}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: '0.875rem' }}>
                      <LocationOnIcon sx={{ fontSize: 'small', mr: 1, color: 'var(--neon-primary)' }} />
                      {listing.location.locationName}
                    </Box>

                    <Box sx={{ mt: 1 }}>
                      <Chip
                        size="small"
                        label={getCategoryLabel(listing.category)}
                        sx={{
                          backgroundColor: 'rgba(0, 140, 255, 0.2)',
                          border: '1px solid var(--neon-blue)',
                          color: 'var(--neon-blue)',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>

                    <Button
                      fullWidth
                      size="small"
                      onClick={() => handleViewListing(listing._id, setSelectedListing)}
                      sx={{
                        mt: 1.5,
                        color: 'var(--neon-primary)',
                        borderColor: 'var(--neon-primary)',
                        '&:hover': {
                          borderColor: 'var(--neon-blue)',
                          color: 'var(--neon-blue)'
                        }
                      }}
                      variant="outlined"
                    >
                      Ver Detalles
                    </Button>
                  </Box>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </Box>

      {/* Express listings section */}
      {expressListings.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <LocalShippingIcon sx={{ mr: 1, color: 'var(--neon-primary)' }} />
            Anuncios con Entrega Express
          </Typography>

          <Grid container spacing={2}>
            {expressListings.map(listing => (
              <Grid container key={listing._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    boxShadow: '0 0 5px rgba(0, 255, 255, 0.3)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 12px rgba(0, 255, 255, 0.2)'
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => handleViewListing(listing._id, setSelectedListing)}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {listing.title}
                    </Typography>

                    <Typography variant="body2" fontWeight="bold" color="var(--neon-green)">
                      ₡{listing.price.toLocaleString()}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: '0.875rem' }}>
                      <LocationOnIcon sx={{ fontSize: 'small', mr: 1, color: 'var(--neon-primary)' }} />
                      {listing.location.locationName || 'Entrega Express'}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Chip
                        size="small"
                        label={getCategoryLabel(listing.category)}
                        sx={{
                          backgroundColor: 'rgba(0, 140, 255, 0.2)',
                          border: '1px solid var(--neon-blue)',
                          color: 'var(--neon-blue)',
                          fontSize: '0.7rem'
                        }}
                      />

                      <Typography variant="caption" color="text.secondary">
                        {formatRelativeTime(listing.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

// Format relative time (e.g., "2 days ago")
const formatRelativeTime = (date: Date | string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Get category label from value
const getCategoryLabel = (categoryValue: string) => {
  const category = productCategories.find(cat => cat.value === categoryValue);
  return category ? category.label : categoryValue;
};

// Handle selecting a listing to view
const handleViewListing = async (listingId: string, setSelectedListing: (listing: Listing) => void) => {
  try {
    const listing = await marketplaceApi.fetchListingById(listingId);
    setSelectedListing(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
  }
};
