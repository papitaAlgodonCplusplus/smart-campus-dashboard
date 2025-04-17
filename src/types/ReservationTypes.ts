import { Space } from '../components/Dashboard/DashboardContext';

// Reservation model
export interface Reservation {
  id: string;
  spaceId: string;
  spaceName: string;
  date: string; // ISO format date string
  startTime: string; // Format: HH:MM (24-hour)
  endTime: string; // Format: HH:MM (24-hour)
  isAnonymous: boolean;
  userId: string | null; // Null if anonymous
  userName: string | null; // Null if anonymous
  createdAt: string; // ISO format date string
}

// Form data for creating a reservation
export interface ReservationFormData {
  spaces: string[]; // Array of space IDs
  date: string;
  startTime: string;
  endTime: string;
  isAnonymous: boolean;
  userName: string;
}

// Context interface for reservations
export interface ReservationsContextData {
  reservations: Reservation[];
  addReservation: (formData: ReservationFormData) => void;
  deleteReservation: (id: string) => void;
  getUserReservations: (userName: string) => Reservation[];
  getSpaceReservations: (spaceId: string) => Reservation[];
  getAvailableTimeSlots: (spaceId: string, date: string) => { start: string; end: string }[];
  getReservedTimeSlots: (spaceId: string, date: string) => { start: string; end: string }[];
  isTimeSlotAvailable: (spaceId: string, date: string, startTime: string, endTime: string) => boolean;
}