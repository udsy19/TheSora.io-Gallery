import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authAPI, setAuthToken } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    error: auth0Error, 
    loginWithRedirect, 
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();
  
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');
  
  // Log Auth0 state for debugging
  useEffect(() => {
    console.log('Auth0 State:', { 
      isAuthenticated, 
      user, 
      isLoading, 
      error: auth0Error,
      domain: window.location.origin
    });
    
    if (auth0Error) {
      console.error('Auth0 Error:', auth0Error);
      setError(auth0Error?.message || 'Authentication error');
    }
  }, [isAuthenticated, user, isLoading, auth0Error]);
  
  // Handle Auth0 token storage
  useEffect(() => {
    const getToken = async () => {
      try {
        // If no token is present and the user is authenticated, get a token
        if (isAuthenticated && !token && user) {
          console.log('Getting access token...');
          const auth0Token = await getAccessTokenSilently({
            authorizationParams: {
              audience: '', // You can set an API audience here if needed
              scope: 'openid profile email'
            }
          });
          
          console.log('Token received:', auth0Token ? 'yes' : 'no');
          setToken(auth0Token);
          
          // Set the token for API requests
          setAuthToken(auth0Token);
          // Store user info
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        console.error('Error getting token:', error);
        setError(`Error getting token: ${error.message}`);
      }
    };
    
    getToken();
  }, [isAuthenticated, user, token, getAccessTokenSilently]);
  
  // Custom login function with error handling
  const handleLogin = async () => {
    try {
      console.log('Initiating login redirect...');
      setError('');
      await loginWithRedirect({
        appState: { returnTo: window.location.pathname }
      });
    } catch (err) {
      console.error('Login error:', err);
      setError(`Login failed: ${err.message}`);
      throw err;
    }
  };
  
  // Clear token on logout
  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      setError('');
      setAuthToken(null);
      localStorage.removeItem('user');
      setToken(null);
      
      // Redirect to Auth0 logout
      await auth0Logout({ 
        logoutParams: {
          returnTo: window.location.origin 
        }
      });
    } catch (err) {
      console.error('Logout error:', err);
      setError(`Logout failed: ${err.message}`);
      throw err;
    }
  };
  
  const value = {
    isAuthenticated,
    user,
    loading: isLoading,
    error: error || auth0Error?.message || '',
    login: handleLogin,
    logout: handleLogout,
    clearError: () => setError('')
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};