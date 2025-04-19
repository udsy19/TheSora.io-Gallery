import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import FileUploader from '../../components/common/FileUploader';
import { useStorage } from '../../context/StorageContext';

const CollectionManagement = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [activeCollection, setActiveCollection] = useState(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isSharingCollection, setIsSharingCollection] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCollection, setNewCollection] = useState({ 
    name: '', 
    description: '',
    isPublic: false
  });
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [collectionImages, setCollectionImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextItem, setContextItem] = useState(null);

  const { uploadFiles } = useStorage();

  useEffect(() => {
    // Mock fetch collections
    const fetchCollections = async () => {
      try {
        // This would be replaced with an actual API call
        setTimeout(() => {
          const mockCollections = Array.from({ length: 10 }, (_, i) => ({
            id: `coll-${i + 1}`,
            name: i === 0 ? 'Wedding Photos' : 
                  i === 1 ? 'Portrait Session' : 
                  i === 2 ? 'Family Portraits' : 
                  `Collection ${i + 1}`,
            description: `Description for collection ${i + 1}`,
            imageCount: Math.floor(Math.random() * 100) + 10,
            createdAt: new Date(Date.now() - i * 86400000).toISOString(),
            accessCount: Math.floor(Math.random() * 50),
            createdBy: 'admin1',
            isPublic: i % 3 === 0,
            sharedWith: i % 2 === 0 ? ['user1', 'user2'] : []
          }));
          
          // Sort collections based on sortConfig
          const sortedCollections = [...mockCollections].sort((a, b) => {
            if (sortConfig.direction === 'asc') {
              return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
            } else {
              return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
            }
          });
          
          // Filter collections based on search term
          const filteredCollections = sortedCollections.filter(collection => 
            collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            collection.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          setCollections(filteredCollections);
          setIsLoading(false);
          
          // Also fetch users for sharing
          const mockUsers = Array.from({ length: 10 }, (_, i) => ({
            id: `user-${i + 1}`,
            username: `user${i + 1}`,
            email: `user${i + 1}@example.com`,
            lastName: `Last${i + 1}`,
            firstName: `First${i + 1}`
          }));
          setUsers(mockUsers);
        }, 800);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setIsLoading(false);
      }
    };
    
    fetchCollections();
  }, [searchTerm, sortConfig]);
  
  useEffect(() => {
    if (activeCollection) {
      // Fetch images for active collection
      const fetchImages = async () => {
        try {
          // This would be replaced with an actual API call
          setTimeout(() => {
            const mockImages = Array.from({ length: activeCollection.imageCount }, (_, i) => ({
              id: `img-${i + 1}`,
              originalName: `image_${i + 1}.jpg`,
              path: `https://source.unsplash.com/random/300x300?sig=${i + activeCollection.id.length}`,
              size: Math.floor(Math.random() * 5000000) + 500000, // 500KB to 5MB
              uploadedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
              width: 1200,
              height: 800,
              thumbnailPath: `https://source.unsplash.com/random/300x300?sig=${i + activeCollection.id.length}`
            }));
            
            setCollectionImages(mockImages);
          }, 800);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      };
      
      fetchImages();
    } else {
      setCollectionImages([]);
    }
  }, [activeCollection]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectCollection = (collectionId) => {
    setSelectedCollections(prev => {
      if (prev.includes(collectionId)) {
        return prev.filter(id => id !== collectionId);
      } else {
        return [...prev, collectionId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCollections.length === collections.length) {
      setSelectedCollections([]);
    } else {
      setSelectedCollections(collections.map(collection => collection.id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleDeleteCollections = () => {
    // This would make an API call to delete the selected collections
    const remainingCollections = collections.filter(collection => !selectedCollections.includes(collection.id));
    setCollections(remainingCollections);
    toast.success(`${selectedCollections.length} collections deleted successfully`);
    setSelectedCollections([]);
  };

  const handleCreateCollection = (e) => {
    e.preventDefault();
    // This would make an API call to create a new collection
    const newCollectionId = Math.random().toString(36).substring(2, 9);
    const createdCollection = {
      id: newCollectionId,
      name: newCollection.name,
      description: newCollection.description,
      imageCount: 0,
      createdAt: new Date().toISOString(),
      accessCount: 0,
      createdBy: 'admin1',
      isPublic: newCollection.isPublic,
      sharedWith: []
    };
    
    setCollections(prev => [createdCollection, ...prev]);
    toast.success('Collection created successfully');
    setNewCollection({ name: '', description: '', isPublic: false });
    setIsCreatingCollection(false);
  };

  const handleViewCollection = (collection) => {
    setActiveCollection(collection);
    setSelectedImages([]);
  };

  const handleCloseCollectionView = () => {
    setActiveCollection(null);
    setIsUploadingImages(false);
    setSelectedImages([]);
  };

  const handleAddImages = () => {
    setIsUploadingImages(true);
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  const handleUpload = async (files) => {
    // This would be replaced with actual upload functionality
    try {
      const result = await uploadFiles(files, activeCollection.id);
      
      if (result.success) {
        // Update the active collection with new images
        setActiveCollection(prev => ({
          ...prev,
          imageCount: prev.imageCount + files.length
        }));
        
        // Update the collections list
        setCollections(prev => 
          prev.map(coll => 
            coll.id === activeCollection.id 
              ? { ...coll, imageCount: coll.imageCount + files.length }
              : coll
          )
        );
        
        // Create new mock images
        const newImages = files.map((file, i) => ({
          id: `new-img-${Date.now()}-${i}`,
          originalName: file.name,
          path: URL.createObjectURL(file),
          size: file.size,
          uploadedAt: new Date().toISOString(),
          width: 1200,
          height: 800,
          thumbnailPath: URL.createObjectURL(file)
        }));
        
        // Add to collection images
        setCollectionImages(prev => [...newImages, ...prev]);
        
        toast.success(`Uploaded ${files.length} images successfully`);
        setIsUploadingImages(false);
      } else {
        toast.error('Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    }
  };
  
  const handleSelectImage = (imageId) => {
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };
  
  const handleSelectAllImages = () => {
    if (selectedImages.length === collectionImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(collectionImages.map(image => image.id));
    }
  };
  
  const handleDeleteImages = () => {
    // This would make an API call to delete the selected images
    const remainingImages = collectionImages.filter(image => !selectedImages.includes(image.id));
    setCollectionImages(remainingImages);
    
    // Update the active collection with new count
    setActiveCollection(prev => ({
      ...prev,
      imageCount: prev.imageCount - selectedImages.length
    }));
    
    // Update the collections list
    setCollections(prev => 
      prev.map(coll => 
        coll.id === activeCollection.id 
          ? { ...coll, imageCount: coll.imageCount - selectedImages.length }
          : coll
      )
    );
    
    toast.success(`${selectedImages.length} images deleted successfully`);
    setSelectedImages([]);
  };
  
  const handleShareCollection = () => {
    setIsSharingCollection(true);
  };
  
  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  
  const handleShareSubmit = (e) => {
    e.preventDefault();
    
    // This would make an API call to share the collection
    const updatedCollection = {
      ...activeCollection,
      sharedWith: [...activeCollection.sharedWith, ...selectedUsers]
    };
    
    setActiveCollection(updatedCollection);
    
    // Update the collections list
    setCollections(prev => 
      prev.map(coll => 
        coll.id === activeCollection.id 
          ? updatedCollection
          : coll
      )
    );
    
    toast.success(`Collection shared with ${selectedUsers.length} users`);
    setIsSharingCollection(false);
    setSelectedUsers([]);
  };
  
  const handleImageContextMenu = (e, image) => {
    e.preventDefault();
    setContextItem(image);
    setContextMenuPosition({
      x: e.clientX,
      y: e.clientY
    });
    setShowContextMenu(true);
  };
  
  const handleCollectionContextMenu = (e, collection) => {
    e.preventDefault();
    setContextItem(collection);
    setContextMenuPosition({
      x: e.clientX,
      y: e.clientY
    });
    setShowContextMenu(true);
  };
  
  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
    setContextItem(null);
  };
  
  const handleContextAction = (action) => {
    // Handle context menu actions
    if (contextItem) {
      if (action === 'download') {
        if ('originalName' in contextItem) {
          // It's an image
          toast.success(`Downloading ${contextItem.originalName}`);
        } else {
          // It's a collection
          toast.success(`Downloading all images from ${contextItem.name}`);
        }
      } else if (action === 'share') {
        if ('originalName' in contextItem) {
          // It's an image
          toast.success(`Creating share link for ${contextItem.originalName}`);
        } else {
          // It's a collection
          setActiveCollection(contextItem);
          handleShareCollection();
        }
      } else if (action === 'delete') {
        if ('originalName' in contextItem) {
          // It's an image
          setSelectedImages([contextItem.id]);
          handleDeleteImages();
        } else {
          // It's a collection
          setSelectedCollections([contextItem.id]);
          handleDeleteCollections();
        }
      } else if (action === 'view') {
        if (!('originalName' in contextItem)) {
          // It's a collection
          handleViewCollection(contextItem);
        }
      }
    }
    
    setShowContextMenu(false);
    setContextItem(null);
  };
  
  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showContextMenu) {
        setShowContextMenu(false);
        setContextItem(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showContextMenu]);

  return (
    <Container>
      <Header>
        <PageTitle>
          {activeCollection ? (
            <BackButtonWrapper>
              <BackButton onClick={handleCloseCollectionView}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Collections
              </BackButton>
              <span>/</span>
              {activeCollection.name}
            </BackButtonWrapper>
          ) : (
            'Collection Management'
          )}
        </PageTitle>
        <SubTitle>
          {activeCollection ? activeCollection.description : 'Manage and organize your photo collections'}
        </SubTitle>
      </Header>

      {activeCollection ? (
        // Collection Detail View
        <>
          <ActionBar>
            <CollectionStats>
              <StatItem>
                <StatLabel>Images</StatLabel>
                <StatValue>{activeCollection.imageCount}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Created</StatLabel>
                <StatValue>{formatDate(activeCollection.createdAt)}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Views</StatLabel>
                <StatValue>{activeCollection.accessCount}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Status</StatLabel>
                <StatValue>
                  <StatusBadge isPublic={activeCollection.isPublic}>
                    {activeCollection.isPublic ? 'Public' : 'Private'}
                  </StatusBadge>
                </StatValue>
              </StatItem>
            </CollectionStats>
            
            <ActionButtons>
              {selectedImages.length > 0 ? (
                <DeleteButton onClick={handleDeleteImages}>
                  Delete ({selectedImages.length})
                </DeleteButton>
              ) : (
                <>
                  <Button onClick={handleShareCollection}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 6L12 2L8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 2V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Share
                  </Button>
                  <CreateButton onClick={handleAddImages}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add Images
                  </CreateButton>
                </>
              )}
            </ActionButtons>
          </ActionBar>
          
          {isUploadingImages ? (
            <UploadContainer>
              <UploadHeader>
                <h3>Upload Images</h3>
                <CloseButton onClick={() => setIsUploadingImages(false)}>×</CloseButton>
              </UploadHeader>
              
              <FileUploader 
                onUpload={handleUpload}
                multiple={true}
                accept="image/*"
                maxSize={10}
              />
            </UploadContainer>
          ) : (
            <>
              <SelectAllBar>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    checked={selectedImages.length === collectionImages.length && collectionImages.length > 0}
                    onChange={handleSelectAllImages}
                    disabled={collectionImages.length === 0}
                  />
                  <span>{selectedImages.length} selected</span>
                </CheckboxContainer>
              </SelectAllBar>
              
              {collectionImages.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                      <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </EmptyIcon>
                  <EmptyTitle>No images in this collection</EmptyTitle>
                  <EmptyText>Start by adding images to this collection</EmptyText>
                  <CreateButton onClick={handleAddImages}>
                    Upload Images
                  </CreateButton>
                </EmptyState>
              ) : (
                <ImagesGrid>
                  {collectionImages.map(image => (
                    <ImageCard
                      key={image.id}
                      selected={selectedImages.includes(image.id)}
                      onContextMenu={(e) => handleImageContextMenu(e, image)}
                    >
                      <ImageCheckbox>
                        <Checkbox
                          type="checkbox"
                          checked={selectedImages.includes(image.id)}
                          onChange={() => handleSelectImage(image.id)}
                        />
                      </ImageCheckbox>
                      
                      <ImageThumbnail src={image.thumbnailPath} alt={image.originalName} />
                      
                      <ImageInfo>
                        <ImageName>{image.originalName}</ImageName>
                        <ImageMeta>
                          {formatFileSize(image.size)} • Uploaded {formatDate(image.uploadedAt)}
                        </ImageMeta>
                      </ImageInfo>
                    </ImageCard>
                  ))}
                </ImagesGrid>
              )}
            </>
          )}
        </>
      ) : (
        // Collections List View
        <>
          <ActionBar>
            <SearchContainer>
              <SearchIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </SearchIcon>
              <SearchInput 
                type="text" 
                placeholder="Search collections..." 
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <ClearSearch onClick={handleClearSearch}>×</ClearSearch>
              )}
            </SearchContainer>
            
            <ActionButtons>
              {selectedCollections.length > 0 ? (
                <DeleteButton onClick={handleDeleteCollections}>
                  Delete ({selectedCollections.length})
                </DeleteButton>
              ) : (
                <CreateButton onClick={() => setIsCreatingCollection(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Create Collection
                </CreateButton>
              )}
            </ActionButtons>
          </ActionBar>

          {isLoading ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>Loading collections...</LoadingText>
            </LoadingContainer>
          ) : (
            <>
              {collections.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M3 14L8 9L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13 12L16 9L21 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="8.5" cy="7.5" r="1.5" fill="currentColor"/>
                    </svg>
                  </EmptyIcon>
                  <EmptyTitle>No collections found</EmptyTitle>
                  <EmptyText>
                    {searchTerm 
                      ? `No collections matching "${searchTerm}"` 
                      : "You haven't created any collections yet"}
                  </EmptyText>
                  {!searchTerm && (
                    <CreateButton onClick={() => setIsCreatingCollection(true)}>
                      Create Collection
                    </CreateButton>
                  )}
                </EmptyState>
              ) : (
                <CollectionsGrid>
                  {collections.map(collection => (
                    <CollectionCard
                      key={collection.id}
                      onContextMenu={(e) => handleCollectionContextMenu(e, collection)}
                    >
                      <CollectionCheckboxWrapper>
                        <Checkbox
                          type="checkbox"
                          checked={selectedCollections.includes(collection.id)}
                          onChange={() => handleSelectCollection(collection.id)}
                        />
                      </CollectionCheckboxWrapper>
                      
                      <CollectionContent onClick={() => handleViewCollection(collection)}>
                        <CollectionHeader>
                          <CollectionName>{collection.name}</CollectionName>
                          <CollectionStatus>
                            <StatusBadge isPublic={collection.isPublic}>
                              {collection.isPublic ? 'Public' : 'Private'}
                            </StatusBadge>
                          </CollectionStatus>
                        </CollectionHeader>
                        
                        <CollectionDescription>{collection.description}</CollectionDescription>
                        
                        <CollectionMeta>
                          <MetaItem>
                            <MetaIcon>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <path d="M3 14L8 9L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M13 12L16 9L21 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="8.5" cy="7.5" r="1.5" fill="currentColor"/>
                              </svg>
                            </MetaIcon>
                            {collection.imageCount} images
                          </MetaItem>
                          <MetaItem>
                            <MetaIcon>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </MetaIcon>
                            {formatDate(collection.createdAt)}
                          </MetaItem>
                        </CollectionMeta>
                        
                        {collection.sharedWith.length > 0 && (
                          <SharedUsers>
                            <MetaIcon>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </MetaIcon>
                            Shared with {collection.sharedWith.length} users
                          </SharedUsers>
                        )}
                      </CollectionContent>
                    </CollectionCard>
                  ))}
                </CollectionsGrid>
              )}
            </>
          )}
        </>
      )}

      {/* Create Collection Modal */}
      <AnimatePresence>
        {isCreatingCollection && (
          <Modal
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalOverlay onClick={() => setIsCreatingCollection(false)} />
            <ModalContent
              as={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <ModalHeader>
                <ModalTitle>Create New Collection</ModalTitle>
                <CloseButton onClick={() => setIsCreatingCollection(false)}>×</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleCreateCollection}>
                <ModalBody>
                  <FormGroup>
                    <Label htmlFor="name">Collection Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={newCollection.name}
                      onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCollection.description}
                      onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                      rows={4}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <CheckboxLabel>
                      <Checkbox
                        type="checkbox"
                        checked={newCollection.isPublic}
                        onChange={(e) => setNewCollection({ ...newCollection, isPublic: e.target.checked })}
                      />
                      <span>Make collection public</span>
                    </CheckboxLabel>
                    <HelpText>
                      Public collections can be viewed by anyone with the link
                    </HelpText>
                  </FormGroup>
                </ModalBody>
                
                <ModalFooter>
                  <CancelButton type="button" onClick={() => setIsCreatingCollection(false)}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit">
                    Create Collection
                  </SubmitButton>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Share Collection Modal */}
      <AnimatePresence>
        {isSharingCollection && (
          <Modal
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalOverlay onClick={() => setIsSharingCollection(false)} />
            <ModalContent
              as={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <ModalHeader>
                <ModalTitle>Share Collection</ModalTitle>
                <CloseButton onClick={() => setIsSharingCollection(false)}>×</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleShareSubmit}>
                <ModalBody>
                  <FormGroup>
                    <Label>Collection</Label>
                    <Input
                      type="text"
                      value={activeCollection.name}
                      readOnly
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Collection URL</Label>
                    <CopyLinkField>
                      <Input
                        type="text"
                        value={`https://gallery.thesora.io/shared/${activeCollection.id}`}
                        readOnly
                      />
                      <CopyButton
                        onClick={() => {
                          navigator.clipboard.writeText(`https://gallery.thesora.io/shared/${activeCollection.id}`);
                          toast.success('Link copied to clipboard');
                        }}
                      >
                        Copy
                      </CopyButton>
                    </CopyLinkField>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Share with Users</Label>
                    <UsersGrid>
                      {users.map(user => (
                        <UserCard
                          key={user.id}
                          selected={selectedUsers.includes(user.id)}
                          onClick={() => handleUserSelect(user.id)}
                        >
                          <UserAvatar>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </UserAvatar>
                          <UserInfo>
                            <UserName>
                              {user.firstName} {user.lastName}
                            </UserName>
                            <UserEmail>{user.email}</UserEmail>
                          </UserInfo>
                          <CheckmarkIcon visible={selectedUsers.includes(user.id)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </CheckmarkIcon>
                        </UserCard>
                      ))}
                    </UsersGrid>
                  </FormGroup>
                </ModalBody>
                
                <ModalFooter>
                  <CancelButton type="button" onClick={() => setIsSharingCollection(false)}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit" disabled={selectedUsers.length === 0}>
                    Share
                  </SubmitButton>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Context Menu */}
      <AnimatePresence>
        {showContextMenu && (
          <ContextMenu
            as={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            style={{
              top: `${contextMenuPosition.y}px`,
              left: `${contextMenuPosition.x}px`
            }}
          >
            {contextItem && 'originalName' in contextItem ? (
              // Image context menu
              <>
                <ContextMenuItem onClick={() => handleContextAction('download')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleContextAction('share')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Share
                </ContextMenuItem>
                <ContextMenuDivider />
                <ContextMenuItem onClick={() => handleContextAction('delete')} danger>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete
                </ContextMenuItem>
              </>
            ) : (
              // Collection context menu
              <>
                <ContextMenuItem onClick={() => handleContextAction('view')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  View
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleContextAction('download')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download All
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleContextAction('share')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Share
                </ContextMenuItem>
                <ContextMenuDivider />
                <ContextMenuItem onClick={() => handleContextAction('delete')} danger>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete
                </ContextMenuItem>
              </>
            )}
          </ContextMenu>
        )}
      </AnimatePresence>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
`;

const SubTitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
`;

const BackButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    color: var(--color-text-tertiary);
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--color-primary);
  padding: 0;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  
  &:hover {
    color: var(--color-accent);
    text-decoration: underline;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem;
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 8px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(255, 154, 139, 0.2);
  }
`;

const ClearSearch = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  font-size: 1.25rem;
  cursor: pointer;
  
  &:hover {
    color: var(--color-text-primary);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: 0.625rem 1rem;
  background-color: var(--color-surface-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  
  svg {
    color: var(--color-text-tertiary);
  }
  
  &:hover {
    background-color: var(--color-surface-tertiary);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 154, 139, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CreateButton = styled(Button)`
  background-color: var(--color-primary);
  color: white;
  border: none;
  
  svg {
    color: white;
  }
  
  &:hover {
    background-color: var(--color-accent);
  }
`;

const DeleteButton = styled(Button)`
  background-color: var(--color-status-error);
  color: white;
  border: none;
  
  svg {
    color: white;
  }
  
  &:hover {
    background-color: rgba(255, 69, 58, 0.8);
  }
`;

const CollectionStats = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${({ isPublic }) => 
    isPublic ? 'rgba(50, 215, 75, 0.1)' : 'rgba(202, 189, 255, 0.1)'};
  color: ${({ isPublic }) => 
    isPublic ? 'var(--color-status-success)' : 'var(--color-secondary)'};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background-color: var(--color-surface-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-small);
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 154, 139, 0.1);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: var(--color-text-secondary);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  min-height: 300px;
  padding: 3rem 1rem;
  text-align: center;
  background-color: var(--color-surface-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-small);
`;

const EmptyIcon = styled.div`
  color: var(--color-text-quaternary);
`;

const EmptyTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const EmptyText = styled.p`
  color: var(--color-text-tertiary);
  max-width: 30rem;
  margin: 0 auto;
`;

const CollectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CollectionCard = styled.div`
  background-color: var(--color-surface-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-small);
  overflow: hidden;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
`;

const CollectionCheckboxWrapper = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  padding: 0.25rem;
  backdrop-filter: blur(2px);
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--color-primary);
`;

const CollectionContent = styled.div`
  padding: 1.5rem;
  cursor: pointer;
`;

const CollectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const CollectionName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`;

const CollectionStatus = styled.div`
  margin-left: 0.5rem;
`;

const CollectionDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
`;

const CollectionMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
`;

const MetaIcon = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-text-tertiary);
`;

const SharedUsers = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  background-color: var(--color-surface-secondary);
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  width: fit-content;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: relative;
  width: 95%;
  max-width: 600px;
  max-height: 90vh;
  background-color: var(--color-surface-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-large);
  z-index: 1001;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border-primary);
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  
  &:hover {
    color: var(--color-text-primary);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 150px);
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--color-border-primary);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(255, 154, 139, 0.2);
  }
  
  &:read-only {
    background-color: var(--color-surface-tertiary);
    cursor: default;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(255, 154, 139, 0.2);
  }
`;

const CancelButton = styled(Button)``;

const SubmitButton = styled(CreateButton)``;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-text-primary);
`;

const HelpText = styled.p`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
`;

const UploadContainer = styled.div`
  background-color: var(--color-surface-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-small);
`;

const UploadHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }
`;

const SelectAllBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: var(--color-surface-primary);
  border-radius: 12px 12px 0 0;
  box-shadow: var(--shadow-small);
  border-bottom: 1px solid var(--color-border-primary);
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  background-color: var(--color-surface-primary);
  padding: 1.5rem;
  border-radius: 0 0 12px 12px;
  box-shadow: var(--shadow-small);
`;

const ImageCard = styled.div`
  background-color: var(--color-surface-secondary);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: var(--shadow-small);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 2px solid ${({ selected }) => selected ? 'var(--color-primary)' : 'transparent'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
`;

const ImageCheckbox = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  padding: 0.25rem;
  backdrop-filter: blur(2px);
`;

const ImageThumbnail = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

const ImageInfo = styled.div`
  padding: 0.75rem;
`;

const ImageName = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ImageMeta = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
`;

const CopyLinkField = styled.div`
  display: flex;
  align-items: center;
  
  ${Input} {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const CopyButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-accent);
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

const UserCard = styled.div`
  background-color: ${({ selected }) => selected ? 'rgba(255, 154, 139, 0.1)' : 'var(--color-surface-secondary)'};
  border: 1px solid ${({ selected }) => selected ? 'var(--color-primary)' : 'var(--color-border-primary)'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CheckmarkIcon = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  color: var(--color-primary);
  opacity: ${({ visible }) => visible ? 1 : 0};
  transition: opacity 0.2s ease;
`;

const ContextMenu = styled.div`
  position: fixed;
  background-color: var(--color-surface-primary);
  border-radius: 8px;
  box-shadow: var(--shadow-large);
  padding: 0.5rem;
  min-width: 160px;
  z-index: 1010;
  transform-origin: top left;
`;

const ContextMenuItem = styled.div`
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: ${({ danger }) => danger ? 'var(--color-status-error)' : 'var(--color-text-primary)'};
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${({ danger }) => danger ? 'var(--color-status-error)' : 'var(--color-text-tertiary)'};
  }
  
  &:hover {
    background-color: var(--color-surface-secondary);
  }
`;

const ContextMenuDivider = styled.div`
  height: 1px;
  background-color: var(--color-border-primary);
  margin: 0.25rem 0;
`;

export default CollectionManagement;