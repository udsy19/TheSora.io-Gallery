import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

const LoginButton = () => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <StyledButton onClick={logout}>
          Log Out
        </StyledButton>
      ) : (
        <StyledButton onClick={login}>
          Log In
        </StyledButton>
      )}
    </>
  );
};

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
`;

export default LoginButton;