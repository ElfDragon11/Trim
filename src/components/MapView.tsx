import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

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
  height: 'calc(100vh - 120px)'
};

const defaultCenter = {
  lat: 34.0522, // Los Angeles coordinates
  lng: -118.2437
};

const libraries: ("places" | "geometry" | "drawing" | "localContext" | "visualization")[] = ["places"];

export default function MapView() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDJwdBdS8MsQN5ctyozVxAnxXIEPMpXEnI',
    libraries
  });

  useEffect(() => {
    Promise.all([
      getUserLocation(),
      fetchBarbers()
    ]).then(() => {
      setIsLoading(false);
    });
  }, []);

  const getUserLocation = () => {
    return new Promise<void>((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            resolve();
          },
          () => {
            console.log('Unable to get location');
            resolve();
          }
        );
      } else {
        resolve();
      }
    });
  };

  async function fetchBarbers() {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        // Generate fixed locations around the center for demo
        const barbersWithLocations = data.map((barber, index) => {
          const angle = (index / data.length) * 2 * Math.PI;
          const radius = 0.02; // Approximately 2km radius
          return {
            ...barber,
            latitude: defaultCenter.lat + radius * Math.cos(angle),
            longitude: defaultCenter.lng + radius * Math.sin(angle)
          };
        });

        setBarbers(barbersWithLocations);
      }
    } catch (error) {
      console.error('Error fetching barbers:', error);
    }
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-accent">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Find Barbers Nearby</h1>
      <div className="w-full bg-secondary rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation}
          zoom={13}
          options={{
            styles: [
              {
                elementType: "geometry",
                stylers: [{ color: "#242f3e" }]
              },
              {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#242f3e" }]
              },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#746855" }]
              }
            ],
            disableDefaultUI: true,
            zoomControl: true
          }}
        >
          {/* User location marker */}
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />

          {/* Barber markers */}
          {barbers.map((barber) => (
            <Marker
              key={barber.id}
              position={{ lat: barber.latitude!, lng: barber.longitude! }}
              onClick={() => setSelectedBarber(barber)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#C19A6B",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
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
                <Link 
                  to={`/barber/${selectedBarber.id}`}
                  className="mt-2 block text-sm text-blue-600 hover:text-blue-800"
                >
                  View Profile
                </Link>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}