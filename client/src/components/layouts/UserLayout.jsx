import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
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
  
  useEffect(() => {
    // Fetch user collections - this would be replaced with an actual API call
    const fetchCollections = async () => {
      try {
        // Mock data for now, will be replaced with API call
        setTimeout(() => {
          setCollections([
            { id: '1', name: 'Collection 1' },
            { id: '2', name: 'Collection 2' },
            { id: '3', name: 'Collection 3' }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setIsLoading(false);
      }
    };
    
    fetchCollections();
  }, []);
  
  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <LogoContainer>
            <LogoImage src={Logo} alt="TheSora.io" />
          </LogoContainer>
          
          <NavActions>
            <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
            <AdminButton as={NavLink} to="/admin">
              Admin Dashboard
            </AdminButton>
            <LoginButton />
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
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%' }}
            >
              <CollectionsBar>
                <CollectionsTitle>My Collections</CollectionsTitle>
                <CollectionsList>
                  {collections.map(collection => (
                    <CollectionItem key={collection.id}>
                      <CollectionLink to={`/gallery/collections/${collection.id}`}>
                        {collection.name}
                      </CollectionLink>
                    </CollectionItem>
                  ))}
                </CollectionsList>
              </CollectionsBar>
              
              <ContentContainer>
                <Outlet />
              </ContentContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </Main>
      
      <Footer>
        <FooterContent>
          <FooterText>
            © {new Date().getFullYear()} TheSora.io Photography. All rights reserved.
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
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  padding: 1rem 2rem;
  z-index: 10;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.primary};
`;

const AdminButton = styled.button`
  padding: 0.5rem 1rem;
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

const Main = styled.main`
  flex: 1;
  padding: 0;
  background-color: ${({ theme }) => theme.background.primary};
  position: relative;
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
  width: 100px;
  height: auto;
`;

const CollectionsBar = styled.div`
  background-color: ${({ theme }) => theme.surface.secondary};
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
`;

const CollectionsTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text.primary};
`;

const CollectionsList = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const CollectionItem = styled.div`
  position: relative;
`;

const CollectionLink = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.surface.tertiary};
  color: ${({ theme }) => theme.text.primary};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }
  
  &.active {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const ContentContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
`;

const Footer = styled.footer`
  width: 100%;
  background-color: ${({ theme }) => theme.surface.primary};
  border-top: 1px solid ${({ theme }) => theme.border.primary};
  padding: 1.5rem 2rem;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1280px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 0.875rem;
  margin: 0;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

export default UserLayout;