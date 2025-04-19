import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const location = useLocation();
  
  return (
    <LayoutContainer>
      <Sidebar
        as={motion.aside}
        initial={{ width: '260px' }}
        animate={{ width: isSidebarOpen ? '260px' : '72px' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <SidebarHeader>
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <LogoContainer
                as={motion.div}
                key="full-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LogoImage src={Logo} alt="TheSora.io" />
              </LogoContainer>
            ) : (
              <IconContainer
                as={motion.div}
                key="icon-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="#FF9A8B" />
                  <path d="M7 12H17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 7L12 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </IconContainer>
            )}
          </AnimatePresence>
          
          <ToggleButton 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            as={motion.button}
            whileHover={{ 
              backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            }}
            whileTap={{ scale: 0.95 }}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </ToggleButton>
        </SidebarHeader>
        
        <NavLinks>
          <NavItem>
            <StyledNavLink 
              to="/admin" 
              end
              isOpen={isSidebarOpen}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <NavIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                </svg>
              </NavIcon>
              <AnimatePresence>
                {isSidebarOpen && (
                  <NavLabel
                    as={motion.span}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Dashboard
                  </NavLabel>
                )}
              </AnimatePresence>
            </StyledNavLink>
          </NavItem>
          
          <NavItem>
            <StyledNavLink 
              to="/admin/collections" 
              isOpen={isSidebarOpen}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <NavIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 16L8 12L12 16L20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="17" cy="7" r="1" fill="currentColor" />
                </svg>
              </NavIcon>
              <AnimatePresence>
                {isSidebarOpen && (
                  <NavLabel
                    as={motion.span}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Collections
                  </NavLabel>
                )}
              </AnimatePresence>
            </StyledNavLink>
          </NavItem>
          
          <NavItem>
            <StyledNavLink 
              to="/admin/users" 
              isOpen={isSidebarOpen}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <NavIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C13.6569 4 15 5.34315 15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </NavIcon>
              <AnimatePresence>
                {isSidebarOpen && (
                  <NavLabel
                    as={motion.span}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Users
                  </NavLabel>
                )}
              </AnimatePresence>
            </StyledNavLink>
          </NavItem>
          
          <NavItem>
            <StyledNavLink 
              to="/admin/analytics" 
              isOpen={isSidebarOpen}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <NavIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21H3V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 7L14 14L10 10L3 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </NavIcon>
              <AnimatePresence>
                {isSidebarOpen && (
                  <NavLabel
                    as={motion.span}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Analytics
                  </NavLabel>
                )}
              </AnimatePresence>
            </StyledNavLink>
          </NavItem>
        </NavLinks>
        
        <SidebarFooter>
          <ThemeToggleContainer isOpen={isSidebarOpen}>
            <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
          </ThemeToggleContainer>
          
          <ViewUserGalleryButton 
            as={NavLink} 
            to="/gallery"
            isOpen={isSidebarOpen}
          >
            <NavIcon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </NavIcon>
            <AnimatePresence>
              {isSidebarOpen && (
                <NavLabel
                  as={motion.span}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  View Gallery
                </NavLabel>
              )}
            </AnimatePresence>
          </ViewUserGalleryButton>
          
          {isSidebarOpen && (
            <LoginButtonContainer>
              <LoginButton variant="outline" size="small" />
            </LoginButtonContainer>
          )}
          
          {isAuthenticated && (
            <UserInfo isOpen={isSidebarOpen}>
              <UserAvatar 
                src={user?.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User')} 
                alt={user?.name || 'User'} 
              />
              <AnimatePresence>
                {isSidebarOpen && (
                  <UserName
                    as={motion.span}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {user?.name || 'User'}
                  </UserName>
                )}
              </AnimatePresence>
            </UserInfo>
          )}
        </SidebarFooter>
      </Sidebar>
      
      <Main>
        <Header>
          <PageTitle>
            {location.pathname === '/admin' && 'Dashboard'}
            {location.pathname === '/admin/collections' && 'Collections'}
            {location.pathname === '/admin/users' && 'Users'}
            {location.pathname === '/admin/analytics' && 'Analytics'}
          </PageTitle>
          
          <HeaderActions>
            {!isSidebarOpen && (
              <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
            )}
            
            {!isSidebarOpen && isAuthenticated && (
              <HeaderUserInfo>
                <UserAvatar 
                  src={user?.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User')} 
                  alt={user?.name || 'User'} 
                />
              </HeaderUserInfo>
            )}
          </HeaderActions>
        </Header>
        
        <Content
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </Content>
      </Main>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.background.primary};
`;

const Sidebar = styled.aside`
  height: 100vh;
  background-color: ${({ theme }) => theme.surface.primary};
  border-right: 1px solid ${({ theme }) => theme.border.primary};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  position: sticky;
  top: 0;
  left: 0;
`;

const SidebarHeader = styled.div`
  height: 64px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled.img`
  height: 32px;
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
  border-radius: 6px;
  transition: background-color 0.2s;
`;

const NavLinks = styled.ul`
  list-style: none;
  padding: 8px 0;
  flex: 1;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 4px 0;
  padding: 0 8px;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 ${props => props.isOpen ? '16px' : '8px'};
  color: ${({ theme }) => theme.text.secondary};
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
  text-decoration: none;
  
  &:hover {
    background-color: ${({ theme }) => theme.surface.secondary};
    color: ${({ theme }) => theme.text.primary};
  }
  
  &.active {
    background-color: ${({ theme }) => theme.surface.secondary};
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
    
    &::before {
      content: '';
      position: absolute;
      left: -8px;
      top: 8px;
      bottom: 8px;
      width: 3px;
      background-color: ${({ theme }) => theme.primary};
      border-radius: 0 3px 3px 0;
    }
  }
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
`;

const NavLabel = styled.span`
  margin-left: 12px;
  white-space: nowrap;
  overflow: hidden;
`;

const SidebarFooter = styled.div`
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.border.primary};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ThemeToggleContainer = styled.div`
  display: flex;
  justify-content: ${props => props.isOpen ? 'flex-start' : 'center'};
`;

const ViewUserGalleryButton = styled(NavLink)`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 ${props => props.isOpen ? '16px' : '8px'};
  background-color: transparent;
  color: ${({ theme }) => theme.text.secondary};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  &:hover, &.active {
    background-color: ${({ theme }) => theme.surface.secondary};
    color: ${({ theme }) => theme.text.primary};
  }
`;

const LoginButtonContainer = styled.div`
  width: 100%;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${props => props.isOpen ? '8px 16px' : '8px 4px'};
  margin-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.border.primary};
  overflow: hidden;
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
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
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  background-color: ${({ theme }) => theme.surface.primary};
  position: sticky;
  top: 0;
  z-index: 5;
`;

const PageTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.text.primary};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderUserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
`;

export default AdminLayout;