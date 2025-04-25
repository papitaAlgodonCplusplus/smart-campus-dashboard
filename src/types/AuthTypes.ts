
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  faculty: string;
  role: 'student' | 'admin';
  profilePicture: string | null;
  createdAt: string;
  lastLogin: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  faculty: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
