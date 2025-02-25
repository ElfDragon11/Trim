import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { supabase } from '../lib/supabase';

interface Barber {
  id: string;
  name: string;
  location: string;
  rating: number;
  image_url: string;
  latitude?: number;
  longitude?: number;
}

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 34.0522, // Los Angeles coordinates
  lng: -118.2437
};

export default function Map() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [userLocation, setUserLocation] = useState(defaultCenter);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('Unable to get location');
        }
      );
    }

    fetchBarbers();
  }, []);

  async function fetchBarbers() {
    const { data, error } = await supabase
      .from('barbers')
      .select('*');

    if (error) {
      console.error('Error fetching barbers:', error);
      return;
    }

    // Mock coordinates for demo purposes
    const barbersWithLocations = data.map((barber, index) => ({
      ...barber,
      latitude: defaultCenter.lat + (Math.random() - 0.5) * 0.1,
      longitude: defaultCenter.lng + (Math.random() - 0.5) * 0.1
    }));

    setBarbers(barbersWithLocations);
  }

  return (
    <div className="w-full">
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation}
          zoom={12}
        >
          {/* User location marker */}
          <Marker
            position={userLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
          />

          {/* Barber markers */}
          {barbers.map((barber) => (
            <Marker
              key={barber.id}
              position={{ lat: barber.latitude!, lng: barber.longitude! }}
              onClick={() => setSelectedBarber(barber)}
            />
          ))}

          {/* Info window for selected barber */}
          {selectedBarber && (
            <InfoWindow
              position={{ 
                lat: selectedBarber.latitude!, 
                lng: selectedBarber.longitude! 
              }}
              onCloseClick={() => setSelectedBarber(null)}
            >
              <div className="p-2">
                <img 
                  src={selectedBarber.image_url} 
                  alt={selectedBarber.name}
                  className="w-20 h-20 rounded-full mb-2 object-cover"
                />
                <h3 className="font-bold text-gray-800">{selectedBarber.name}</h3>
                <p className="text-sm text-gray-600">{selectedBarber.location}</p>
                <p className="text-sm text-gray-600">Rating: {selectedBarber.rating}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}