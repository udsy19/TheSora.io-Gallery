import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';
import LoginButton from '../common/LoginButton';
import Logo from '../../assets/Logo.png';

const AdminLayout = () => {
  const { toggleTheme, isDarkTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <LayoutContainer>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarHeader>
          <LogoContainer>
            <LogoImage src={Logo} alt="TheSora.io" />
          </LogoContainer>
          <ToggleButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? '◀' : '▶'}
          </ToggleButton>
        </SidebarHeader>
        
        <NavLinks>
          <NavItem>
            <StyledNavLink to="/admin" end>
              <span>Dashboard</span>
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/admin/collections">
              <span>Collections</span>
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/admin/users">
              <span>Users</span>
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/admin/analytics">
              <span>Analytics</span>
            </StyledNavLink>
          </NavItem>
        </NavLinks>
        
        <SidebarFooter>
          <ThemeToggleContainer>
            <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
          </ThemeToggleContainer>
          <ViewUserGalleryButton as={NavLink} to="/gallery">
            View Gallery
          </ViewUserGalleryButton>
          <LoginButtonContainer>
            <LoginButton />
          </LoginButtonContainer>
          {isAuthenticated && (
            <UserInfo>
              <UserAvatar 
                src={user?.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User')} 
                alt={user?.name || 'User'} 
              />
              <UserName>{user?.name || 'User'}</UserName>
            </UserInfo>
          )}
        </SidebarFooter>
      </Sidebar>
      
      <Main isOpen={isSidebarOpen}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Outlet />
        </motion.div>
      </Main>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const Sidebar = styled.aside`
  width: ${({ isOpen }) => isOpen ? '260px' : '80px'};
  height: 100%;
  background-color: ${({ theme }) => theme.surface.primary};
  border-right: 1px solid ${({ theme }) => theme.border.primary};
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 10;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background-color: ${({ theme }) => theme.surface.tertiary};
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  padding: 1rem 0;
  flex: 1;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: ${({ theme }) => theme.text.secondary};
  border-radius: 0;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.surface.tertiary};
    color: ${({ theme }) => theme.text.primary};
  }
  
  &.active {
    background-color: ${({ theme }) => theme.primary + '20'};
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
  }
  
  span {
    margin-left: 0.75rem;
  }
`;

const SidebarFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border.primary};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ThemeToggleContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ViewUserGalleryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background-color: transparent;
  color: ${({ theme }) => theme.text.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  &:hover, &.active {
    background-color: ${({ theme }) => theme.surface.tertiary};
    color: ${({ theme }) => theme.text.primary};
  }
`;

const LoginButtonContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
  margin-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border.primary};
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Main = styled.main`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.background.primary};
  transition: margin-left 0.3s ease;
`;

export default AdminLayout;