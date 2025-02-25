import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import BarberProfile from './components/BarberProfile';
import HairStyles from './components/HairStyles';
import BarbersList from './components/BarbersList';
import UserProfile from './components/UserProfile';
import MapView from './components/MapView';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-primary pb-20">
        <Routes>
          <Route path="/barber/:id" element={<BarberProfile />} />
          <Route path="/styles" element={<HairStyles />} />
          <Route path="/barbers" element={<BarbersList />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/" element={<BarbersList />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;