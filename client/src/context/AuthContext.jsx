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
    error, 
    loginWithRedirect, 
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();
  
  const [token, setToken] = useState(null);
  
  // Handle Auth0 token storage
  useEffect(() => {
    const getToken = async () => {
      try {
        // If no token is present and the user is authenticated, get a token
        if (isAuthenticated && !token) {
          const auth0Token = await getAccessTokenSilently();
          setToken(auth0Token);
          
          // Set the token for API requests
          setAuthToken(auth0Token);
          // Store user info
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };
    
    getToken();
  }, [isAuthenticated, user]);
  
  // Clear token on logout
  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('user');
    setToken(null);
    
    // Redirect to Auth0 logout
    auth0Logout({ 
      returnTo: window.location.origin 
    });
  };
  
  const value = {
    isAuthenticated,
    user,
    loading: isLoading,
    error: error?.message || '',
    login: loginWithRedirect,
    logout: handleLogout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};