import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const CollectionManagement = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });
  const [activeCollection, setActiveCollection] = useState(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  useEffect(() => {
    // Mock fetch collections
    const fetchCollections = async () => {
      try {
        // This would be replaced with an actual API call
        setTimeout(() => {
          setCollections([
            { 
              id: '1', 
              name: 'Wedding Photos', 
              description: 'Wedding photoshoot collection',
              imageCount: 124,
              createdAt: '2023-04-15T10:30:00Z',
              accessCount: 15,
              createdBy: 'admin1'
            },
            { 
              id: '2', 
              name: 'Portrait Session', 
              description: 'Professional portrait photos',
              imageCount: 45,
              createdAt: '2023-04-22T14:45:00Z',
              accessCount: 8,
              createdBy: 'admin1'
            },
            { 
              id: '3', 
              name: 'Family Portraits', 
              description: 'Family photoshoot at the park',
              imageCount: 78,
              createdAt: '2023-05-05T09:15:00Z',
              accessCount: 12,
              createdBy: 'admin1'
            },
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

  const handleDeleteCollections = () => {
    // This would make an API call to delete the selected collections
    const remainingCollections = collections.filter(collection => !selectedCollections.includes(collection.id));
    setCollections(remainingCollections);
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
      createdBy: 'admin1' // Current user
    };
    
    setCollections(prev => [...prev, createdCollection]);
    setNewCollection({ name: '', description: '' });
    setIsCreatingCollection(false);
  };

  const handleViewCollection = (collection) => {
    setActiveCollection(collection);
  };

  const handleCloseCollectionView = () => {
    setActiveCollection(null);
    setIsUploadingImages(false);
  };

  const handleAddImages = () => {
    setIsUploadingImages(true);
  };

  return (
    <Container>
      <Header>
        <h1>Collection Management</h1>
        <p>Manage your photo collections</p>
      </Header>

      {activeCollection ? (
        <CollectionDetail>
          <CollectionDetailHeader>
            <BackButton onClick={handleCloseCollectionView}>← Back to Collections</BackButton>
            <h2>{activeCollection.name}</h2>
            <p>{activeCollection.description}</p>
          </CollectionDetailHeader>
          
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
              <StatLabel>Access Count</StatLabel>
              <StatValue>{activeCollection.accessCount}</StatValue>
            </StatItem>
          </CollectionStats>
          
          <CollectionActions>
            <ActionButton onClick={handleAddImages}>
              Upload Images
            </ActionButton>
            <ActionButton>
              Manage Access
            </ActionButton>
            <ActionButton className="delete">
              Delete Collection
            </ActionButton>
          </CollectionActions>
          
          {isUploadingImages ? (
            <UploadContainer>
              <UploadHeader>
                <h3>Upload Images</h3>
                <CloseButton onClick={() => setIsUploadingImages(false)}>✕</CloseButton>
              </UploadHeader>
              
              <UploadArea>
                <UploadIcon>📁</UploadIcon>
                <UploadText>Drag and drop images here or click to select files</UploadText>
                <UploadInput type="file" multiple accept="image/*" />
              </UploadArea>
            </UploadContainer>
          ) : (
            <ImagesGrid>
              <EmptyImages>
                <EmptyMessage>No images in this collection yet.</EmptyMessage>
                <UploadPrompt onClick={handleAddImages}>
                  Upload Images
                </UploadPrompt>
              </EmptyImages>
            </ImagesGrid>
          )}
        </CollectionDetail>
      ) : (
        <>
          <ActionsBar>
            <SelectAllWrapper>
              <Checkbox
                type="checkbox"
                checked={selectedCollections.length === collections.length && collections.length > 0}
                onChange={handleSelectAll}
                disabled={collections.length === 0}
              />
              <span>{selectedCollections.length} selected</span>
            </SelectAllWrapper>
            
            <ActionButtons>
              {selectedCollections.length > 0 ? (
                <DeleteButton onClick={handleDeleteCollections}>
                  Delete Selected
                </DeleteButton>
              ) : (
                <CreateButton onClick={() => setIsCreatingCollection(true)}>
                  Create Collection
                </CreateButton>
              )}
            </ActionButtons>
          </ActionsBar>

          {isLoading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>Loading collections...</LoadingText>
            </LoadingContainer>
          ) : (
            <>
              {collections.length === 0 ? (
                <EmptyState>
                  <EmptyMessage>No collections found</EmptyMessage>
                  <CreateButton onClick={() => setIsCreatingCollection(true)}>
                    Create First Collection
                  </CreateButton>
                </EmptyState>
              ) : (
                <CollectionsTable>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell width="40px"></TableHeaderCell>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>Images</TableHeaderCell>
                      <TableHeaderCell>Created</TableHeaderCell>
                      <TableHeaderCell>Access Count</TableHeaderCell>
                      <TableHeaderCell width="80px">Actions</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collections.map(collection => (
                      <TableRow key={collection.id}>
                        <TableCell>
                          <Checkbox
                            type="checkbox"
                            checked={selectedCollections.includes(collection.id)}
                            onChange={() => handleSelectCollection(collection.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <CollectionName>{collection.name}</CollectionName>
                          <CollectionDescription>{collection.description}</CollectionDescription>
                        </TableCell>
                        <TableCell>{collection.imageCount}</TableCell>
                        <TableCell>{formatDate(collection.createdAt)}</TableCell>
                        <TableCell>{collection.accessCount}</TableCell>
                        <TableCell>
                          <ViewButton onClick={() => handleViewCollection(collection)}>
                            View
                          </ViewButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </CollectionsTable>
              )}
            </>
          )}

          {isCreatingCollection && (
            <Modal>
              <ModalContent>
                <ModalHeader>
                  <h2>Create New Collection</h2>
                  <CloseButton onClick={() => setIsCreatingCollection(false)}>✕</CloseButton>
                </ModalHeader>
                
                <form onSubmit={handleCreateCollection}>
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
                  
                  <ModalActions>
                    <CancelButton type="button" onClick={() => setIsCreatingCollection(false)}>
                      Cancel
                    </CancelButton>
                    <SubmitButton type="submit">
                      Create Collection
                    </SubmitButton>
                  </ModalActions>
                </form>
              </ModalContent>
            </Modal>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.text.primary};
  }
  
  p {
    color: ${({ theme }) => theme.text.secondary};
  }
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.surface.primary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow.small};
`;

const SelectAllWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CreateButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

const DeleteButton = styled(Button)`
  background-color: ${({ theme }) => theme.status.error};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${({ theme }) => `${theme.status.error}cc`};
  }
`;

const ViewButton = styled(Button)`
  background-color: ${({ theme }) => theme.surface.tertiary};
  color: ${({ theme }) => theme.text.primary};
  border: none;
  padding: 0.25rem 0.5rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.surface.quaternary};
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  min-height: 300px;
  background-color: ${({ theme }) => theme.surface.secondary};
  border-radius: 12px;
  padding: 2rem;
`;

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 1.125rem;
`;

const CollectionsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: ${({ theme }) => theme.surface.primary};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.small};
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.surface.secondary};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.surface.secondary};
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
  width: ${({ width }) => width || 'auto'};
`;

const TableCell = styled.td`
  padding: 1rem;
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.875rem;
`;

const CollectionName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const CollectionDescription = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.tertiary};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.surface.primary};
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow.large};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.text.primary};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text.tertiary};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.surface.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.primary};
  transition: all 0.3s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}40`};
    outline: none;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.surface.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.primary};
  transition: all 0.3s ease;
  resize: vertical;
  
  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}40`};
    outline: none;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.border.primary};
  color: ${({ theme }) => theme.text.secondary};
  
  &:hover {
    background-color: ${({ theme }) => theme.surface.secondary};
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

const CollectionDetail = styled.div`
  background-color: ${({ theme }) => theme.surface.primary};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow.small};
`;

const CollectionDetailHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.5rem;
    margin: 1rem 0 0.5rem;
    color: ${({ theme }) => theme.text.primary};
  }
  
  p {
    color: ${({ theme }) => theme.text.secondary};
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: ${({ theme }) => theme.primary};
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CollectionStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.surface.secondary};
  border-radius: 8px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.tertiary};
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const CollectionActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  
  .delete {
    margin-left: auto;
    background-color: ${({ theme }) => theme.status.error};
    
    &:hover {
      background-color: ${({ theme }) => `${theme.status.error}cc`};
    }
  }
`;

const ActionButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

const ImagesGrid = styled.div`
  min-height: 300px;
`;

const EmptyImages = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 300px;
  background-color: ${({ theme }) => theme.surface.secondary};
  border-radius: 8px;
  padding: 2rem;
`;

const UploadPrompt = styled(Button)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

const UploadContainer = styled.div`
  background-color: ${({ theme }) => theme.surface.secondary};
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const UploadHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1.125rem;
    color: ${({ theme }) => theme.text.primary};
  }
`;

const UploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.border.secondary};
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => `${theme.primary}10`};
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 0;
`;

const UploadInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

export default CollectionManagement;