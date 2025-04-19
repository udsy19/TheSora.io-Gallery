import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const ImageView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [collection, setCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch image data
    const fetchImageData = async () => {
      try {
        // This would be replaced with an actual API call
        setTimeout(() => {
          // Mock image data
          const mockImage = {
            id,
            filename: `image-${id}.jpg`,
            originalName: `Beautiful Photo ${id}.jpg`,
            path: `https://source.unsplash.com/random/1200x800?sig=${id}`,
            size: 2459633,
            mimetype: 'image/jpeg',
            uploadedAt: new Date().toISOString(),
            collection: 'collection-1'
          };
          
          // Mock collection data
          const mockCollection = {
            id: 'collection-1',
            name: 'Sample Collection',
            description: 'A beautiful collection of photos',
            imagesCount: 42
          };
          
          setImage(mockImage);
          setCollection(mockCollection);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching image data:', error);
        setIsLoading(false);
      }
    };
    
    fetchImageData();
  }, [id]);

  const handleBackToCollection = () => {
    navigate(`/gallery/collections/${collection.id}`);
  };

  const handleDownloadImage = () => {
    // This would be replaced with actual download functionality
    alert(`Downloading ${image.originalName}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading image...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <NavBar>
        <BackButton onClick={handleBackToCollection}>← Back to Collection</BackButton>
        <DownloadButton onClick={handleDownloadImage}>Download</DownloadButton>
      </NavBar>
      
      <ImageContainer>
        <StyledImage 
          src={image.path} 
          alt={image.originalName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
      </ImageContainer>
      
      <ImageInfo>
        <div>
          <ImageTitle>{image.originalName}</ImageTitle>
          <ImageCollection>
            From collection: <CollectionName>{collection.name}</CollectionName>
          </ImageCollection>
        </div>
        
        <ImageMeta>
          <MetaItem>
            <MetaLabel>Uploaded</MetaLabel>
            <MetaValue>{formatDate(image.uploadedAt)}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Size</MetaLabel>
            <MetaValue>{formatFileSize(image.size)}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Type</MetaLabel>
            <MetaValue>{image.mimetype}</MetaValue>
          </MetaItem>
        </ImageMeta>
      </ImageInfo>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-size: 0.875rem;
  padding: 0;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DownloadButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
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

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  background-color: ${({ theme }) => theme.surface.secondary};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.medium};
`;

const StyledImage = styled(motion.img)`
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
`;

const ImageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.surface.primary};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow.small};
`;

const ImageTitle = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text.primary};
`;

const ImageCollection = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const CollectionName = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
`;

const ImageMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.tertiary};
  margin-bottom: 0.25rem;
`;

const MetaValue = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 500;
`;

export default ImageView;