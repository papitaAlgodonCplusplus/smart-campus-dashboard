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
import { v4 as uuidv4 } from 'uuid';
import { Link as RouterLink } from 'react-router-dom';

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

// Interface for Listing data
interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  condition: string;
  location: {
    campus: string;
    type: 'campus' | 'express';
    position?: [number, number];
    locationName?: string;
  };
  photos: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  isAnonymous: boolean;
  startDate: Date;
  endDate?: Date;
  createdBy: {
    id: string;
    name: string;
    faculty: string;
  };
  createdAt: Date;
  status: 'active' | 'sold' | 'reserved' | 'expired';
  views: number;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
}

// Product Categories
const productCategories = [
  {
    value: 'books',
    label: 'Libros y Material Académico',
    subcategories: [
      { value: 'textbooks', label: 'Libros de Texto' },
      { value: 'notes', label: 'Apuntes y Guías' },
      { value: 'materials', label: 'Materiales de Estudio' },
      { value: 'equipment', label: 'Equipo de Laboratorio' },
      { value: 'other_books', label: 'Otros' }
    ]
  },
  {
    value: 'electronics',
    label: 'Electrónicos',
    subcategories: [
      { value: 'computers', label: 'Computadoras y Laptops' },
      { value: 'phones', label: 'Teléfonos y Tablets' },
      { value: 'accessories', label: 'Accesorios' },
      { value: 'other_electronics', label: 'Otros' }
    ]
  },
  {
    value: 'clothing',
    label: 'Ropa y Accesorios',
    subcategories: [
      { value: 'shirts', label: 'Camisetas y Tops' },
      { value: 'pants', label: 'Pantalones' },
      { value: 'shoes', label: 'Zapatos' },
      { value: 'accessories_clothing', label: 'Accesorios' },
      { value: 'other_clothing', label: 'Otros' }
    ]
  },
  {
    value: 'furniture',
    label: 'Muebles',
    subcategories: [
      { value: 'desks', label: 'Escritorios' },
      { value: 'chairs', label: 'Sillas' },
      { value: 'beds', label: 'Camas' },
      { value: 'storage', label: 'Almacenamiento' },
      { value: 'other_furniture', label: 'Otros' }
    ]
  },
  {
    value: 'services',
    label: 'Servicios',
    subcategories: [
      { value: 'tutoring', label: 'Tutoría/Clases' },
      { value: 'transportation', label: 'Transporte' },
      { value: 'tech_support', label: 'Soporte Técnico' },
      { value: 'design', label: 'Diseño Gráfico' },
      { value: 'other_services', label: 'Otros' }
    ]
  },
  {
    value: 'tickets',
    label: 'Entradas y Eventos',
    subcategories: [
      { value: 'concerts', label: 'Conciertos' },
      { value: 'sports', label: 'Deportes' },
      { value: 'workshops', label: 'Talleres' },
      { value: 'other_tickets', label: 'Otros' }
    ]
  },
  {
    value: 'housing',
    label: 'Alojamiento',
    subcategories: [
      { value: 'room_rent', label: 'Alquiler de Habitación' },
      { value: 'apartment_rent', label: 'Alquiler de Apartamento' },
      { value: 'roommates', label: 'Búsqueda de Compañeros' },
      { value: 'other_housing', label: 'Otros' }
    ]
  },
  {
    value: 'other',
    label: 'Otros',
    subcategories: [
      { value: 'general', label: 'General' }
    ]
  }
];

// Product Conditions
const productConditions = [
  { value: 'new', label: 'Nuevo' },
  { value: 'like_new', label: 'Como Nuevo' },
  { value: 'good', label: 'Buen Estado' },
  { value: 'fair', label: 'Estado Regular' },
  { value: 'poor', label: 'Necesita Reparación' },
  { value: 'not_applicable', label: 'No Aplica' }
];

// Campus Locations
const campusLocations = [
  { value: 'engineering', label: 'Facultad de Ingeniería' },
  { value: 'science', label: 'Facultad de Ciencias' },
  { value: 'arts', label: 'Facultad de Artes' },
  { value: 'law', label: 'Facultad de Derecho' },
  { value: 'medicine', label: 'Facultad de Medicina' }
];

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

// Generate sample user
const sampleUser = {
  id: '1',
  name: 'Usuario Actual',
  faculty: 'Facultad de Ingeniería'
};

