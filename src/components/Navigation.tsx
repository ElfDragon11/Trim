import { NavLink } from 'react-router-dom';
import { 
  ScissorsIcon, 
  BookOpenIcon, 
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary p-4">
      <div className="max-w-screen-xl mx-auto flex justify-around items-center">
        <NavLink to="/barbers" className="nav-link">
          <ScissorsIcon className="w-6 h-6" />
          <span>Barbers</span>
        </NavLink>
        <NavLink to="/map" className="nav-link">
          <MapPinIcon className="w-6 h-6" />
          <span>Map</span>
        </NavLink>
        <NavLink to="/styles" className="nav-link">
          <BookOpenIcon className="w-6 h-6" />
          <span>Hair Styles</span>
        </NavLink>
        <NavLink to="/profile" className="nav-link">
          <UserIcon className="w-6 h-6" />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}