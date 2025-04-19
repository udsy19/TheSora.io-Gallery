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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <GalleryContainer>
      <GalleryHeader>
        <h1>My Gallery</h1>
        <p>Browse your photo collections</p>
      </GalleryHeader>

      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading your collections...</LoadingText>
        </LoadingContainer>
      ) : (
        <>
          {collections.length === 0 ? (
            <EmptyState>
              <EmptyMessage>You don't have any collections yet.</EmptyMessage>
            </EmptyState>
          ) : (
            <CollectionsGrid
              variants={container}
              initial="hidden"
              animate="show"
            >
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  variants={item}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link to={`/gallery/collections/${collection.id}`}>
                    <CollectionCover>
                      <CollectionImage src={collection.coverImage} alt={collection.name} />
                    </CollectionCover>
                    <CollectionDetails>
                      <CollectionName>{collection.name}</CollectionName>
                      <CollectionInfo>{collection.imageCount} photos</CollectionInfo>
                    </CollectionDetails>
                  </Link>
                </CollectionCard>
              ))}
            </CollectionsGrid>
          )}
        </>
      )}
    </GalleryContainer>
  );
};

const GalleryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const GalleryHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.text.primary};
  }
  
  p {
    color: ${({ theme }) => theme.text.secondary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.border.secondary};
  border-top: 3px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background-color: ${({ theme }) => theme.surface.secondary};
  border-radius: 12px;
`;

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 1.125rem;
`;

const CollectionsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CollectionCard = styled(motion.div)`
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.surface.primary};
  box-shadow: ${({ theme }) => theme.shadow.small};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.medium};
  }
  
  a {
    display: block;
    color: inherit;
    text-decoration: none;
  }
`;

const CollectionCover = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
`;

const CollectionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CollectionCard}:hover & {
    transform: scale(1.05);
  }
`;

const CollectionDetails = styled.div`
  padding: 1.25rem;
`;

const CollectionName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.text.primary};
`;

const CollectionInfo = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.tertiary};
`;

export default Gallery;