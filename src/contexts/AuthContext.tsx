import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userEmail = localStorage.getItem('user_email');
      const userRole = localStorage.getItem('user_role');

      if (token && userEmail) {
        // Mock user data based on stored email and role
        const mockUserData: User = {
          firstName: 'Usuario',
          lastName: 'UCR',
          email: userEmail,
          role: userRole === 'student' || userRole === 'admin' ? userRole : 'student',
          lastLogin: new Date().toISOString(),
          createdAt: '2023-01-01T00:00:00Z',
          id: '',
          studentId: '',
          faculty: '',
          profilePicture: null
        };

        // If it's the admin account, set admin data
        if (userEmail === 'admin@ucr.ac.cr') {
          mockUserData.firstName = 'Admin';
          mockUserData.lastName = 'UCR';
          mockUserData.faculty = 'Administración';
          mockUserData.studentId = 'A00000';
        } else {
          // Regular student
          mockUserData.firstName = 'Estudiante';
          mockUserData.lastName = 'UCR';
          mockUserData.faculty = 'Ingeniería';
          mockUserData.studentId = 'B12345';
        }

        setUser(mockUserData);
      }

      setLoading(false);
      setInitialAuthCheckDone(true);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const { email, password } = credentials;
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock login validation
      if (email === 'student@ucr.ac.cr' && password === 'password123') {
        const mockUserData: User = {
          firstName: 'Estudiante',
          lastName: 'UCR',
          email: email,
          studentId: 'B12345',
          faculty: 'Ingeniería',
          role: 'student',
          lastLogin: new Date().toISOString(),
          createdAt: '2023-01-01T00:00:00Z',
          id: '',
          profilePicture: null
        };

        // Store auth data
        localStorage.setItem('auth_token', 'mock_jwt_token');
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_role', 'student');

        setUser(mockUserData);
        setLoading(false);
        return true;
      }

      // Mock admin login
      if (email === 'admin@ucr.ac.cr' && password === 'admin123') {
        const mockUserData: User = {
          firstName: 'Admin',
          lastName: 'UCR',
          email: email,
          studentId: 'A00000',
          faculty: 'Administración',
          role: 'admin',
          lastLogin: new Date().toISOString(),
          createdAt: '2022-01-01T00:00:00Z',
          id: '',
          profilePicture: null
        };

        // Store auth data
        localStorage.setItem('auth_token', 'mock_admin_jwt_token');
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_role', 'admin');

        setUser(mockUserData);
        setLoading(false);
        return true;
      }

      // Login failed
      setError('Credenciales inválidas');
      setLoading(false);
      return false;
    } catch (error) {
      setError('Error de conexión. Intente nuevamente.');
      setLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (data: RegistrationData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if email is already registered (mock validation)
      if (data.email === 'student@ucr.ac.cr' || data.email === 'admin@ucr.ac.cr') {
        setError('Este correo electrónico ya está registrado');
        setLoading(false);
        return false;
      }

      // Mock successful registration
      setLoading(false);
      return true;
    } catch (error) {
      setError('Error durante el registro. Intente nuevamente.');
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    setUser(null);
    // Note: Navigation to login page will be handled by the RequireAuth component
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Compute isAuthenticated
  const isAuthenticated = !!user;

  // Retrieve token from localStorage
  const token = localStorage.getItem('auth_token');

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