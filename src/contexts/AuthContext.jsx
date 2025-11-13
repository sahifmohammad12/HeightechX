import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Log the API URL for debugging
console.log('API URL:', apiUrl);

// Create axios instance with default config
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifySession = async (accessToken) => {
    try {
      const response = await api.post('/api/auth/verify', {
        access_token: accessToken,
      });
      return response.data.valid === true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    // Check for existing session in localStorage
    const storedSession = localStorage.getItem('auth_session');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedSession && storedUser) {
      try {
        const sessionData = JSON.parse(storedSession);
        const userData = JSON.parse(storedUser);
        
        // Verify session is still valid
        verifySession(sessionData.access_token)
          .then((isValid) => {
            if (isValid) {
              setSession(sessionData);
              setUser(userData);
            } else {
              // Session expired, clear storage
              localStorage.removeItem('auth_session');
              localStorage.removeItem('auth_user');
            }
            setLoading(false);
          })
          .catch(() => {
            localStorage.removeItem('auth_session');
            localStorage.removeItem('auth_user');
            setLoading(false);
          });
      } catch (error) {
        localStorage.removeItem('auth_session');
        localStorage.removeItem('auth_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email, password, fullName = '') => {
    try {
      const response = await api.post('/api/auth/signup', {
        email,
        password,
        fullName,
      });

      if (response.data.user && response.data.session) {
        const userData = response.data.user;
        const sessionData = response.data.session;
        
        // Store in localStorage
        localStorage.setItem('auth_session', JSON.stringify(sessionData));
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        setSession(sessionData);
        setUser(userData);
        toast.success('Account created successfully!');
        return { user: userData, session: sessionData };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Signup error details:', error);
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.error || error.response.statusText || 'Failed to create account';
        toast.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response from server:', error.request);
        toast.error('Server is not responding. Please check if the backend server is running on port 3001.');
      } else {
        // Error setting up request
        const errorMessage = error.message || 'Failed to create account';
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await api.post('/api/auth/signin', {
        email,
        password,
      });

      if (response.data.user && response.data.session) {
        const userData = response.data.user;
        const sessionData = response.data.session;
        
        // Store in localStorage
        localStorage.setItem('auth_session', JSON.stringify(sessionData));
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        setSession(sessionData);
        setUser(userData);
        toast.success('Signed in successfully!');
        return { user: userData, session: sessionData };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Signin error details:', error);
      if (error.response) {
        const errorMessage = error.response.data?.error || error.response.statusText || 'Failed to sign in';
        toast.error(errorMessage);
      } else if (error.request) {
        console.error('No response from server:', error.request);
        toast.error('Server is not responding. Please check if the backend server is running on port 3001.');
      } else {
        const errorMessage = error.message || 'Failed to sign in';
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const storedSession = localStorage.getItem('auth_session');
      if (storedSession) {
        try {
          const sessionData = JSON.parse(storedSession);
          if (sessionData.access_token) {
            await api.post('/api/auth/signout', {
              access_token: sessionData.access_token,
            });
          }
        } catch (error) {
          console.error('Error signing out from server:', error);
        }
      }

      // Clear local storage
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_user');
      
      setSession(null);
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      // Even if server signout fails, clear local state
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_user');
      setSession(null);
      setUser(null);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

