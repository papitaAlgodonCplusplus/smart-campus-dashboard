// Listing Category Types
export type ListingCategory = 
  | 'books' 
  | 'electronics' 
  | 'clothing' 
  | 'furniture' 
  | 'services' 
  | 'tickets' 
  | 'housing' 
  | 'other';

// Listing Subcategory Types
export interface CategorySubcategories {
  [key: string]: { value: string; label: string }[];
}

// Listing Condition Types
export type ListingCondition = 
  | 'new' 
  | 'like_new' 
  | 'good' 
  | 'fair' 
  | 'poor' 
  | 'not_applicable';

// Location Type
export type LocationType = 'campus' | 'express';

// Location Interface
export interface ListingLocation {
  type: LocationType;
  campus?: string;
  position?: [number, number];
  locationName?: string;
}

// Contact Info Interface
export interface ContactInfo {
  phone?: string;
  email?: string;
  whatsapp?: string;
}

// Creator Info Interface
export interface CreatorInfo {
  id: string;
  name: string;
  faculty: string;
}

// Listing Status Type
export type ListingStatus = 'active' | 'sold' | 'reserved' | 'expired';

// Main Listing Interface
export interface Listing {
  id: string;
  _id: string;
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  subcategory: string;
  condition: ListingCondition;
  location: ListingLocation;
  photos: string[];
  contactInfo: ContactInfo;
  isAnonymous: boolean;
  startDate: Date;
  endDate?: Date;
  createdBy: CreatorInfo;
  createdAt: Date;
  updatedAt: Date;
  status: ListingStatus;
  views: number;
  likes: number;
  isLiked: boolean;
  likedBy: string[];
  isSaved: boolean;
  savedBy: string[];
}

// Form data for creating/updating listings
export interface ListingFormData {
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  subcategory: string;
  condition: ListingCondition;
  location: ListingLocation;
  photos?: string[];
  contactInfo: ContactInfo;
  isAnonymous: boolean;
  startDate?: Date;
  endDate?: Date;
  status?: ListingStatus;
}

// Filter options for listings
export interface ListingFilters {
  category?: string;
  subcategory?: string;
  condition?: string;
  locationType?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular';
  search?: string;
}

// Product Categories Data Structure
export const productCategories = [
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

// Product Conditions Data Structure
export const productConditions = [
  { value: 'new', label: 'Nuevo' },
  { value: 'like_new', label: 'Como Nuevo' },
  { value: 'good', label: 'Buen Estado' },
  { value: 'fair', label: 'Estado Regular' },
  { value: 'poor', label: 'Necesita Reparación' },
  { value: 'not_applicable', label: 'No Aplica' }
];

// Campus Locations Data Structure
export const campusLocations = [
  { value: 'engineering', label: 'Facultad de Ingeniería' },
  { value: 'science', label: 'Facultad de Ciencias' },
  { value: 'arts', label: 'Facultad de Artes' },
  { value: 'law', label: 'Facultad de Derecho' },
  { value: 'medicine', label: 'Facultad de Medicina' }
];