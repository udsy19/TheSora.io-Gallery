import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    counts: {
      users: 0,
      images: 0,
      collections: 0,
      logins: 0,
      downloads: 0,
      views: 0
    },
    recentActivities: [],
    chartData: [],
    topUsersByDownloads: [],
    topCollectionsByViews: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch analytics data - this would be replaced with an actual API call
    const fetchAnalyticsData = () => {
      try {
        // Mock data for now, will be replaced with API call
        setTimeout(() => {
          const mockChartData = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return {
              date: date.toISOString().split('T')[0],
              login: Math.floor(Math.random() * 20),
              download: Math.floor(Math.random() * 50),
              view: Math.floor(Math.random() * 100)
            };
          });
          
          const mockTopUsers = [
            { userId: '1', username: 'user1', count: 120 },
            { userId: '2', username: 'user2', count: 85 },
            { userId: '3', username: 'user3', count: 64 },
            { userId: '4', username: 'user4', count: 42 },
            { userId: '5', username: 'user5', count: 28 }
          ];
          
          const mockTopCollections = [
            { collectionId: '1', name: 'Wedding Photos', count: 210 },
            { collectionId: '2', name: 'Summer Session', count: 178 },
            { collectionId: '3', name: 'Family Portraits', count: 150 },
            { collectionId: '4', name: 'Corporate Event', count: 112 },
            { collectionId: '5', name: 'Product Shoot', count: 89 }
          ];
          
          const mockRecentActivities = [
            { id: '1', user: { username: 'user1' }, actionType: 'login', timestamp: new Date().toISOString() },
            { id: '2', user: { username: 'user2' }, actionType: 'download', image: { originalName: 'photo1.jpg' }, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
            { id: '3', user: { username: 'user3' }, actionType: 'view', collection: { name: 'Wedding Photos' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
            { id: '4', user: { username: 'user4' }, actionType: 'download', image: { originalName: 'photo2.jpg' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
            { id: '5', user: { username: 'user5' }, actionType: 'login', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() }
          ];
          
          setStats({
            counts: {
              users: 157,
              images: 3842,
              collections: 68,
              logins: 523,
              downloads: 1842,
              views: 7256
            },
            recentActivities: mockRecentActivities,
            chartData: mockChartData,
            topUsersByDownloads: mockTopUsers,
            topCollectionsByViews: mockTopCollections
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
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const COLORS = ['#FF9A8B', '#CABDFF', '#A0FFE6', '#FFCB91', '#91D5FF'];

  const getActivityIcon = (actionType) => {
    switch (actionType) {
      case 'login':
        return '🔐';
      case 'download':
        return '⬇️';
      case 'view':
        return '👁️';
      default:
        return '📋';
    }
  };

  const getActivityColor = (actionType) => {
    switch (actionType) {
      case 'login':
        return '#CABDFF';
      case 'download':
        return '#FF9A8B';
      case 'view':
        return '#A0FFE6';
      default:
        return '#91D5FF';
    }
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Dashboard</h1>
        <p>Overview of your gallery analytics</p>
      </DashboardHeader>

      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading analytics data...</LoadingText>
        </LoadingContainer>
      ) : (
        <>
          <StatCardsContainer>
            <StatCard>
              <StatTitle>Users</StatTitle>
              <StatValue>{stats.counts.users.toLocaleString()}</StatValue>
            </StatCard>
            
            <StatCard>
              <StatTitle>Images</StatTitle>
              <StatValue>{stats.counts.images.toLocaleString()}</StatValue>
            </StatCard>
            
            <StatCard>
              <StatTitle>Collections</StatTitle>
              <StatValue>{stats.counts.collections.toLocaleString()}</StatValue>
            </StatCard>
            
            <StatCard>
              <StatTitle>Downloads</StatTitle>
              <StatValue>{stats.counts.downloads.toLocaleString()}</StatValue>
            </StatCard>
          </StatCardsContainer>

          <AnalyticsSection>
            <ChartCard>
              <CardHeader>
                <h2>Activity Overview (Last 30 Days)</h2>
              </CardHeader>
              
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={stats.chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEEEF0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
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
                  <Area 
                    type="monotone" 
                    dataKey="view" 
                    stackId="1"
                    stroke="#A0FFE6" 
                    fill="#A0FFE6"
                    fillOpacity={0.6}
                    name="Views"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="download" 
                    stackId="1"
                    stroke="#FF9A8B" 
                    fill="#FF9A8B"
                    fillOpacity={0.8}
                    name="Downloads"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="login" 
                    stackId="1"
                    stroke="#CABDFF" 
                    fill="#CABDFF"
                    fillOpacity={1}
                    name="Logins"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            
            <SideCharts>
              <ChartCard>
                <CardHeader>
                  <h2>Top Users by Downloads</h2>
                </CardHeader>
                
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={stats.topUsersByDownloads}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="username"
                    >
                      {stats.topUsersByDownloads.map((entry, index) => (
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
                
                <UserList>
                  {stats.topUsersByDownloads.map((user, index) => (
                    <UserListItem key={user.userId}>
                      <UserColorDot style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <UserName>{user.username}</UserName>
                      <UserCount>{user.count} downloads</UserCount>
                    </UserListItem>
                  ))}
                </UserList>
              </ChartCard>
            </SideCharts>
          </AnalyticsSection>

          <AnalyticsSection>
            <ChartCard>
              <CardHeader>
                <h2>Recent Activity</h2>
              </CardHeader>
              
              <ActivitiesList>
                {stats.recentActivities.map((activity) => (
                  <ActivityItem key={activity.id}>
                    <ActivityIcon style={{ backgroundColor: getActivityColor(activity.actionType) }}>
                      {getActivityIcon(activity.actionType)}
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityText>
                        <strong>{activity.user.username}</strong>
                        {' '}
                        {activity.actionType === 'login' && 'logged in'}
                        {activity.actionType === 'download' && `downloaded ${activity.image.originalName}`}
                        {activity.actionType === 'view' && `viewed ${activity.collection.name}`}
                      </ActivityText>
                      <ActivityTime>{formatDate(activity.timestamp)}</ActivityTime>
                    </ActivityContent>
                  </ActivityItem>
                ))}
              </ActivitiesList>
            </ChartCard>
          </AnalyticsSection>
        </>
      )}
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
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

const AnalyticsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.surface.primary};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow.small};
  display: flex;
  flex-direction: column;
`;

const SideCharts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CardHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text.primary};
  }
`;

const UserList = styled.div`
  margin-top: 1rem;
`;

const UserListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background-color: ${({ theme }) => theme.surface.secondary};
  }
`;

const UserColorDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.75rem;
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  flex: 1;
`;

const UserCount = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.tertiary};
`;

const ActivitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.surface.secondary};
`;

const ActivityIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.25rem;
  
  strong {
    font-weight: 600;
  }
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.tertiary};
`;

export default Dashboard;