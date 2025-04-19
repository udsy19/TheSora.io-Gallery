import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      totalImages: 0,
      totalCollections: 0,
      totalLogins: 0,
      totalDownloads: 0,
      totalViews: 0,
      activityByDay: []
    },
    logins: {
      loginsByDay: [],
      loginsByUser: []
    },
    downloads: {
      downloadsByDay: [],
      downloadsByUser: [],
      downloadsByCollection: [],
      downloadsByImage: []
    }
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // This would be replaced with an actual API call
        setTimeout(() => {
          // Generate mock data
          const dates = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toISOString().split('T')[0];
          });
          
          const activityByDay = dates.map(date => ({
            date,
            logins: Math.floor(Math.random() * 20),
            downloads: Math.floor(Math.random() * 50),
            views: Math.floor(Math.random() * 100)
          }));
          
          const loginsByUser = [
            { username: 'user1', count: 45, lastLogin: '2023-05-13T10:30:00Z' },
            { username: 'user2', count: 32, lastLogin: '2023-05-12T15:45:00Z' },
            { username: 'user3', count: 28, lastLogin: '2023-05-13T08:20:00Z' },
            { username: 'user4', count: 21, lastLogin: '2023-05-11T14:10:00Z' },
            { username: 'user5', count: 18, lastLogin: '2023-05-10T11:55:00Z' }
          ];
          
          const downloadsByCollection = [
            { name: 'Wedding Photos', count: 210 },
            { name: 'Portrait Session', count: 185 },
            { name: 'Family Portraits', count: 142 },
            { name: 'Product Shoot', count: 98 },
            { name: 'Corporate Event', count: 76 }
          ];
          
          const downloadsByImage = [
            { name: 'wedding_001.jpg', count: 28 },
            { name: 'portrait_015.jpg', count: 24 },
            { name: 'family_022.jpg', count: 19 },
            { name: 'wedding_045.jpg', count: 17 },
            { name: 'portrait_008.jpg', count: 15 }
          ];
          
          setAnalytics({
            overview: {
              totalUsers: 157,
              totalImages: 3842,
              totalCollections: 68,
              totalLogins: 523,
              totalDownloads: 1842,
              totalViews: 7256,
              activityByDay
            },
            logins: {
              loginsByDay: activityByDay.map(day => ({ date: day.date, logins: day.logins })),
              loginsByUser
            },
            downloads: {
              downloadsByDay: activityByDay.map(day => ({ date: day.date, downloads: day.downloads })),
              downloadsByUser: loginsByUser.map(user => ({ 
                username: user.username, 
                count: Math.floor(Math.random() * 100) + 20
              })),
              downloadsByCollection,
              downloadsByImage
            }
          });
          
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const COLORS = ['#FF9A8B', '#CABDFF', '#A0FFE6', '#FFCB91', '#91D5FF'];

  return (
    <Container>
      <Header>
        <h1>Analytics</h1>
        <p>Detailed insights about your gallery usage</p>
      </Header>

      <TabsContainer>
        <Tab 
          onClick={() => setActiveTab('overview')} 
          active={activeTab === 'overview'}
        >
          Overview
        </Tab>
        <Tab 
          onClick={() => setActiveTab('logins')} 
          active={activeTab === 'logins'}
        >
          Login Analytics
        </Tab>
        <Tab 
          onClick={() => setActiveTab('downloads')} 
          active={activeTab === 'downloads'}
        >
          Download Analytics
        </Tab>
      </TabsContainer>

      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading analytics data...</LoadingText>
        </LoadingContainer>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div>
              <StatCardsContainer>
                <StatCard>
                  <StatTitle>Users</StatTitle>
                  <StatValue>{analytics.overview.totalUsers.toLocaleString()}</StatValue>
                </StatCard>
                
                <StatCard>
                  <StatTitle>Images</StatTitle>
                  <StatValue>{analytics.overview.totalImages.toLocaleString()}</StatValue>
                </StatCard>
                
                <StatCard>
                  <StatTitle>Collections</StatTitle>
                  <StatValue>{analytics.overview.totalCollections.toLocaleString()}</StatValue>
                </StatCard>
                
                <StatCard>
                  <StatTitle>Downloads</StatTitle>
                  <StatValue>{analytics.overview.totalDownloads.toLocaleString()}</StatValue>
                </StatCard>
              </StatCardsContainer>

              <ChartCard>
                <ChartHeader>
                  <h2>Activity Overview (Last 30 Days)</h2>
                </ChartHeader>
                
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analytics.overview.activityByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEEEF0" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      stroke="#8A8A8E"
                    />
                    <YAxis stroke="#8A8A8E" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EEEEF0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                      }}
                      formatter={(value) => [value, '']}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#A0FFE6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Views"
                    />
                    <Line
                      type="monotone"
                      dataKey="downloads"
                      stroke="#FF9A8B"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Downloads"
                    />
                    <Line
                      type="monotone"
                      dataKey="logins"
                      stroke="#CABDFF"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Logins"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          )}

          {activeTab === 'logins' && (
            <div>
              <ChartCard>
                <ChartHeader>
                  <h2>Daily Logins (Last 30 Days)</h2>
                </ChartHeader>
                
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.logins.loginsByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEEEF0" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      stroke="#8A8A8E"
                    />
                    <YAxis stroke="#8A8A8E" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EEEEF0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                      }}
                      formatter={(value) => [`${value} logins`, '']}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Bar dataKey="logins" fill="#CABDFF" name="Logins" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard>
                <ChartHeader>
                  <h2>Top Users by Login Count</h2>
                </ChartHeader>
                
                <UserTable>
                  <UserTableHeader>
                    <UserTableRow>
                      <UserTableHeaderCell>Username</UserTableHeaderCell>
                      <UserTableHeaderCell>Login Count</UserTableHeaderCell>
                      <UserTableHeaderCell>Last Login</UserTableHeaderCell>
                    </UserTableRow>
                  </UserTableHeader>
                  <UserTableBody>
                    {analytics.logins.loginsByUser.map((user, index) => (
                      <UserTableRow key={index}>
                        <UserTableCell>{user.username}</UserTableCell>
                        <UserTableCell>{user.count}</UserTableCell>
                        <UserTableCell>
                          {new Date(user.lastLogin).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </UserTableCell>
                      </UserTableRow>
                    ))}
                  </UserTableBody>
                </UserTable>
              </ChartCard>
            </div>
          )}

          {activeTab === 'downloads' && (
            <div>
              <ChartCard>
                <ChartHeader>
                  <h2>Daily Downloads (Last 30 Days)</h2>
                </ChartHeader>
                
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.downloads.downloadsByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEEEF0" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      stroke="#8A8A8E"
                    />
                    <YAxis stroke="#8A8A8E" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EEEEF0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                      }}
                      formatter={(value) => [`${value} downloads`, '']}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Bar dataKey="downloads" fill="#FF9A8B" name="Downloads" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <AnalyticsGrid>
                <ChartCard>
                  <ChartHeader>
                    <h2>Downloads by Collection</h2>
                  </ChartHeader>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.downloads.downloadsByCollection}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {analytics.downloads.downloadsByCollection.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #EEEEF0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                        }}
                        formatter={(value, name) => [`${value} downloads`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard>
                  <ChartHeader>
                    <h2>Most Downloaded Images</h2>
                  </ChartHeader>
                  
                  <ImageList>
                    {analytics.downloads.downloadsByImage.map((image, index) => (
                      <ImageListItem key={index}>
                        <ImageRank>{index + 1}</ImageRank>
                        <ImageName>{image.name}</ImageName>
                        <ImageCount>{image.count} downloads</ImageCount>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </ChartCard>
              </AnalyticsGrid>
            </div>
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

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme, active }) => 
    active ? theme.primary : theme.text.secondary};
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ theme, active }) => 
      active ? theme.primary : 'transparent'};
    transition: background-color 0.2s ease;
  }
  
  &:hover {
    color: ${({ theme, active }) => 
      active ? theme.primary : theme.text.primary};
    
    &::after {
      background-color: ${({ theme, active }) => 
        active ? theme.primary : theme.border.secondary};
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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

const StatCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.surface.primary};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow.small};
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.surface.primary};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow.small};
  margin-bottom: 2rem;
`;

const ChartHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text.primary};
  }
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const UserTableHeader = styled.thead`
  background-color: ${({ theme }) => theme.surface.secondary};
`;

const UserTableBody = styled.tbody``;

const UserTableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.surface.secondary};
  }
`;

const UserTableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
`;

const UserTableCell = styled.td`
  padding: 1rem;
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.875rem;
`;

const ImageList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImageListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  
  &:hover {
    background-color: ${({ theme }) => theme.surface.secondary};
  }
`;

const ImageRank = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.surface.tertiary};
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
`;

const ImageName = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.primary};
  flex: 1;
`;

const ImageCount = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export default Analytics;