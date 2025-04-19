import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';

// Admin Pages
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import CollectionManagement from './pages/admin/CollectionManagement';
import Analytics from './pages/admin/Analytics';

// User Pages
import UserLayout from './components/layouts/UserLayout';
import UserGallery from './pages/user/Gallery';
import CollectionView from './pages/user/CollectionView';
import ImageView from './pages/user/ImageView';

// Protected Route component
const ProtectedRoute = ({ element, adminOnly }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  if (adminOnly && (!user || user.role !== 'admin')) {
    return <Navigate to="/gallery" />;
  }
  
  return element;
};

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          isAuthenticated && user?.role === 'admin' 
            ? <AdminLayout /> 
            : <Navigate to="/" />
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="collections" element={<CollectionManagement />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        
        {/* User Routes - Some can be public */}
        <Route path="/gallery" element={<UserLayout />}>
          <Route index element={<UserGallery />} />
          <Route path="collections/:id" element={
            isAuthenticated ? <CollectionView /> : <Navigate to="/" />
          } />
          <Route path="images/:id" element={
            isAuthenticated ? <ImageView /> : <Navigate to="/" />
          } />
        </Route>
        
        {/* Public landing page - for now just redirect to appropriate place */}
        <Route path="/" element={
          isAuthenticated 
            ? (user?.role === 'admin' 
                ? <Navigate to="/admin" /> 
                : <Navigate to="/gallery" />)
            : <Navigate to="/gallery" />
        } />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;