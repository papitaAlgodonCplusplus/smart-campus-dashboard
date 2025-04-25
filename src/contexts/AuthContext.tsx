import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Auth components
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ProfilePage from '../pages/Auth/ProfilePage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';

// User interface
interface User {
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

// Login credentials interface
interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data interface
interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  faculty: string;
  password: string;
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Auth context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegistrationData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: !!localStorage.getItem('auth_token'),
    loading: false,
    error: null
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUserProfile();
    }
  }, []);
  
  // Mock fetch user profile function
  const fetchUserProfile = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get user email from localStorage
      const email = localStorage.getItem('user_email') || '';
      const role = localStorage.getItem('user_role') as 'student' | 'admin' || 'student';
      
      // Get registered user data if available
      let userData: Partial<User> = {
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email,
        studentId: 'B12345678',
        faculty: 'Facultad de Ingeniería',
        role,
        profilePicture: null,
        createdAt: '2023-09-15T10:30:00Z',
        lastLogin: new Date().toISOString()
      };
      
      const registeredUser = localStorage.getItem('registered_user');
      if (registeredUser) {
        const parsedUser = JSON.parse(registeredUser);
        userData = {
          ...userData,
          ...parsedUser,
          role
        };
      }
      
      setAuthState({
        user: {
          id: '1',
          ...userData
        } as User,
        token: localStorage.getItem('auth_token'),
        isAuthenticated: true,
        loading: false,
        error: null
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar datos del usuario',
        isAuthenticated: false,
        user: null
      }));
      localStorage.removeItem('auth_token');
    }
  };
  
  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simple validation
      if (!credentials.email || !credentials.password) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Todos los campos son requeridos'
        }));
        return false;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate mock credentials
      if (
        (credentials.email === 'student@ucr.ac.cr' && credentials.password === 'password123') ||
        (credentials.email === 'admin@ucr.ac.cr' && credentials.password === 'admin123')
      ) {
        const isAdmin = credentials.email === 'admin@ucr.ac.cr';
        
        // Set token and user data
        localStorage.setItem('auth_token', 'mock_jwt_token');
        localStorage.setItem('user_email', credentials.email);
        localStorage.setItem('user_role', isAdmin ? 'admin' : 'student');
        
        // Fetch user profile
        await fetchUserProfile();
        
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Credenciales inválidas'
        }));
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al iniciar sesión'
      }));
      return false;
    }
  };
  
  // Register function
  const register = async (data: RegistrationData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simple validation
      if (!data.email.endsWith('@ucr.ac.cr')) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Debe utilizar un correo institucional (@ucr.ac.cr)'
        }));
        return false;
      }
      
      if (data.password.length < 8) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'La contraseña debe tener al menos 8 caracteres'
        }));
        return false;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user data (this would normally go to a database)
      localStorage.setItem('registered_user', JSON.stringify(data));
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: null
      }));
      
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Error durante el registro'
      }));
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    
    // Reset auth state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
    
    // Redirect to login
    navigate('/login');
  };
  
  // Clear error
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };
  
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth guard component to protect routes
export const RequireAuth: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: 'var(--dark-bg)'
        }}
      >
        <CircularProgress sx={{ color: 'var(--neon-primary)' }} />
      </Box>
    );
  }
  
  return isAuthenticated ? <>{children}</> : null;
};

// Export all auth components
export { LoginPage, RegisterPage, ProfilePage, ResetPasswordPage };