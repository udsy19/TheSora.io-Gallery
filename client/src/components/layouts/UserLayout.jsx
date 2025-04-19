import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';
import LoginButton from '../common/LoginButton';
import Logo from '../../assets/Logo.png';

const UserLayout = () => {
  const { toggleTheme, isDarkTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // Fetch user collections - this would be replaced with an actual API call
    const fetchCollections = async () => {
      try {
        // Mock data for now, will be replaced with API call
        setTimeout(() => {
          setCollections([
            { id: '1', name: 'Wedding Photography' },
            { id: '2', name: 'Portrait Session' },
            { id: '3', name: 'Family Portraits' }
          ]);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setIsLoading(false);
      }
    };
    
    fetchCollections();
  }, []);

  // Close sidebar when changing routes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  
  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <LogoAndMenuContainer>
            <MenuButton
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              <MenuIcon open={isSidebarOpen} />
            </MenuButton>
            
            <LogoContainer to="/gallery">
              <LogoImage src={Logo} alt="TheSora.io" />
            </LogoContainer>
          </LogoAndMenuContainer>
          
          <NavActions>
            <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
            
            {isAuthenticated && user?.role === 'admin' && (
              <AdminLink to="/admin">
                <AdminIcon>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C13.6569 4 15 5.34315 15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </AdminIcon>
                Admin
              </AdminLink>
            )}
            
            <LoginButton variant="outline" size="small" />
            
            {isAuthenticated && (
              <UserInfo>
                <UserAvatar 
                  src={user?.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User')} 
                  alt={user?.name || 'User'} 
                />
              </UserInfo>
            )}
          </NavActions>
        </HeaderContent>
      </Header>
      
      <Main>
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <SidebarOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {isSidebarOpen && (
            <Sidebar
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <SidebarHeader>
                <SidebarTitle>Collections</SidebarTitle>
              </SidebarHeader>
              
              <CollectionsList>
                {isLoading ? (
                  <CollectionLoading>
                    <LoadingItem />
                    <LoadingItem delay={0.1} />
                    <LoadingItem delay={0.2} />
                  </CollectionLoading>
                ) : collections.length === 0 ? (
                  <EmptyCollections>No collections found</EmptyCollections>
                ) : (
                  collections.map(collection => (
                    <CollectionItem key={collection.id}>
                      <CollectionLink 
                        to={`/gallery/collections/${collection.id}`}
                        className={location.pathname === `/gallery/collections/${collection.id}` ? 'active' : ''}
                      >
                        <CollectionIcon>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M4 16L8 12L12 16L20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="17" cy="7" r="1" fill="currentColor" />
                          </svg>
                        </CollectionIcon>
                        {collection.name}
                      </CollectionLink>
                    </CollectionItem>
                  ))
                )}
              </CollectionsList>
            </Sidebar>
          )}
        </AnimatePresence>
        
        <ContentArea isSidebarOpen={isSidebarOpen}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingContainer
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LogoLoader 
                  src={Logo} 
                  alt="Loading" 
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: [0.8, 1, 0.8],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </LoadingContainer>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', height: '100%' }}
              >
                <Outlet />
              </motion.div>
            )}
          </AnimatePresence>
        </ContentArea>
      </Main>
      
      <Footer>
        <FooterContent>
          <FooterText>
            © {new Date().getFullYear()} TheSora.io Photography
          </FooterText>
          <FooterLinks>
            <FooterLink href="https://thesora.io" target="_blank" rel="noopener noreferrer">
              Website
            </FooterLink>
            <FooterLink href="https://instagram.com/thesora.io" target="_blank" rel="noopener noreferrer">
              Instagram
            </FooterLink>
            <FooterLink href="mailto:contact@thesora.io">
              Contact
            </FooterLink>
          </FooterLinks>
        </FooterContent>
      </Footer>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.background.primary};
`;

const Header = styled.header`
  width: 100%;
  background-color: ${({ theme }) => theme.surface.primary};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
`;

const LogoAndMenuContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.surface.secondary};
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`;

const MenuIcon = styled.div`
  position: relative;
  width: 18px;
  height: 2px;
  background-color: ${props => props.open ? 'transparent' : ({ theme }) => theme.text.primary};
  transition: all 0.3s ease;
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 18px;
    height: 2px;
    background-color: ${({ theme }) => theme.text.primary};
    transition: all 0.3s ease;
  }
  
  &:before {
    transform: ${props => props.open 
      ? 'rotate(45deg)'
      : 'translateY(-6px)'
    };
  }
  
  &:after {
    transform: ${props => props.open 
      ? 'rotate(-45deg)'
      : 'translateY(6px)'
    };
  }
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const LogoImage = styled.img`
  height: 32px;
  width: auto;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AdminLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover, &.active {
    background-color: ${({ theme }) => theme.surface.secondary};
    color: ${({ theme }) => theme.text.primary};
  }
`;

const AdminIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  position: relative;
  background-color: ${({ theme }) => theme.background.primary};
`;

const SidebarOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 90;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Sidebar = styled(motion.aside)`
  width: 260px;
  height: 100%;
  background-color: ${({ theme }) => theme.surface.primary};
  border-right: 1px solid ${({ theme }) => theme.border.primary};
  z-index: 95;
  overflow-y: auto;
  position: sticky;
  top: 60px;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 57px;
    bottom: 0;
    left: 0;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.25rem 1.25rem 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
`;

const SidebarTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.text.tertiary};
  margin: 0;
`;

const CollectionsList = styled.ul`
  list-style: none;
  padding: 0.75rem 0;
  margin: 0;
`;

const CollectionLoading = styled.div`
  padding: 0 1.25rem;
`;

const LoadingItem = styled(motion.div)`
  height: 20px;
  width: 70%;
  background-color: ${({ theme }) => theme.surface.tertiary};
  border-radius: 4px;
  margin-bottom: 1rem;
  opacity: 0.7;
  animation: pulse 1.5s infinite;
  animation-delay: ${props => props.delay || 0}s;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.8;
    }
  }
`;

const EmptyCollections = styled.div`
  padding: 1.25rem;
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 0.875rem;
  text-align: center;
`;

const CollectionItem = styled.li`
  margin: 0;
`;

const CollectionLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.25rem;
  color: ${({ theme }) => theme.text.secondary};
  text-decoration: none;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  
  &:hover, &.active {
    background-color: ${({ theme }) => theme.surface.secondary};
    color: ${({ theme }) => theme.text.primary};
  }
  
  &.active {
    border-left: 2px solid ${({ theme }) => theme.primary};
    font-weight: 500;
  }
`;

const CollectionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text.tertiary};
  
  ${CollectionLink}:hover &, ${CollectionLink}.active & {
    color: ${({ theme }) => theme.text.primary};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  min-height: calc(100vh - 57px - 56px); /* 100vh - header - footer */
  transition: margin-left 0.3s ease;
  
  @media (min-width: 769px) {
    margin-left: ${props => props.isSidebarOpen ? '260px' : '0'};
  }
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 60vh;
`;

const LogoLoader = styled(motion.img)`
  width: 70px;
  height: auto;
`;

const Footer = styled.footer`
  width: 100%;
  background-color: ${({ theme }) => theme.surface.primary};
  border-top: 1px solid ${({ theme }) => theme.border.primary};
  padding: 1rem 1.25rem;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 1440px;
  margin: 0 auto;
  
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 0.75rem;
  margin: 0;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.25rem;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 0.75rem;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

export default UserLayout;