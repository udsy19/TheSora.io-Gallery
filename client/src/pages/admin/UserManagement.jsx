import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', role: 'user' });

  useEffect(() => {
    // Mock fetch users
    const fetchUsers = async () => {
      try {
        // This would be replaced with an actual API call
        setTimeout(() => {
          setUsers([
            { id: '1', username: 'user1', role: 'user', lastLogin: '2023-05-10T14:30:00Z', collections: 5 },
            { id: '2', username: 'user2', role: 'user', lastLogin: '2023-05-12T09:15:00Z', collections: 3 },
            { id: '3', username: 'user3', role: 'user', lastLogin: '2023-05-08T16:45:00Z', collections: 7 },
            { id: '4', username: 'admin1', role: 'admin', lastLogin: '2023-05-13T11:20:00Z', collections: 12 },
            { id: '5', username: 'user4', role: 'user', lastLogin: null, collections: 0 }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

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
    setSelectedUsers([]);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    // This would make an API call to create a new user
    const newUserId = Math.random().toString(36).substring(2, 9);
    const createdUser = {
      id: newUserId,
      username: newUser.username,
      role: newUser.role,
      lastLogin: null,
      collections: 0
    };
    
    setUsers(prev => [...prev, createdUser]);
    setNewUser({ username: '', role: 'user' });
    setIsCreatingUser(false);
  };

  return (
    <Container>
      <Header>
        <h1>User Management</h1>
        <p>Manage your gallery users</p>
      </Header>

      <ActionsBar>
        <SelectAllWrapper>
          <Checkbox
            type="checkbox"
            checked={selectedUsers.length === users.length && users.length > 0}
            onChange={handleSelectAll}
            disabled={users.length === 0}
          />
          <span>{selectedUsers.length} selected</span>
        </SelectAllWrapper>
        
        <ActionButtons>
          {selectedUsers.length > 0 ? (
            <DeleteButton onClick={handleDeleteUsers}>
              Delete Selected
            </DeleteButton>
          ) : (
            <CreateButton onClick={() => setIsCreatingUser(true)}>
              Create User
            </CreateButton>
          )}
        </ActionButtons>
      </ActionsBar>

      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading users...</LoadingText>
        </LoadingContainer>
      ) : (
        <>
          {users.length === 0 ? (
            <EmptyState>
              <EmptyMessage>No users found</EmptyMessage>
              <CreateButton onClick={() => setIsCreatingUser(true)}>
                Create First User
              </CreateButton>
            </EmptyState>
          ) : (
            <UsersTable>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell width="40px"></TableHeaderCell>
                  <TableHeaderCell>Username</TableHeaderCell>
                  <TableHeaderCell>Role</TableHeaderCell>
                  <TableHeaderCell>Collections</TableHeaderCell>
                  <TableHeaderCell>Last Login</TableHeaderCell>
                </TableRow>
              </TableHeader>
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
                    <TableCell>
                      <RoleBadge role={user.role}>
                        {user.role}
                      </RoleBadge>
                    </TableCell>
                    <TableCell>{user.collections}</TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </UsersTable>
          )}
        </>
      )}

      {isCreatingUser && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>Create New User</h2>
              <CloseButton onClick={() => setIsCreatingUser(false)}>✕</CloseButton>
            </ModalHeader>
            
            <form onSubmit={handleCreateUser}>
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
              
              <ModalActions>
                <CancelButton type="button" onClick={() => setIsCreatingUser(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  Create User
                </SubmitButton>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
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

const UsersTable = styled.table`
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

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${({ theme, role }) => 
    role === 'admin' ? `${theme.status.info}20` : `${theme.primary}20`};
  color: ${({ theme, role }) => 
    role === 'admin' ? theme.status.info : theme.primary};
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

const Select = styled.select`
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

export default UserManagement;