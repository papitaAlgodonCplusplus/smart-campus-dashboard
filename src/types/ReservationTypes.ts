export interface Reservation {
  id: string;
  spaceId: string;
  spaceName: string;
  date: string;
  startTime: string;
  endTime: string;
  isAnonymous: boolean;
  userId: string | null;
  userName: string | null;
  createdAt: string;
}

export interface ReservationFormData {
  spaces: string[];
  date: string;
  startTime: string;
  endTime: string;
  isAnonymous: boolean;
  userName: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}