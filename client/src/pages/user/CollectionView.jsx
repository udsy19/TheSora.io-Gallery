import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const CollectionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [viewingImage, setViewingImage] = useState(null);

  useEffect(() => {
    // Mock fetch collection and images
    const fetchCollectionData = async () => {
      try {
        // This would be replaced with an actual API call
        setTimeout(() => {
          const mockCollection = {
            id,
            name: 'Sample Collection',
            description: 'A beautiful collection of photos',
            createdAt: '2023-05-10T14:30:00Z'
          };
          
          const mockImages = Array.from({ length: 20 }, (_, i) => ({
            id: `img-${i + 1}`,
            filename: `image-${i + 1}.jpg`,
            originalName: `image-${i + 1}.jpg`,
            path: `https://source.unsplash.com/random/800x600?sig=${i}`,
            uploadedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
          }));
          
          setCollection(mockCollection);
          setImages(mockImages);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching collection data:', error);
        setIsLoading(false);
      }
    };
    
    fetchCollectionData();
  }, [id]);

  const handleSelectImage = (imageId) => {
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(image => image.id));
    }
  };

  const handleDownloadSelected = () => {
    // This would be replaced with actual download functionality
    alert(`Downloading ${selectedImages.length} images`);
  };

  const handleDownloadAll = () => {
    // This would be replaced with actual download functionality
    alert(`Downloading all ${images.length} images`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewImage = (image) => {
    setViewingImage(image);
  };

  const handleCloseViewer = () => {
    setViewingImage(null);
  };

  const handleDownloadImage = (image) => {
    // This would be replaced with actual download functionality
    alert(`Downloading ${image.originalName}`);
  };

  return (
    <Container>
      <AnimatePresence mode="wait">
        {viewingImage ? (
          <ImageViewer
            key="viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ViewerControls>
              <CloseButton onClick={handleCloseViewer}>✕</CloseButton>
            </ViewerControls>
            
            <ViewerContent>
              <ViewerImage src={viewingImage.path} alt={viewingImage.originalName} />
            </ViewerContent>
            
            <ViewerActions>
              <ImageInfo>
                <ImageName>{viewingImage.originalName}</ImageName>
                <ImageMeta>Uploaded {formatDate(viewingImage.uploadedAt)}</ImageMeta>
              </ImageInfo>
              
              <DownloadButton onClick={() => handleDownloadImage(viewingImage)}>
                Download
              </DownloadButton>
            </ViewerActions>
          </ImageViewer>
        ) : (
          <motion.div
            key="collection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            {isLoading ? (
              <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>Loading collection...</LoadingText>
              </LoadingContainer>
            ) : (
              <>
                <CollectionHeader>
                  <CollectionInfo>
                    <CollectionTitle>{collection.name}</CollectionTitle>
                    <CollectionDescription>{collection.description}</CollectionDescription>
                    <CollectionMeta>Created {formatDate(collection.createdAt)}</CollectionMeta>
                  </CollectionInfo>
                  
                  <CollectionActions>
                    {selectedImages.length > 0 ? (
                      <ActionButton onClick={handleDownloadSelected}>
                        Download Selected ({selectedImages.length})
                      </ActionButton>
                    ) : (
                      <ActionButton onClick={handleDownloadAll}>
                        Download All ({images.length})
                      </ActionButton>
                    )}
                  </CollectionActions>
                </CollectionHeader>

                <SelectAllBar>
                  <SelectAllCheckbox>
                    <Checkbox
                      type="checkbox"
                      checked={selectedImages.length === images.length && images.length > 0}
                      onChange={handleSelectAll}
                      disabled={images.length === 0}
                    />
                    <SelectAllLabel>
                      {selectedImages.length === images.length && images.length > 0
                        ? 'Deselect All'
                        : 'Select All'}
                    </SelectAllLabel>
                  </SelectAllCheckbox>
                  
                  <SelectionCount>
                    {selectedImages.length > 0 && `${selectedImages.length} selected`}
                  </SelectionCount>
                </SelectAllBar>

                {images.length === 0 ? (
                  <EmptyState>
                    <EmptyMessage>No images found in this collection</EmptyMessage>
                  </EmptyState>
                ) : (
                  <ImagesGrid>
                    {images.map((image) => (
                      <ImageCard key={image.id}>
                        <ImageCardInner
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.2 }}
                          selected={selectedImages.includes(image.id)}
                        >
                          <ImageSelectOverlay>
                            <Checkbox
                              type="checkbox"
                              checked={selectedImages.includes(image.id)}
                              onChange={() => handleSelectImage(image.id)}
                            />
                          </ImageSelectOverlay>
                          
                          <ImageContainer onClick={() => handleViewImage(image)}>
                            <StyledImage src={image.path} alt={image.originalName} />
                          </ImageContainer>
                          
                          <ImageCardFooter>
                            <ImageFileName>{image.originalName}</ImageFileName>
                          </ImageCardFooter>
                        </ImageCardInner>
                      </ImageCard>
                    ))}
                  </ImagesGrid>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 0;
  position: relative;
  min-height: 60vh;
`;

const CollectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CollectionInfo = styled.div`
  flex: 1;
  min-width: 320px;
`;

const CollectionTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text.primary};
`;

const CollectionDescription = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 0.5rem;
`;

const CollectionMeta = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.tertiary};
`;

const CollectionActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1rem;
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

const SelectAllBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.surface.secondary};
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const SelectAllCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.primary};
`;

const SelectAllLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const SelectionCount = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
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

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ImageCard = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.surface.primary};
  box-shadow: ${({ theme }) => theme.shadow.small};
`;

const ImageCardInner = styled(motion.div)`
  position: relative;
  background-color: ${({ theme, selected }) => selected ? `${theme.primary}10` : 'transparent'};
  border: 2px solid ${({ theme, selected }) => selected ? theme.primary : 'transparent'};
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s ease;
`;

const ImageSelectOverlay = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 10;
  background-color: ${({ theme }) => theme.surface.primary};
  border-radius: 4px;
  padding: 0.25rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${ImageContainer}:hover & {
    transform: scale(1.05);
  }
`;

const ImageCardFooter = styled.div`
  padding: 0.75rem;
`;

const ImageFileName = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ImageViewer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.background.modal};
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const ViewerControls = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const ViewerContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ViewerImage = styled.img`
  max-width: 90%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow.large};
`;

const ViewerActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.surface.primary};
`;

const ImageInfo = styled.div`
  flex: 1;
`;

const ImageName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.text.primary};
`;

const ImageMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.tertiary};
`;

const DownloadButton = styled.button`
  padding: 0.75rem 1.5rem;
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

export default CollectionView;