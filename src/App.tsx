import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import Navigation from './components/Navigation';
import BarberProfile from './components/BarberProfile';
import HairStyles from './components/HairStyles';
import BarbersList from './components/BarbersList';
import UserProfile from './components/UserProfile';
import MapView from './components/MapView';
import Auth from './components/Auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-primary flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-primary flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-primary pb-20">
        <Routes>
          <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
          
          <Route path="/barber/:id" element={
            <ProtectedRoute>
              <BarberProfile />
            </ProtectedRoute>
          } />
          
          <Route path="/styles" element={
            <ProtectedRoute>
              <HairStyles />
            </ProtectedRoute>
          } />
          
          <Route path="/barbers" element={
            <ProtectedRoute>
              <BarbersList />
            </ProtectedRoute>
          } />
          
          <Route path="/map" element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <BarbersList />
            </ProtectedRoute>
          } />
        </Routes>
        {user && <Navigation />}
      </div>
    </BrowserRouter>
  );
}

export default App;