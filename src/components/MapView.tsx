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
  distance?: number;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 120px)'
};

// Default center (US center)
const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795
};

// Default radius in miles
const DEFAULT_RADIUS = 50;

// City coordinates mapping
const cityCoordinates: Record<string, Coordinates> = {
  // California
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'Downtown LA': { lat: 34.0407, lng: -118.2468 },
  'West Hollywood': { lat: 34.0900, lng: -118.3617 },
  'Santa Monica': { lat: 34.0195, lng: -118.4912 },
  'Beverly Hills': { lat: 34.0736, lng: -118.4004 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
  'San Diego': { lat: 32.7157, lng: -117.1611 },
  
  // New York
  'New York': { lat: 40.7128, lng: -74.0060 },
  'Brooklyn': { lat: 40.6782, lng: -73.9442 },
  'Manhattan': { lat: 40.7831, lng: -73.9712 },
  'Queens': { lat: 40.7282, lng: -73.7949 },
  
  // Texas
  'Dallas': { lat: 32.7767, lng: -96.7970 },
  'Houston': { lat: 29.7604, lng: -95.3698 },
  'Austin': { lat: 30.2672, lng: -97.7431 },
  
  // Florida
  'Miami': { lat: 25.7617, lng: -80.1918 },
  'Orlando': { lat: 28.5383, lng: -81.3792 },
  
  // Illinois
  'Chicago': { lat: 41.8781, lng: -87.6298 },
  
  // Washington
  'Seattle': { lat: 47.6062, lng: -122.3321 },
  
  // Georgia
  'Atlanta': { lat: 33.7490, lng: -84.3880 },
  
  // Massachusetts
  'Boston': { lat: 42.3601, lng: -71.0589 },
  
  // Nevada
  'Las Vegas': { lat: 36.1699, lng: -115.1398 },
  
  // Colorado
  'Denver': { lat: 39.7392, lng: -104.9903 },
  
  // Arizona
  'Phoenix': { lat: 33.4484, lng: -112.0740 },
  
  // Utah
  'Provo': { lat: 40.2338, lng: -111.6585 },
  'Orem': { lat: 40.2969, lng: -111.6946 },
  'Lehi': { lat: 40.3916, lng: -111.8507 },
  'American Fork': { lat: 40.3769, lng: -111.7953 },
  'Pleasant Grove': { lat: 40.3641, lng: -111.7385 },
  'Springville': { lat: 40.1652, lng: -111.6107 }
};

export default function MapView() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(true);
  const [mapZoom, setMapZoom] = useState(4);
  const [showAllBarbers, setShowAllBarbers] = useState(true);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [nearbyBarbers, setNearbyBarbers] = useState<Barber[]>([]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDJwdBdS8MsQN5ctyozVxAnxXIEPMpXEnI'
  });

  useEffect(() => {
    Promise.all([
      getUserLocation(),
      fetchBarbers()
    ]).then(() => {
      setIsLoading(false);
    });
  }, []);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Update nearby barbers when user location, barbers, or radius changes
  useEffect(() => {
    if (barbers.length > 0 && userLocation.lat !== defaultCenter.lat) {
      const barbersWithDistance = barbers.map(barber => {
        if (barber.latitude && barber.longitude) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            barber.latitude,
            barber.longitude
          );
          return { ...barber, distance };
        }
        return barber;
      });

      // Filter barbers within the radius
      const nearby = barbersWithDistance
        .filter(barber => barber.distance !== undefined && barber.distance <= radius)
        .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      
      setNearbyBarbers(nearby);
    }
  }, [barbers, userLocation, radius]);

  const getUserLocation = () => {
    return new Promise<void>((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCoords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(userCoords);
            setMapCenter(userCoords);
            setMapZoom(8); // Zoom in when we have user location
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

  function getCoordinatesForLocation(location: string): Coordinates | null {
    // First check if we have an exact match in our city coordinates
    if (cityCoordinates[location]) {
      return cityCoordinates[location];
    }
    
    // Check if the location contains a known city name
    for (const [cityName, coords] of Object.entries(cityCoordinates)) {
      if (location.includes(cityName)) {
        return coords;
      }
    }
    
    // Check for state abbreviations (e.g., "NY", "CA")
    const stateCoordinates: Record<string, Coordinates> = {
      'CA': { lat: 36.7783, lng: -119.4179 }, // California
      'NY': { lat: 40.7128, lng: -74.0060 }, // New York
      'TX': { lat: 31.9686, lng: -99.9018 }, // Texas
      'FL': { lat: 27.6648, lng: -81.5158 }, // Florida
      'IL': { lat: 41.8781, lng: -87.6298 }, // Illinois
      'WA': { lat: 47.6062, lng: -122.3321 }, // Washington
      'GA': { lat: 33.7490, lng: -84.3880 }, // Georgia
      'MA': { lat: 42.3601, lng: -71.0589 }, // Massachusetts
      'NV': { lat: 36.1699, lng: -115.1398 }, // Nevada
      'CO': { lat: 39.7392, lng: -104.9903 }, // Colorado
      'AZ': { lat: 33.4484, lng: -112.0740 }, // Arizona
      'UT': { lat: 40.7608, lng: -111.8910 }  // Utah
    };
    
    const words = location.split(/[\s,]+/);
    for (const word of words) {
      if (stateCoordinates[word]) {
        return stateCoordinates[word];
      }
    }
    
    return null;
  }

  async function fetchBarbers() {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        // Map locations to coordinates
        const barbersWithCoordinates = data.map((barber) => {
          const coordinates = getCoordinatesForLocation(barber.location);
          return {
            ...barber,
            latitude: coordinates?.lat || null,
            longitude: coordinates?.lng || null
          };
        });

        // Filter out barbers without coordinates
        const validBarbers = barbersWithCoordinates.filter(
          barber => barber.latitude !== null && barber.longitude !== null
        );

        setBarbers(validBarbers);
      }
    } catch (error) {
      console.error('Error fetching barbers:', error);
    }
  }

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
  };

  const toggleBarberDisplay = () => {
    setShowAllBarbers(!showAllBarbers);
    
    // If switching to nearby only, adjust the map center and zoom
    if (showAllBarbers && userLocation !== defaultCenter) {
      setMapCenter(userLocation);
      setMapZoom(9);
    } else {
      // If showing all, zoom out to see more of the map
      setMapZoom(4);
      setMapCenter(defaultCenter);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-accent">Loading map...</div>
      </div>
    );
  }

  // Determine which barbers to display
  const displayBarbers = showAllBarbers ? barbers : nearbyBarbers;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Find Barbers</h1>
      
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button 
          onClick={toggleBarberDisplay}
          className="bg-neutral text-text px-3 py-1 rounded-lg"
        >
          {showAllBarbers ? 'Show Nearby Only' : 'Show All Barbers'}
        </button>
        
        {!showAllBarbers && (
          <>
            <label htmlFor="radius" className="ml-2 mr-2">Radius:</label>
            <select 
              id="radius" 
              value={radius} 
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="bg-secondary text-text px-3 py-1 rounded-lg"
            >
              <option value="10">10 miles</option>
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
              <option value="100">100 miles</option>
            </select>
          </>
        )}
        
        <span className="ml-auto text-sm text-gray-400">
          {showAllBarbers 
            ? `Showing all ${barbers.length} barbers` 
            : `${nearbyBarbers.length} barbers within ${radius} miles`}
        </span>
      </div>
      
      <div className="w-full bg-secondary rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={mapZoom}
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
          {userLocation !== defaultCenter && (
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
          )}

          {/* Barber markers */}
          {displayBarbers.map((barber) => (
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
                {selectedBarber.distance !== undefined && (
                  <p className="text-sm text-gray-600">
                    {selectedBarber.distance.toFixed(1)} miles away
                  </p>
                )}
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
      
      {!showAllBarbers && nearbyBarbers.length === 0 && userLocation !== defaultCenter && (
        <div className="mt-4 p-4 bg-secondary rounded-lg text-center">
          <p>No barbers found within {radius} miles.</p>
          <p className="text-sm text-gray-400 mt-2">Try increasing the radius or check another location.</p>
        </div>
      )}
    </div>
  );
}