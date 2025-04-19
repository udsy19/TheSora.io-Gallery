import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Gallery = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user collections - this would be replaced with an actual API call
    const fetchCollections = async () => {
      try {
        // Mock data for now, will be replaced with API call
        setTimeout(() => {
          setCollections([
            { 
              id: '1', 
              name: 'Wedding Photography',
              imageCount: 124,
              coverImage: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            { 
              id: '2', 
              name: 'Portrait Session',
              imageCount: 45,
              coverImage: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            { 
              id: '3', 
              name: 'Family Portraits',
              imageCount: 78,
              coverImage: 'https://images.unsplash.com/photo-1581952976147-5a2d15560349?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
          ]);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setIsLoading(false);
      }
    };
    
    fetchCollections();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <GalleryContainer>
      <Header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1>Collections</h1>
        <Subheading>
          Explore your photography collections
        </Subheading>
      </Header>

      {isLoading ? (
        <LoadingWrapper>
          <LoadingIndicator>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
          </LoadingIndicator>
        </LoadingWrapper>
      ) : (
        <>
          {collections.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📷</EmptyIcon>
              <EmptyTitle>No collections yet</EmptyTitle>
              <EmptyText>Your photography collections will appear here.</EmptyText>
            </EmptyState>
          ) : (
            <Grid
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -4,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    transition: { duration: 0.1, ease: "easeOut" }
                  }}
                >
                  <StyledLink to={`/gallery/collections/${collection.id}`}>
                    <ImageContainer>
                      <CollectionImage src={collection.coverImage} alt={collection.name} />
                      <OverlayGradient />
                      <ImageCount>{collection.imageCount}</ImageCount>
                    </ImageContainer>
                    <CollectionContent>
                      <CollectionName>{collection.name}</CollectionName>
                    </CollectionContent>
                  </StyledLink>
                </CollectionCard>
              ))}
            </Grid>
          )}
        </>
      )}
    </GalleryContainer>
  );
};

const GalleryContainer = styled.div`
  max-width: 1160px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
`;

const Header = styled(motion.div)`
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: -0.03em;
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 0.5rem;
  }
`;

const Subheading = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.text.tertiary};
  font-weight: 400;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40vh;
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  opacity: 0.6;
  animation: pulse 1.5s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(0.8);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  background-color: ${({ theme }) => theme.surface.secondary};
  border-radius: 16px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.text.primary};
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.text.tertiary};
  max-width: 24rem;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const CollectionCard = styled(motion.div)`
  border-radius: 16px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.surface.primary};
  box-shadow: ${({ theme }) => theme.shadow.small};
  position: relative;
`;

const StyledLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 3/2;
  overflow: hidden;
`;

const ImageCount = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  z-index: 2;
`;

const OverlayGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%);
  z-index: 1;
`;

const CollectionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  
  ${CollectionCard}:hover & {
    transform: scale(1.05);
  }
`;

const CollectionContent = styled.div`
  padding: 1.25rem;
`;

const CollectionName = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

export default Gallery;