// Generate sample listings
const generateSampleListings = (): Listing[] => {
  const listings: Listing[] = [];

  // Sample listings
  listings.push({
    id: uuidv4(),
    title: 'Libro Cálculo I - Stewart 8va Edición',
    description: 'Libro en excelente estado, usado solo un semestre. Incluye solucionario y acceso a material en línea.',
    price: 20000,
    category: 'books',
    subcategory: 'textbooks',
    condition: 'good',
    location: {
      campus: 'Facultad de Ciencias',
      type: 'campus',
      position: [9.9376, -84.0510],
      locationName: 'Facultad de Ciencias'
    },
    photos: ['/images/default.jpg'],
    contactInfo: {
      email: 'usuario@ucr.ac.cr',
      whatsapp: '70001234'
    },
    isAnonymous: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    createdBy: {
      id: '1',
      name: 'Carlos Rodríguez',
      faculty: 'Facultad de Ciencias'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'active',
    views: 45,
    likes: 5,
    isLiked: false,
    isSaved: true
  });

  listings.push({
    id: uuidv4(),
    title: 'MacBook Pro 2019 - 13"',
    description: 'MacBook Pro en excelente estado. 8GB RAM, 256GB SSD, procesador i5. Incluye cargador original y funda protectora.',
    price: 350000,
    category: 'electronics',
    subcategory: 'computers',
    condition: 'like_new',
    location: {
      campus: 'Facultad de Ingeniería',
      type: 'campus',
      position: [9.9385, -84.0515],
      locationName: 'Biblioteca Carlos Monge'
    },
    photos: ['/images/default.jpg'],
    contactInfo: {
      phone: '2222-3333',
      email: 'maria@ucr.ac.cr'
    },
    isAnonymous: false,
    startDate: new Date(),
    createdBy: {
      id: '2',
      name: 'María González',
      faculty: 'Facultad de Ingeniería'
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: 'active',
    views: 120,
    likes: 12,
    isLiked: true,
    isSaved: false
  });

  listings.push({
    id: uuidv4(),
    title: 'Clases particulares de Programación',
    description: 'Ofrezco clases de programación en Java, Python, y C++. Experiencia como asistente del curso. Horarios flexibles.',
    price: 7000,
    category: 'services',
    subcategory: 'tutoring',
    condition: 'not_applicable',
    location: {
      campus: 'Facultad de Ingeniería',
      type: 'express',
      locationName: 'Virtual / A domicilio'
    },
    photos: ['/images/default.jpg'],
    contactInfo: {
      whatsapp: '8888-9999',
      email: 'tutor@ucr.ac.cr'
    },
    isAnonymous: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    createdBy: {
      id: '3',
      name: 'Anónimo',
      faculty: 'Facultad de Ingeniería'
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    status: 'active',
    views: 78,
    likes: 8,
    isLiked: false,
    isSaved: false
  });

  listings.push({
    id: uuidv4(),
    title: 'Mesa de estudio',
    description: 'Mesa de estudio en buen estado. Dimensiones: 120x60cm. Color madera clara. Se entrega desarmada.',
    price: 15000,
    category: 'furniture',
    subcategory: 'desks',
    condition: 'good',
    location: {
      campus: 'Facultad de Arquitectura',
      type: 'campus',
      position: [9.9365, -84.0530],
      locationName: 'Residencias Estudiantiles'
    },
    photos: ['/images/default.jpg'],
    contactInfo: {
      phone: '7777-8888'
    },
    isAnonymous: false,
    startDate: new Date(),
    createdBy: {
      id: '4',
      name: 'Pedro Mora',
      faculty: 'Facultad de Arquitectura'
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: 'active',
    views: 32,
    likes: 3,
    isLiked: false,
    isSaved: false
  });

  // Add more listings with different categories, conditions, and locations
  listings.push({
    id: uuidv4(),
    title: 'Habitación para estudiante cerca del campus',
    description: 'Ofrezco habitación amueblada con baño privado, internet y servicios incluidos. A 5 minutos caminando de la universidad.',
    price: 120000,
    category: 'housing',
    subcategory: 'room_rent',
    condition: 'not_applicable',
    location: {
      campus: 'San Pedro',
      type: 'express',
      locationName: 'San Pedro, 500m oeste de la UCR'
    },
    photos: ['/images/default.jpg'],
    contactInfo: {
      phone: '6666-7777',
      whatsapp: '6666-7777'
    },
    isAnonymous: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    createdBy: {
      id: '5',
      name: 'Ana Jiménez',
      faculty: 'Administración'
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'active',
    views: 89,
    likes: 15,
    isLiked: true,
    isSaved: true
  });

  return listings;
};

// Main MarketplacePage Component
const MarketplacePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [listings, setListings] = useState<Listing[]>(generateSampleListings());
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSubcategory, setFilterSubcategory] = useState<string>('all');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterPriceRange, setFilterPriceRange] = useState<[number, number | null]>([0, null]);
  const [savedOnly, setSavedOnly] = useState(false);

  // New listing form state
  const [newListing, setNewListing] = useState<Partial<Listing>>({
    title: '',
    description: '',
    price: 0,
    category: '',
    subcategory: '',
    condition: '',
    location: {
      type: 'campus',
      campus: ''
    },
    photos: [],
    contactInfo: {},
    isAnonymous: false,
    startDate: new Date(),
    createdBy: sampleUser
  });

  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter and sort listings based on current criteria
  useEffect(() => {
    let filtered = [...listings];

    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        listing =>
          listing.title.toLowerCase().includes(searchLower) ||
          listing.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(listing => listing.category === filterCategory);

      // Apply subcategory filter if category is selected
      if (filterSubcategory !== 'all') {
        filtered = filtered.filter(listing => listing.subcategory === filterSubcategory);
      }
    }

    // Apply condition filter
    if (filterCondition !== 'all') {
      filtered = filtered.filter(listing => listing.condition === filterCondition);
    }

    // Apply location filter
    if (filterLocation !== 'all') {
      filtered = filtered.filter(listing => listing.location.type === filterLocation);
    }

    // Apply price range filter
    filtered = filtered.filter(listing => {
      if (filterPriceRange[0] > 0 && listing.price < filterPriceRange[0]) {
        return false;
      }
      if (filterPriceRange[1] !== null && listing.price > filterPriceRange[1]) {
        return false;
      }
      return true;
    });

    // Apply saved only filter
    if (savedOnly) {
      filtered = filtered.filter(listing => listing.isSaved);
    }

    // Sort listings
    switch (sortOption) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    setFilteredListings(filtered);
  }, [
    listings,
    searchTerm,
    filterCategory,
    filterSubcategory,
    filterCondition,
    filterLocation,
    filterPriceRange,
    sortOption,
    savedOnly
  ]);

  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Reset filters
  const resetFilters = () => {
    setFilterCategory('all');
    setFilterSubcategory('all');
    setFilterCondition('all');
    setFilterLocation('all');
    setFilterPriceRange([0, null]);
    setSavedOnly(false);
    setSearchTerm('');
    setSortOption('newest');
  };

  // Toggle like on a listing
  const toggleLike = (id: string) => {
    setListings(prev =>
      prev.map(listing => {
        if (listing.id === id) {
          const newIsLiked = !listing.isLiked;
          return {
            ...listing,
            isLiked: newIsLiked,
            likes: newIsLiked ? listing.likes + 1 : listing.likes - 1
          };
        }
        return listing;
      })
    );
  };

  // Toggle save on a listing
  const toggleSave = (id: string) => {
    setListings(prev =>
      prev.map(listing => {
        if (listing.id === id) {
          return {
            ...listing,
            isSaved: !listing.isSaved
          };
        }
        return listing;
      })
    );
  };

  // Handle selecting a listing to view
  const handleViewListing = (listing: Listing) => {
    // Increment views count
    setListings(prev =>
      prev.map(item => {
        if (item.id === listing.id) {
          return {
            ...item,
            views: item.views + 1
          };
        }
        return item;
      })
    );

    setSelectedListing(listing);
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
        type: 'campus',
        campus: prev.location?.campus || '',
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
    if (newListing.location?.type === 'campus' && !newListing.location.position) {
      errors.location = 'Debe seleccionar una ubicación en el mapa';
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
  const handleCreateListing = () => {
    if (!validateNewListing()) {
      setSnackbar({
        open: true,
        message: 'Por favor corrija los errores en el formulario',
        severity: 'error'
      });
      return;
    }

    // Create new listing object
    const newListingObj: Listing = {
      id: uuidv4(),
      title: newListing.title || '',
      description: newListing.description || '',
      price: newListing.price || 0,
      category: newListing.category || 'other',
      subcategory: newListing.subcategory || 'general',
      condition: newListing.condition || 'not_applicable',
      location: newListing.location as Listing['location'],
      photos: newListing.photos || [],
      contactInfo: newListing.contactInfo || {},
      isAnonymous: newListing.isAnonymous || false,
      startDate: newListing.startDate || new Date(),
      endDate: newListing.endDate,
      createdBy: {
        id: sampleUser.id,
        name: newListing.isAnonymous ? 'Anónimo' : sampleUser.name,
        faculty: sampleUser.faculty
      },
      createdAt: new Date(),
      status: 'active',
      views: 0,
      likes: 0,
      isLiked: false,
      isSaved: false
    };

    // Add new listing to the list
    setListings(prev => [newListingObj, ...prev]);

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
      category: '',
      subcategory: '',
      condition: '',
      location: {
        campus: '',
        type: 'campus'
      },
      photos: [],
      contactInfo: {},
      isAnonymous: false,
      startDate: new Date(),
      createdBy: sampleUser
    });
    setSelectedLocation(null);
  };

  // Handle deleting a listing
  const handleDeleteListing = (id: string) => {
    setListings(prev => prev.filter(listing => listing.id !== id));

    if (selectedListing?.id === id) {
      setSelectedListing(null);
    }

    setSnackbar({
      open: true,
      message: 'Anuncio eliminado exitosamente',
      severity: 'success'
    });
  };

  // Format date string
  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy');
  };

  // Format relative time (e.g., "2 days ago")
  const formatRelativeTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Get category label from value
  const getCategoryLabel = (categoryValue: string) => {
    const category = productCategories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
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

  // Render listing cards for grid view
  const renderListingCards = () => {
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
          <Grid container key={listing.id}>
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
                onClick={() => handleViewListing(listing)}
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
                    onClick={() => toggleLike(listing.id)}
                    sx={{ color: listing.isLiked ? 'var(--neon-red)' : 'white' }}
                  >
                    {listing.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
                    {listing.likes}
                  </Typography>
                </Box>

                <Box>
                  <IconButton
                    size="small"
                    onClick={() => toggleSave(listing.id)}
                    sx={{ color: listing.isSaved ? 'var(--neon-primary)' : 'white' }}
                  >
                    {listing.isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => handleViewListing(listing)}
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

  // Render map view with listings
  const renderMapView = () => {
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
                  key={listing.id}
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
                        onClick={() => handleViewListing(listing)}
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
                <Grid container key={listing.id}>
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
                    onClick={() => handleViewListing(listing)}
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
            value={searchTerm}
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
              value={sortOption}
              label="Ordenar"
              onChange={(e) => setSortOption(e.target.value)}
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
      {(filterCategory !== 'all' ||
        filterSubcategory !== 'all' ||
        filterCondition !== 'all' ||
        filterLocation !== 'all' ||
        filterPriceRange[0] > 0 ||
        filterPriceRange[1] !== null ||
        savedOnly) && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {filterCategory !== 'all' && (
              <Chip
                label={`Categoría: ${getCategoryLabel(filterCategory)}`}
                onDelete={() => setFilterCategory('all')}
                sx={{
                  backgroundColor: 'rgba(0, 140, 255, 0.2)',
                  color: 'var(--neon-blue)',
                  borderColor: 'var(--neon-blue)'
                }}
              />
            )}

            {filterSubcategory !== 'all' && (
              <Chip
                label={`Subcategoría: ${getSubcategoryLabel(filterCategory, filterSubcategory)}`}
                onDelete={() => setFilterSubcategory('all')}
                sx={{
                  backgroundColor: 'rgba(0, 140, 255, 0.2)',
                  color: 'var(--neon-blue)',
                  borderColor: 'var(--neon-blue)'
                }}
              />
            )}

            {filterCondition !== 'all' && (
              <Chip
                label={`Condición: ${getConditionLabel(filterCondition)}`}
                onDelete={() => setFilterCondition('all')}
                sx={{
                  backgroundColor: 'rgba(0, 255, 128, 0.2)',
                  color: 'var(--neon-green)',
                  borderColor: 'var(--neon-green)'
                }}
              />
            )}

            {filterLocation !== 'all' && (
              <Chip
                label={`Ubicación: ${filterLocation === 'campus' ? 'Campus' : 'Express'}`}
                onDelete={() => setFilterLocation('all')}
                sx={{
                  backgroundColor: 'rgba(255, 0, 255, 0.2)',
                  color: 'var(--neon-secondary)',
                  borderColor: 'var(--neon-secondary)'
                }}
              />
            )}

            {(filterPriceRange[0] > 0 || filterPriceRange[1] !== null) && (
              <Chip
                label={`Precio: ${filterPriceRange[0]} - ${filterPriceRange[1] ? filterPriceRange[1] : 'Max'}`}
                onDelete={() => setFilterPriceRange([0, null])}
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
      {tabValue === 0 ? renderListingCards() : renderMapView()}

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
                  onClick={() => toggleLike(selectedListing.id)}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: selectedListing.isLiked ? 'var(--neon-red)' : 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }
                  }}
                >
                  {selectedListing.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>

                <IconButton
                  onClick={() => toggleSave(selectedListing.id)}
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

                      {selectedListing.createdBy.id === sampleUser.id && (
                        <IconButton
                          color="error"
                          aria-label="delete listing"
                          onClick={() => {
                            handleDeleteListing(selectedListing.id);
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
                    borderColor: newListing.location?.type === 'campus' ? 'var(--neon-primary)' : 'var(--neon-primary)',
                    '&:hover': {
                      backgroundColor: newListing.location?.type === 'campus' ? 'var(--neon-primary)' : 'rgba(0, 140, 255, 0.1)',
                      color: newListing.location?.type === 'campus' ? 'black' : 'var(--neon-primary)',
                      borderColor: newListing.location?.type === 'campus' ? 'var(--neon-primary)' : 'var(--neon-primary)',
                    },
                    '&.MuiButton-outlined': {
                      borderColor: 'var(--neon-primary)',
                    },
                    '&.MuiButton-contained': {
                      backgroundColor: 'var(--neon-primary)',
                      color: 'black',
                    },
                  }}
                >
                  Campus
                </Button>

                <Button
                  variant={newListing.location?.type === 'express' ? 'contained' : 'outlined'}
                  onClick={() => handleLocationTypeChange('express')}
                  startIcon={<MapIcon />}
                  sx={{
                    backgroundColor: newListing.location?.type === 'express' ? 'var(--neon-primary)' : 'transparent',
                    color: newListing.location?.type === 'express' ? 'black' : 'var(--neon-primary)',
                    borderColor: newListing.location?.type === 'express' ? 'var(--neon-primary)' : 'var(--neon-primary)',
                    '&:hover': {
                      backgroundColor: newListing.location?.type === 'express' ? 'var(--neon-primary)' : 'rgba(0, 140, 255, 0.1)',
                      color: newListing.location?.type === 'express' ? 'black' : 'var(--neon-primary)',
                      borderColor: newListing.location?.type === 'express' ? 'var(--neon-primary)' : 'var(--neon-primary)',
                    },
                    '&.MuiButton-outlined': {
                      borderColor: 'var(--neon-primary)',
                    },
                    '&.MuiButton-contained': {
                      backgroundColor: 'var(--neon-primary)',
                      color: 'black',
                    },
                  }}

                >
                  Personalizada

                </Button>
              </Box>

              {newListing.location?.type === 'campus' && (
                <FormControl
                  fullWidth
                  required
                  error={!!validationErrors.location}
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
                  <InputLabel id="location-label">Ubicación</InputLabel>
                  <Select
                    labelId="location-label"
                    id="location"
                    name="location"
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
                  {validationErrors.location && (
                    <Typography variant="caption" color="error">
                      {validationErrors.location}
                    </Typography>
                  )}
                </FormControl>
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

              {newListing.location?.type === 'express' && (
                <Box sx={{ mt: 2, height: 200, borderRadius: '8px', overflow: 'hidden' }}>
                  <MapContainer
                    center={newListing.location?.position || [9.9281, -84.0907]} // Default to Costa Rica coordinates
                    zoom={16}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {newListing.location?.position && (
                      <Marker position={newListing.location.position}>
                        <Popup>{newListing.location.locationName}</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </Box>
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

            </Grid>

          </Grid>

        </Box>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 10000 }}
        message={snackbar.message}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbar({ ...snackbar, open: false })}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        ContentProps={{
          sx: {
            backgroundColor: snackbar.severity === 'error' ? 'var(--neon-red)' : 'var(--neon-green)',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
          },
        }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default MarketplacePage;