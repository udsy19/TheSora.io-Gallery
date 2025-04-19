import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LoginButton = ({ variant = 'default', size = 'medium' }) => {
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
          variant={variant}
          size={size}
          as={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading ? (
            <LoadingDots>
              <Dot delay={0} />
              <Dot delay={0.1} />
              <Dot delay={0.2} />
            </LoadingDots>
          ) : (
            'Log Out'
          )}
        </StyledButton>
      ) : (
        <StyledButton 
          onClick={handleLogin} 
          disabled={isLoading}
          variant={variant}
          size={size}
          as={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading ? (
            <LoadingDots>
              <Dot delay={0} />
              <Dot delay={0.1} />
              <Dot delay={0.2} />
            </LoadingDots>
          ) : (
            'Log In'
          )}
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

const ErrorMessage = styled(motion.div)`
  color: ${({ theme }) => theme.status.error};
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  text-align: center;
  max-width: 200px;
  background-color: ${({ theme }) => 'rgba(255, 69, 58, 0.1)'};
  padding: 0.5rem;
  border-radius: 8px;
`;

const StyledButton = styled.button`
  padding: ${props => 
    props.size === 'small' ? '0.375rem 0.75rem' : 
    props.size === 'large' ? '0.75rem 1.5rem' : 
    '0.625rem 1.25rem'};
  font-size: ${props => 
    props.size === 'small' ? '0.875rem' : 
    props.size === 'large' ? '1.125rem' : 
    '1rem'};
  background-color: ${({ theme, variant }) => 
    variant === 'ghost' ? 'transparent' : 
    variant === 'outline' ? 'transparent' : 
    theme.primary};
  color: ${({ theme, variant }) => 
    variant === 'ghost' || variant === 'outline' ? theme.text.primary : 
    'white'};
  border: ${({ theme, variant }) => 
    variant === 'outline' ? `1px solid ${theme.border.primary}` : 
    'none'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  box-shadow: ${({ theme, variant }) => 
    variant === 'ghost' || variant === 'outline' ? 'none' : 
    '0 1px 2px rgba(0, 0, 0, 0.05)'};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  
  &:hover {
    background-color: ${({ theme, variant }) => 
      variant === 'ghost' ? theme.surface.tertiary : 
      variant === 'outline' ? theme.surface.tertiary : 
      theme.accent};
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 16px;
`;

const Dot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.7;
  animation: loadingPulse 1.4s infinite ease-in-out both;
  animation-delay: ${props => props.delay}s;
  
  @keyframes loadingPulse {
    0%, 80%, 100% {
      transform: scale(0.6);
      opacity: 0.6;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export default LoginButton;