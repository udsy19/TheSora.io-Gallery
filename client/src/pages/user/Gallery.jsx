import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const Gallery = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activePhoto, setActivePhoto] = useState(null);
  const galleryRef = useRef(null);
  const lightboxRef = useRef(null);

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
              category: 'events',
              imageCount: 124,
              images: [
                'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                'https://images.unsplash.com/photo-1537907510280-fa8d733587cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
              ],
              date: '2023-10-15'
            },
            { 
              id: '2', 
              name: 'Portrait Session',
              category: 'portraits',
              imageCount: 45,
              images: [
                'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
              ],
              date: '2023-11-05'
            },
            { 
              id: '3', 
              name: 'Family Portraits',
              category: 'portraits',
              imageCount: 78,
              images: [
                'https://images.unsplash.com/photo-1581952976147-5a2d15560349?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                'https://images.unsplash.com/photo-1602962395186-61c4e08eed2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
              ],
              date: '2023-09-20'
            },
            { 
              id: '4', 
              name: 'Landscapes',
              category: 'nature',
              imageCount: 35,
              images: [
                'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
              ],
              date: '2023-08-12'
            },
            { 
              id: '5', 
              name: 'Street Photography',
              category: 'urban',
              imageCount: 50,
              images: [
                'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
              ],
              date: '2023-07-30'
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

  const handleOpenLightbox = (image) => {
    setActivePhoto(image);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseLightbox = () => {
    setActivePhoto(null);
    document.body.style.overflow = 'auto';
  };

  const handleOutsideClick = (e) => {
    if (lightboxRef.current && !lightboxRef.current.contains(e.target)) {
      handleCloseLightbox();
    }
  };

  const filteredCollections = filter === 'all' 
    ? collections 
    : collections.filter(collection => collection.category === filter);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.5
      }
    }
  };

  return (
    <GalleryWrapper>
      <GalleryHeader>
        <LogoWrapper>
          <Logo>TheSora.io</Logo>
        </LogoWrapper>
        
        <FilterContainer>
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={filter === 'portraits'} 
            onClick={() => setFilter('portraits')}
          >
            Portraits
          </FilterButton>
          <FilterButton 
            active={filter === 'events'} 
            onClick={() => setFilter('events')}
          >
            Events
          </FilterButton>
          <FilterButton 
            active={filter === 'nature'} 
            onClick={() => setFilter('nature')}
          >
            Nature
          </FilterButton>
          <FilterButton 
            active={filter === 'urban'} 
            onClick={() => setFilter('urban')}
          >
            Urban
          </FilterButton>
        </FilterContainer>
      </GalleryHeader>

      <GalleryContainer ref={galleryRef}>
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
            {filteredCollections.length === 0 ? (
              <EmptyState>
                <EmptyTitle>No collections found</EmptyTitle>
                <EmptyText>Try a different filter or check back later.</EmptyText>
              </EmptyState>
            ) : (
              <MasonryGrid
                as={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredCollections.map((collection) => (
                  <div key={collection.id}>
                    <CollectionTitle>{collection.name}</CollectionTitle>
                    <CollectionDate>{collection.date}</CollectionDate>
                    <ImageGrid>
                      {collection.images.map((image, imageIndex) => (
                        <ImageWrapper
                          key={`${collection.id}-${imageIndex}`}
                          as={motion.div}
                          variants={itemVariants}
                          onClick={() => handleOpenLightbox(image)}
                          whileHover={{ 
                            scale: 1.02,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <GalleryImage src={image} alt={`${collection.name} image ${imageIndex + 1}`} />
                        </ImageWrapper>
                      ))}
                      <ViewMoreWrapper 
                        as={motion.div}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                      >
                        <StyledLink to={`/gallery/collections/${collection.id}`}>
                          <ViewMoreOverlay>
                            <ViewMoreText>
                              View All
                              <br />
                              {collection.imageCount} Photos
                            </ViewMoreText>
                          </ViewMoreOverlay>
                          <GalleryImage 
                            src={collection.images[0]} 
                            alt={`View more from ${collection.name}`}
                            style={{ filter: 'blur(2px)' }}
                          />
                        </StyledLink>
                      </ViewMoreWrapper>
                    </ImageGrid>
                  </div>
                ))}
              </MasonryGrid>
            )}
          </>
        )}
      </GalleryContainer>

      {/* Image Lightbox */}
      <AnimatePresence>
        {activePhoto && (
          <LightboxOverlay 
            onClick={handleOutsideClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Lightbox
              ref={lightboxRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <LightboxImage src={activePhoto} alt="Lightbox view" />
              <CloseButton onClick={handleCloseLightbox}>×</CloseButton>
            </Lightbox>
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </GalleryWrapper>
  );
};

// Styled Components - VSCO inspired minimalistic design
const GalleryWrapper = styled.div`
  background-color: #f8f8f8;
  min-height: 100vh;
  color: #333;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const GalleryHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: rgba(248, 248, 248, 0.85);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #eee;
`;

const LogoWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.5px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  font-size: 0.9rem;
  padding: 0.2rem 0;
  cursor: pointer;
  position: relative;
  color: ${props => props.active ? '#000' : '#888'};
  font-weight: ${props => props.active ? '500' : '400'};
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #000;
    transform: scaleX(${props => props.active ? 1 : 0});
    transition: transform 0.3s ease;
    transform-origin: left;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const GalleryContainer = styled.main`
  padding: 2rem;
`;

const MasonryGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const CollectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
`;

const CollectionDate = styled.div`
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 1.25rem;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
`;

const ImageWrapper = styled.div`
  cursor: pointer;
  overflow: hidden;
  border-radius: 3px;
  background-color: #eee;
  aspect-ratio: 1;
  
  &:hover img {
    filter: brightness(1.05);
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s ease;
  background-color: #eee;
`;

const ViewMoreWrapper = styled(ImageWrapper)`
  position: relative;
`;

const ViewMoreOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2;
`;

const ViewMoreText = styled.div`
  color: white;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.5;
  letter-spacing: 0.03em;
`;

const StyledLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  width: 100%;
  height: 100%;
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
  background-color: #aaa;
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
  text-align: center;
  background-color: #f2f2f2;
  border-radius: 3px;
`;

const EmptyTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: #333;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: #888;
  max-width: 24rem;
`;

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
`;

const Lightbox = styled(motion.div)`
  max-width: 90%;
  max-height: 90%;
  position: relative;
  cursor: default;
`;

const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
`;

export default Gallery;