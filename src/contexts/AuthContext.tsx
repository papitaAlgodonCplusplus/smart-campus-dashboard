import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Auth components
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ProfilePage from '../pages/Auth/ProfilePage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// User interface
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  faculty: string;
  role: 'student' | 'admin';
  profilePicture: string | null;
  createdAt: string;
  lastLogin: string;
  token?: string;
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
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          setToken(storedToken);
          
          // Set authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } catch (error) {
          // Clear invalid storage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }

      setLoading(false);
      setInitialAuthCheckDone(true);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const userData = response.data;

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);

      // Set user state and token
      setUser(userData);
      setToken(userData.token);

      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;

      setLoading(false);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Error en el inicio de sesión');
      } else {
        setError('Error de conexión. Intente nuevamente.');
      }
      setLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (data: RegistrationData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      const userData = response.data;

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);

      // Set user state and token
      setUser(userData);
      setToken(userData.token);

      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;

      setLoading(false);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Error en el registro');
      } else {
        setError('Error de conexión. Intente nuevamente.');
      }
      setLoading(false);
      return false;
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.put(`${API_URL}/auth/profile`, userData, config);
      const updatedUser = response.data;

      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (updatedUser.token) {
        localStorage.setItem('token', updatedUser.token);
        setToken(updatedUser.token);
      }

      // Update user state
      setUser(updatedUser);

      setLoading(false);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Error al actualizar el perfil');
      } else {
        setError('Error de conexión. Intente nuevamente.');
      }
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Remove user from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset state
    setUser(null);
    setToken(null);
    
    // Note: Navigation to login page will be handled by the RequireAuth component
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Compute isAuthenticated
  const isAuthenticated = !!user && !!token;

  // Provide the context
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading: loading && !initialAuthCheckDone,
        error,
        login,
        register,
        logout,
        clearError,
        updateProfile
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
  const location = useLocation();

  if (loading) {
    // Show loading indicator if still checking auth
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--dark-bg)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(0, 0, 0, 0.1)',
          borderTop: '3px solid var(--neon-primary)',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

// Export all auth components
export { LoginPage, RegisterPage, ProfilePage, ResetPasswordPage };