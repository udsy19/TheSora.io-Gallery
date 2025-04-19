import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

const LoginButton = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
      setError(`Auth0 error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ButtonContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {isAuthenticated ? (
        <StyledButton 
          onClick={handleLogout} 
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Log Out'}
        </StyledButton>
      ) : (
        <StyledButton 
          onClick={handleLogin} 
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Log In'}
        </StyledButton>
      )}
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  text-align: center;
  max-width: 200px;
`;

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  
  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default LoginButton;