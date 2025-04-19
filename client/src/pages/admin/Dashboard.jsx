import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  Cell,
  BarChart,
  Bar,
  Legend
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
    userStats: [],
    topUsersByDownloads: [],
    topUsersByActivity: [],
    storageUsage: [],
    topCollectionsByViews: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

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
            { userId: '1', username: 'user1', fullName: 'John Doe', count: 120 },
            { userId: '2', username: 'user2', fullName: 'Jane Smith', count: 85 },
            { userId: '3', username: 'user3', fullName: 'Mike Johnson', count: 64 },
            { userId: '4', username: 'user4', fullName: 'Sarah Williams', count: 42 },
            { userId: '5', username: 'user5', fullName: 'Robert Brown', count: 28 }
          ];
          
          const mockActiveUsers = [
            { userId: '2', username: 'user2', fullName: 'Jane Smith', lastActive: '2023-06-18T14:32:21Z', activityScore: 87 },
            { userId: '5', username: 'user5', fullName: 'Robert Brown', lastActive: '2023-06-19T10:15:42Z', activityScore: 76 },
            { userId: '1', username: 'user1', fullName: 'John Doe', lastActive: '2023-06-17T19:45:11Z', activityScore: 65 },
            { userId: '7', username: 'user7', fullName: 'Emma Davis', lastActive: '2023-06-18T08:22:30Z', activityScore: 59 },
            { userId: '9', username: 'user9', fullName: 'William Jones', lastActive: '2023-06-16T15:30:00Z', activityScore: 47 }
          ];
          
          const mockTopCollections = [
            { collectionId: '1', name: 'Wedding Photos', count: 210 },
            { collectionId: '2', name: 'Summer Session', count: 178 },
            { collectionId: '3', name: 'Family Portraits', count: 150 },
            { collectionId: '4', name: 'Corporate Event', count: 112 },
            { collectionId: '5', name: 'Product Shoot', count: 89 }
          ];
          
          const mockRecentActivities = [
            { id: '1', user: { username: 'user1', fullName: 'John Doe' }, actionType: 'login', timestamp: new Date().toISOString() },
            { id: '2', user: { username: 'user2', fullName: 'Jane Smith' }, actionType: 'download', image: { originalName: 'photo1.jpg' }, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
            { id: '3', user: { username: 'user3', fullName: 'Mike Johnson' }, actionType: 'view', collection: { name: 'Wedding Photos' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
            { id: '4', user: { username: 'user4', fullName: 'Sarah Williams' }, actionType: 'download', image: { originalName: 'photo2.jpg' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
            { id: '5', user: { username: 'user5', fullName: 'Robert Brown' }, actionType: 'login', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
            { id: '6', user: { username: 'user7', fullName: 'Emma Davis' }, actionType: 'share', collection: { name: 'Family Portraits' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
            { id: '7', user: { username: 'user9', fullName: 'William Jones' }, actionType: 'upload', count: 5, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
          ];
          
          const mockStorageUsage = [
            { name: 'Images', value: 3.2 },
            { name: 'Thumbnails', value: 0.8 },
            { name: 'Metadata', value: 0.1 }
          ];
          
          const mockUserStats = [
            { name: 'Active Users', value: 64 },
            { name: 'Inactive Users', value: 23 },
            { name: 'New Users (7d)', value: 12 },
            { name: 'Admin Users', value: 3 }
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
            userStats: mockUserStats,
            topUsersByDownloads: mockTopUsers,
            topUsersByActivity: mockActiveUsers,
            storageUsage: mockStorageUsage,
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
  }, [selectedTimeframe]);

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
      case 'share':
        return '🔗';
      case 'upload':
        return '📤';
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
      case 'share':
        return '#FFCB91';
      case 'upload':
        return '#91D5FF';
      default:
        return '#91D5FF';
    }
  };

  const renderTimeframeSelector = () => (
    <TimeframeSelector>
      <TimeframeButton 
        active={selectedTimeframe === 'week'}
        onClick={() => setSelectedTimeframe('week')}
      >
        Week
      </TimeframeButton>
      <TimeframeButton 
        active={selectedTimeframe === 'month'}
        onClick={() => setSelectedTimeframe('month')}
      >
        Month
      </TimeframeButton>
      <TimeframeButton 
        active={selectedTimeframe === 'year'}
        onClick={() => setSelectedTimeframe('year')}
      >
        Year
      </TimeframeButton>
    </TimeframeSelector>
  );

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
            <StatCard
              as={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StatTitle>Users</StatTitle>
              <StatValue>{stats.counts.users.toLocaleString()}</StatValue>
              <StatLink to="/admin/users">Manage Users</StatLink>
            </StatCard>
            
            <StatCard
              as={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StatTitle>Images</StatTitle>
              <StatValue>{stats.counts.images.toLocaleString()}</StatValue>
              <StatTrend positive>+24 this week</StatTrend>
            </StatCard>
            
            <StatCard
              as={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StatTitle>Collections</StatTitle>
              <StatValue>{stats.counts.collections.toLocaleString()}</StatValue>
              <StatLink to="/admin/collections">Manage Collections</StatLink>
            </StatCard>
            
            <StatCard
              as={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <StatTitle>Downloads</StatTitle>
              <StatValue>{stats.counts.downloads.toLocaleString()}</StatValue>
              <StatTrend positive>+15% from last month</StatTrend>
            </StatCard>
          </StatCardsContainer>

          <AnalyticsSection>
            <ChartCard>
              <CardHeader>
                <div>
                  <h2>User Activity ({selectedTimeframe})</h2>
                  <CardSubtitle>Track user engagement over time</CardSubtitle>
                </div>
                {renderTimeframeSelector()}
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
                  <h2>User Statistics</h2>
                </CardHeader>
                
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart
                    data={stats.userStats}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEEEF0" vertical={false} />
                    <XAxis dataKey="name" scale="band" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EEEEF0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                      }}
                      formatter={(value) => [`${value}`, '']}
                    />
                    <Bar dataKey="value" fill="#CABDFF" radius={[4, 4, 4, 4]} />
                  </BarChart>
                </ResponsiveContainer>
                
                <ActionButton to="/admin/users">
                  <span>Manage Users</span>
                  <ButtonIcon>→</ButtonIcon>
                </ActionButton>
              </ChartCard>
              
              <ChartCard>
                <CardHeader>
                  <h2>Storage Usage</h2>
                </CardHeader>
                
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={stats.storageUsage}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                    >
                      {stats.storageUsage.map((entry, index) => (
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
                      formatter={(value) => [`${value} GB`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <StorageUsageText>
                  <StorageValue>4.1 GB</StorageValue>
                  <span>of 10 GB used</span>
                </StorageUsageText>
              </ChartCard>
            </SideCharts>
          </AnalyticsSection>

          <AnalyticsSection>
            <ChartCard>
              <CardHeader>
                <div>
                  <h2>Recent User Activity</h2>
                  <CardSubtitle>Latest actions from your users</CardSubtitle>
                </div>
                <ViewAllLink to="/admin/analytics">View All Activity</ViewAllLink>
              </CardHeader>
              
              <ActivitiesList>
                {stats.recentActivities.map((activity) => (
                  <ActivityItem key={activity.id}>
                    <ActivityIcon style={{ backgroundColor: getActivityColor(activity.actionType) }}>
                      {getActivityIcon(activity.actionType)}
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityText>
                        <strong>{activity.user.fullName}</strong>
                        {' '}
                        {activity.actionType === 'login' && 'logged in'}
                        {activity.actionType === 'download' && `downloaded ${activity.image.originalName}`}
                        {activity.actionType === 'view' && `viewed ${activity.collection.name}`}
                        {activity.actionType === 'share' && `shared ${activity.collection.name}`}
                        {activity.actionType === 'upload' && `uploaded ${activity.count} images`}
                      </ActivityText>
                      <ActivityTime>{formatDate(activity.timestamp)}</ActivityTime>
                    </ActivityContent>
                  </ActivityItem>
                ))}
              </ActivitiesList>
            </ChartCard>
          </AnalyticsSection>
          
          <AnalyticsSection>
            <UserActivityCard>
              <CardHeader>
                <div>
                  <h2>Most Active Users</h2>
                  <CardSubtitle>Users with highest activity levels</CardSubtitle>
                </div>
                <ViewAllLink to="/admin/users">View All Users</ViewAllLink>
              </CardHeader>
              
              <UsersList>
                {stats.topUsersByActivity.map((user, index) => (
                  <UserListItem key={user.userId}>
                    <UserAvatar>{user.fullName.charAt(0)}</UserAvatar>
                    <UserInfo>
                      <UserName>{user.fullName}</UserName>
                      <UserDetails>
                        @{user.username} • Last active: {formatDate(user.lastActive)}
                      </UserDetails>
                    </UserInfo>
                    <UserActivityBadge>
                      <UserActivityScore>{user.activityScore}</UserActivityScore>
                    </UserActivityBadge>
                  </UserListItem>
                ))}
              </UsersList>
            </UserActivityCard>
            
            <UserDownloadsCard>
              <CardHeader>
                <div>
                  <h2>Top Users by Downloads</h2>
                  <CardSubtitle>Users who download the most content</CardSubtitle>
                </div>
              </CardHeader>
              
              <UsersList>
                {stats.topUsersByDownloads.map((user) => (
                  <UserListItem key={user.userId}>
                    <UserAvatar>{user.fullName.charAt(0)}</UserAvatar>
                    <UserInfo>
                      <UserName>{user.fullName}</UserName>
                      <UserDetails>
                        @{user.username}
                      </UserDetails>
                    </UserInfo>
                    <UserStat>
                      {user.count} downloads
                    </UserStat>
                  </UserListItem>
                ))}
              </UsersList>
            </UserDownloadsCard>
          </AnalyticsSection>
          
          <CreateAdminSection>
            <CreateAdminCard>
              <AdminCardHeader>
                <h2>Admin Access</h2>
                <AdminCardSubtitle>Create or manage admin user accounts</AdminCardSubtitle>
              </AdminCardHeader>
              
              <AdminActionButtons>
                <PrimaryButton to="/admin/users?filter=admin">
                  View Admin Users
                </PrimaryButton>
                <SecondaryButton to="/admin/users/new?role=admin">
                  Create New Admin
                </SecondaryButton>
              </AdminActionButtons>
            </CreateAdminCard>
          </CreateAdminSection>
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
  margin-bottom: 0.5rem;
`;

const StatTrend = styled.div`
  font-size: 0.75rem;
  color: ${props => props.positive ? 'var(--color-status-success)' : 'var(--color-status-error)'};
  display: flex;
  align-items: center;
  
  &::before {
    content: ${props => props.positive ? '"↑"' : '"↓"'};
    margin-right: 4px;
  }
`;

const StatLink = styled(Link)`
  font-size: 0.75rem;
  color: var(--color-primary);
  text-decoration: none;
  margin-top: auto;
  
  &:hover {
    text-decoration: underline;
  }
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 0.25rem;
  }
`;

const CardSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.tertiary};
`;

const TimeframeSelector = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.surface.secondary};
  border-radius: 8px;
  overflow: hidden;
`;

const TimeframeButton = styled.button`
  background: ${({ active, theme }) => active ? theme.primary : 'transparent'};
  color: ${({ active, theme }) => active ? 'white' : theme.text.secondary};
  border: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.primary : theme.surface.tertiary};
  }
`;

const UserActivityCard = styled(ChartCard)`
  grid-column: 1 / -1;
  
  @media (min-width: 1024px) {
    grid-column: 1 / 2;
  }
`;

const UserDownloadsCard = styled(ChartCard)`
  grid-column: 1 / -1;
  
  @media (min-width: 1024px) {
    grid-column: 2 / 3;
  }
`;

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.surface.secondary};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.surface.tertiary};
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserDetails = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.tertiary};
`;

const UserActivityBadge = styled.div`
  background-color: var(--color-primary);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
`;

const UserActivityScore = styled.div`
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
`;

const UserStat = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

const ActivitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border.primary};
    border-radius: 4px;
  }
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

const StorageUsageText = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  
  span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.text.tertiary};
  }
`;

const StorageValue = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--color-accent);
  }
`;

const ButtonIcon = styled.span`
  margin-left: 0.5rem;
  transition: transform 0.2s ease;
  
  ${ActionButton}:hover & {
    transform: translateX(4px);
  }
`;

const ViewAllLink = styled(Link)`
  font-size: 0.875rem;
  color: var(--color-primary);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CreateAdminSection = styled.div`
  margin-bottom: 2rem;
`;

const CreateAdminCard = styled(ChartCard)`
  border: 2px dashed ${({ theme }) => theme.border.primary};
  background-color: ${({ theme }) => theme.surface.secondary};
`;

const AdminCardHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 0.5rem;
  }
`;

const AdminCardSubtitle = styled.p`
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 0.875rem;
`;

const AdminActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-accent);
  }
`;

const SecondaryButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-surface-tertiary);
  }
`;

export default Dashboard;