import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isBulkCreating, setIsBulkCreating] = useState(false);
  const [isManagingAccess, setIsManagingAccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ 
    username: '', 
    email: '',
    firstName: '',
    lastName: '',
    role: 'user' 
  });
  const [bulkUsers, setBulkUsers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'lastLogin', direction: 'desc' });
  const itemsPerPage = 10;

  useEffect(() => {
    // Mock fetch users with pagination
    const fetchUsers = async () => {
      try {
        // This would be replaced with an actual API call
        setTimeout(() => {
          const mockUsers = Array.from({ length: 25 }, (_, i) => ({
            id: `user-${i + 1}`,
            username: `user${i + 1}`,
            email: `user${i + 1}@example.com`,
            firstName: `First${i + 1}`,
            lastName: `Last${i + 1}`,
            role: i === 0 ? 'admin' : 'user',
            lastLogin: i % 3 === 0 ? new Date(Date.now() - i * 1000000).toISOString() : null,
            collections: Math.floor(Math.random() * 10),
            status: i % 5 === 0 ? 'inactive' : 'active'
          }));
          
          // Sort users based on sortConfig
          const sortedUsers = [...mockUsers].sort((a, b) => {
            if (a[sortConfig.key] === null) return 1;
            if (b[sortConfig.key] === null) return -1;
            
            if (sortConfig.direction === 'asc') {
              return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
            } else {
              return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
            }
          });
          
          // Filter users based on search term
          const filteredUsers = sortedUsers.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          // Calculate pagination
          setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
          
          // Get current page items
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
          
          setUsers(paginatedUsers);
          setIsLoading(false);
          
          // Also fetch collections for access management
          const mockCollections = [
            { id: 'coll-1', name: 'Wedding Photos' },
            { id: 'coll-2', name: 'Portrait Session' },
            { id: 'coll-3', name: 'Family Portraits' }
          ];
          setCollections(mockCollections);
        }, 800);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [searchTerm, currentPage, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteUsers = () => {
    // This would make an API call to delete the selected users
    const remainingUsers = users.filter(user => !selectedUsers.includes(user.id));
    setUsers(remainingUsers);
    toast.success(`${selectedUsers.length} users deleted successfully`);
    setSelectedUsers([]);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    // This would make an API call to create a new user
    const newUserId = Math.random().toString(36).substring(2, 9);
    const password = generatePassword();
    
    const createdUser = {
      id: newUserId,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role, // This can be 'admin' or 'user'
      lastLogin: null,
      collections: 0,
      status: 'active',
      password // This would be hashed on the server
    };
    
    setUsers(prev => [createdUser, ...prev]);
    
    const successMessage = newUser.role === 'admin' 
      ? `Admin user created successfully with password: ${password}` 
      : `User created successfully with password: ${password}`;
    
    toast.success(successMessage);
    setNewUser({ username: '', email: '', firstName: '', lastName: '', role: 'user' });
    setIsCreatingUser(false);
    
    // If this is an admin user, you might want to log it or notify
    if (newUser.role === 'admin') {
      console.log('New admin user created:', createdUser.username);
      // Here you might add additional API calls or logic specific to admin users
      // For example, granting additional permissions or sending notifications
    }
  };
  
  const handleBulkCreate = () => {
    // Create 1 to 5 bulk users
    const count = parseInt(document.getElementById('bulkCount').value) || 1;
    const role = document.getElementById('bulkRole').value;
    
    const newUsers = [];
    for (let i = 0; i < count; i++) {
      const newUserId = Math.random().toString(36).substring(2, 9);
      const username = `user${Math.random().toString(36).substring(2, 7)}`;
      const password = generatePassword();
      
      const newUser = {
        id: newUserId,
        username,
        email: `${username}@example.com`,
        firstName: `User`,
        lastName: `${i+1}`,
        role,
        lastLogin: null,
        collections: 0,
        status: 'active',
        password // This would be hashed on the server
      };
      
      newUsers.push(newUser);
    }
    
    setBulkUsers(newUsers);
  };
  
  const confirmBulkCreate = () => {
    setUsers(prev => [...bulkUsers, ...prev]);
    toast.success(`${bulkUsers.length} users created successfully`);
    setBulkUsers([]);
    setIsBulkCreating(false);
  };
  
  const handleManageAccess = (e) => {
    e.preventDefault();
    
    toast.success(`Access updated for ${selectedUsers.length} users`);
    setIsManagingAccess(false);
    setSelectedCollections([]);
  };
  
  const handleCollectionSelect = (collectionId) => {
    setSelectedCollections(prev => {
      if (prev.includes(collectionId)) {
        return prev.filter(id => id !== collectionId);
      } else {
        return [...prev, collectionId];
      }
    });
  };
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard');
  };

  return (
    <Container>
      <Header>
        <PageTitle>User Management</PageTitle>
        <SubTitle>Manage user accounts and access to collections</SubTitle>
      </Header>

      <ActionBar>
        <SearchContainer>
          <SearchIcon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <ClearSearch onClick={() => setSearchTerm('')}>×</ClearSearch>
          )}
        </SearchContainer>
        
        <ActionButtons>
          {selectedUsers.length > 0 ? (
            <>
              <Button onClick={() => setIsManagingAccess(true)}>
                Manage Access
              </Button>
              <DeleteButton onClick={handleDeleteUsers}>
                Delete ({selectedUsers.length})
              </DeleteButton>
            </>
          ) : (
            <>
              <Button onClick={() => setIsBulkCreating(true)}>
                Bulk Create
              </Button>
              <CreateButton onClick={() => setIsCreatingUser(true)}>
                Create User
              </CreateButton>
            </>
          )}
        </ActionButtons>
      </ActionBar>

      {isLoading ? (
        <LoadingContainer>
          <Spinner />
          <LoadingText>Loading users...</LoadingText>
        </LoadingContainer>
      ) : (
        <>
          <TableContainer>
            <SelectAllBar>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  disabled={users.length === 0}
                />
                <span>{selectedUsers.length} selected</span>
              </CheckboxContainer>
              
              <PaginationInfo>
                Showing {users.length} of {totalPages * itemsPerPage} users
              </PaginationInfo>
            </SelectAllBar>
            
            {users.length === 0 ? (
              <EmptyState>
                <EmptyIcon>👥</EmptyIcon>
                <EmptyTitle>No users found</EmptyTitle>
                <EmptyText>
                  {searchTerm 
                    ? `No users matching "${searchTerm}"` 
                    : "You haven't created any users yet"}
                </EmptyText>
                {!searchTerm && (
                  <CreateButton onClick={() => setIsCreatingUser(true)}>
                    Create First User
                  </CreateButton>
                )}
              </EmptyState>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell width="40px"></TableHeaderCell>
                    <SortableHeaderCell 
                      onClick={() => handleSort('username')}
                      active={sortConfig.key === 'username'}
                      direction={sortConfig.direction}
                    >
                      Username
                    </SortableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Role</TableHeaderCell>
                    <SortableHeaderCell 
                      onClick={() => handleSort('collections')}
                      active={sortConfig.key === 'collections'}
                      direction={sortConfig.direction}
                    >
                      Collections
                    </SortableHeaderCell>
                    <SortableHeaderCell 
                      onClick={() => handleSort('lastLogin')}
                      active={sortConfig.key === 'lastLogin'}
                      direction={sortConfig.direction}
                    >
                      Last Login
                    </SortableHeaderCell>
                    <SortableHeaderCell 
                      onClick={() => handleSort('status')}
                      active={sortConfig.key === 'status'}
                      direction={sortConfig.direction}
                    >
                      Status
                    </SortableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                        />
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>
                        <RoleBadge role={user.role}>
                          {user.role}
                        </RoleBadge>
                      </TableCell>
                      <TableCell>{user.collections}</TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell>
                        <StatusBadge status={user.status}>
                          {user.status}
                        </StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {totalPages > 1 && (
              <PaginationControls>
                <PaginationButton 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  ← Previous
                </PaginationButton>
                
                <PaginationPages>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationPage
                      key={i}
                      active={currentPage === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </PaginationPage>
                  ))}
                </PaginationPages>
                
                <PaginationButton 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next →
                </PaginationButton>
              </PaginationControls>
            )}
          </TableContainer>
        </>
      )}

      {/* Create User Modal */}
      <AnimatePresence>
        {isCreatingUser && (
          <Modal
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalOverlay onClick={() => setIsCreatingUser(false)} />
            <ModalContent
              as={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <ModalHeader>
                <ModalTitle>Create New User</ModalTitle>
                <CloseButton onClick={() => setIsCreatingUser(false)}>×</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleCreateUser}>
                <ModalBody>
                  <FormRow>
                    <FormGroup>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow>
                    <FormGroup>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <FormGroup>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      id="role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </FormGroup>
                  
                  <NoteText>
                    A random password will be generated for this user.
                  </NoteText>
                </ModalBody>
                
                <ModalFooter>
                  <CancelButton type="button" onClick={() => setIsCreatingUser(false)}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit">
                    Create User
                  </SubmitButton>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Bulk Create Users Modal */}
      <AnimatePresence>
        {isBulkCreating && (
          <Modal
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalOverlay onClick={() => setIsBulkCreating(false)} />
            <ModalContent
              as={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <ModalHeader>
                <ModalTitle>Bulk Create Users</ModalTitle>
                <CloseButton onClick={() => setIsBulkCreating(false)}>×</CloseButton>
              </ModalHeader>
              
              <ModalBody>
                {bulkUsers.length === 0 ? (
                  <div>
                    <FormRow>
                      <FormGroup>
                        <Label htmlFor="bulkCount">Number of Users</Label>
                        <Input
                          id="bulkCount"
                          type="number"
                          min="1"
                          max="20"
                          defaultValue="5"
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="bulkRole">Role</Label>
                        <Select id="bulkRole" defaultValue="user">
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </Select>
                      </FormGroup>
                    </FormRow>
                    
                    <Button
                      type="button"
                      onClick={handleBulkCreate}
                      style={{ width: '100%', marginTop: '1rem' }}
                    >
                      Generate Users
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ marginBottom: '1rem' }}>Generated {bulkUsers.length} Users</h3>
                    <BulkUsersTable>
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Password</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkUsers.map(user => (
                          <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                              <PasswordField>
                                <PasswordText>{user.password}</PasswordText>
                                <CopyButton onClick={() => handleCopyPassword(user.password)}>
                                  Copy
                                </CopyButton>
                              </PasswordField>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </BulkUsersTable>
                    
                    <NoteText style={{ marginTop: '1rem' }}>
                      These passwords will not be shown again. Make sure to copy them.
                    </NoteText>
                  </div>
                )}
              </ModalBody>
              
              <ModalFooter>
                <CancelButton type="button" onClick={() => {
                  setIsBulkCreating(false);
                  setBulkUsers([]);
                }}>
                  Cancel
                </CancelButton>
                {bulkUsers.length > 0 && (
                  <SubmitButton type="button" onClick={confirmBulkCreate}>
                    Create {bulkUsers.length} Users
                  </SubmitButton>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Manage Access Modal */}
      <AnimatePresence>
        {isManagingAccess && (
          <Modal
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalOverlay onClick={() => setIsManagingAccess(false)} />
            <ModalContent
              as={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <ModalHeader>
                <ModalTitle>Manage Access for {selectedUsers.length} Users</ModalTitle>
                <CloseButton onClick={() => setIsManagingAccess(false)}>×</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleManageAccess}>
                <ModalBody>
                  <FormGroup>
                    <Label>Selected Users</Label>
                    <SelectedItemsContainer>
                      {selectedUsers.map(userId => {
                        const user = users.find(u => u.id === userId);
                        return (
                          <SelectedItem key={userId}>
                            {user?.username}
                          </SelectedItem>
                        );
                      })}
                    </SelectedItemsContainer>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Grant Access to Collections</Label>
                    <CollectionsGrid>
                      {collections.map(collection => (
                        <CollectionCard
                          key={collection.id}
                          selected={selectedCollections.includes(collection.id)}
                          onClick={() => handleCollectionSelect(collection.id)}
                        >
                          <CollectionName>{collection.name}</CollectionName>
                          <CheckmarkIcon visible={selectedCollections.includes(collection.id)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </CheckmarkIcon>
                        </CollectionCard>
                      ))}
                    </CollectionsGrid>
                  </FormGroup>
                </ModalBody>
                
                <ModalFooter>
                  <CancelButton type="button" onClick={() => setIsManagingAccess(false)}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit">
                    Update Access
                  </SubmitButton>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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
  
  &:hover {
    background-color: var(--color-surface-tertiary);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 154, 139, 0.2);
  }
`;

const CreateButton = styled(Button)`
  background-color: var(--color-primary);
  color: white;
  border: none;
  
  &:hover {
    background-color: var(--color-accent);
  }
`;

const DeleteButton = styled(Button)`
  background-color: var(--color-status-error);
  color: white;
  border: none;
  
  &:hover {
    background-color: rgba(255, 69, 58, 0.8);
  }
`;

const TableContainer = styled.div`
  background-color: var(--color-surface-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-small);
  overflow: hidden;
`;

const SelectAllBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-surface-secondary);
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

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-primary);
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
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

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const TableHead = styled.thead`
  background-color: var(--color-surface-secondary);
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border-primary);
  }
  
  &:hover {
    background-color: var(--color-surface-secondary);
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
  width: ${({ width }) => width || 'auto'};
`;

const SortableHeaderCell = styled(TableHeaderCell)`
  cursor: pointer;
  transition: color 0.2s ease;
  position: relative;
  
  &:hover {
    color: var(--color-text-primary);
  }
  
  &::after {
    content: ${props => props.active ? 
      props.direction === 'asc' ? '"↑"' : '"↓"' 
      : '""'};
    position: absolute;
    margin-left: 0.5rem;
    color: var(--color-primary);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: var(--color-text-primary);
  font-size: 0.875rem;
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${({ role, theme }) => 
    role === 'admin' ? 'rgba(10, 132, 255, 0.1)' : 'rgba(255, 154, 139, 0.1)'};
  color: ${({ role, theme }) => 
    role === 'admin' ? 'var(--color-status-info)' : 'var(--color-primary)'};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${({ status }) => 
    status === 'active' ? 'rgba(50, 215, 75, 0.1)' : 'rgba(255, 159, 10, 0.1)'};
  color: ${({ status }) => 
    status === 'active' ? 'var(--color-status-success)' : 'var(--color-status-warning)'};
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid var(--color-border-primary);
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    background-color: var(--color-surface-tertiary);
  }
`;

const PaginationPages = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PaginationPage = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: ${({ active }) => 
    active ? 'var(--color-primary)' : 'var(--color-surface-secondary)'};
  color: ${({ active }) => 
    active ? 'white' : 'var(--color-text-primary)'};
  border: 1px solid ${({ active }) => 
    active ? 'var(--color-primary)' : 'var(--color-border-primary)'};
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ active }) => 
      active ? 'var(--color-accent)' : 'var(--color-surface-tertiary)'};
  }
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
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
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
  padding: 1.5rem;
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
  font-size: 1.5rem;
  color: var(--color-text-tertiary);
  cursor: pointer;
  
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
  padding: 1.5rem;
  border-top: 1px solid var(--color-border-primary);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
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
  color: var(--color-text-secondary);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
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

const CancelButton = styled(Button)``;

const SubmitButton = styled(CreateButton)``;

const NoteText = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  font-style: italic;
`;

const BulkUsersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--color-border-primary);
    font-size: 0.875rem;
  }
  
  th {
    font-weight: 600;
    color: var(--color-text-secondary);
  }
`;

const PasswordField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PasswordText = styled.code`
  font-family: monospace;
  padding: 0.25rem 0.5rem;
  background-color: var(--color-surface-tertiary);
  border-radius: 4px;
`;

const CopyButton = styled.button`
  background-color: var(--color-surface-tertiary);
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-surface-quaternary);
  }
`;

const SelectedItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--color-surface-secondary);
  border-radius: 8px;
  min-height: 60px;
`;

const SelectedItem = styled.div`
  background-color: var(--color-surface-tertiary);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const CollectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
`;

const CollectionCard = styled.div`
  background-color: ${({ selected }) => selected ? 'rgba(255, 154, 139, 0.1)' : 'var(--color-surface-secondary)'};
  border: 1px solid ${({ selected }) => selected ? 'var(--color-primary)' : 'var(--color-border-primary)'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }
`;

const CollectionName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const CheckmarkIcon = styled.div`
  color: var(--color-primary);
  opacity: ${({ visible }) => visible ? 1 : 0};
  transition: opacity 0.2s ease;
`;

export default UserManagement;