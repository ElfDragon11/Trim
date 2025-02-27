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
  distance?: number; // Added distance property
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
  lat: 39.8283, // Roughly center of US
  lng: -98.5795
};

// Default radius in miles
const DEFAULT_RADIUS = 10;

// Major cities coordinates for common locations
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
  'Phoenix': { lat: 33.4484, lng: -112.0740 }
};

export default function MapView() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(true);
  const [mapZoom, setMapZoom] = useState(4); // Start with US view
  const [radius, setRadius] = useState(DEFAULT_RADIUS);

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

  // Filter barbers based on distance from user
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
      
      setFilteredBarbers(nearby);
      
      // Adjust zoom based on results
      if (nearby.length === 0) {
        // If no nearby barbers, increase radius
        setRadius(prev => Math.min(prev * 2, 50));
      } else if (nearby.length > 10) {
        // If too many results, zoom in more
        setMapZoom(12);
      } else {
        setMapZoom(11);
      }
    } else {
      // If we don't have user location yet, show all barbers
      setFilteredBarbers(barbers);
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
            setMapZoom(11); // Zoom in when we have user location
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
        // Map locations to coordinates
        const barbersWithCoordinates = data.map((barber) => {
          const coordinates = getCoordinatesForLocation(barber.location);
          return {
            ...barber,
            latitude: coordinates.lat,
            longitude: coordinates.lng
          };
        });

        setBarbers(barbersWithCoordinates);
        setFilteredBarbers(barbersWithCoordinates); // Initially show all barbers
      }
    } catch (error) {
      console.error('Error fetching barbers:', error);
    }
  }

  function getCoordinatesForLocation(location: string): Coordinates {
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
    
    // Try to parse state names
    const states: Record<string, Coordinates> = {
      'California': { lat: 36.7783, lng: -119.4179 },
      'New York': { lat: 43.2994, lng: -74.2179 },
      'Texas': { lat: 31.9686, lng: -99.9018 },
      'Florida': { lat: 27.6648, lng: -81.5158 },
      'Illinois': { lat: 40.6331, lng: -89.3985 },
      'Pennsylvania': { lat: 41.2033, lng: -77.1945 },
      'Ohio': { lat: 40.4173, lng: -82.9071 },
      'Georgia': { lat: 33.0406, lng: -83.6431 },
      'Michigan': { lat: 44.3148, lng: -85.6024 },
      'North Carolina': { lat: 35.7596, lng: -79.0193 },
      'New Jersey': { lat: 40.0583, lng: -74.4057 },
      'Virginia': { lat: 37.7693, lng: -78.1700 },
      'Washington': { lat: 47.7511, lng: -120.7401 },
      'Arizona': { lat: 34.0489, lng: -111.0937 },
      'Massachusetts': { lat: 42.4072, lng: -71.3824 },
      'Tennessee': { lat: 35.5175, lng: -86.5804 },
      'Indiana': { lat: 40.2672, lng: -86.1349 },
      'Missouri': { lat: 37.9643, lng: -91.8318 },
      'Maryland': { lat: 39.0458, lng: -76.6413 },
      'Colorado': { lat: 39.0598, lng: -105.3111 },
      'Wisconsin': { lat: 43.7844, lng: -88.7879 },
      'Minnesota': { lat: 46.7296, lng: -94.6859 },
      'South Carolina': { lat: 33.8361, lng: -81.1637 },
      'Alabama': { lat: 32.3182, lng: -86.9023 },
      'Louisiana': { lat: 31.1695, lng: -91.8678 },
      'Kentucky': { lat: 37.8393, lng: -84.2700 },
      'Oregon': { lat: 43.8041, lng: -120.5542 },
      'Oklahoma': { lat: 35.0078, lng: -97.0929 },
      'Connecticut': { lat: 41.6032, lng: -73.0877 },
      'Utah': { lat: 39.3210, lng: -111.0937 },
      'Iowa': { lat: 42.0115, lng: -93.2105 },
      'Nevada': { lat: 38.8026, lng: -116.4194 },
      'Arkansas': { lat: 34.9697, lng: -92.3731 },
      'Mississippi': { lat: 32.3547, lng: -89.3985 },
      'Kansas': { lat: 39.0119, lng: -98.4842 },
      'New Mexico': { lat: 34.5199, lng: -105.8701 },
      'Nebraska': { lat: 41.4925, lng: -99.9018 },
      'Idaho': { lat: 44.0682, lng: -114.7420 },
      'Hawaii': { lat: 19.8968, lng: -155.5828 },
      'New Hampshire': { lat: 43.1939, lng: -71.5724 },
      'Maine': { lat: 44.6939, lng: -69.3819 },
      'Montana': { lat: 46.8797, lng: -110.3626 },
      'Rhode Island': { lat: 41.5801, lng: -71.4774 },
      'Delaware': { lat: 38.9108, lng: -75.5277 },
      'South Dakota': { lat: 43.9695, lng: -99.9018 },
      'North Dakota': { lat: 47.5515, lng: -101.0020 },
      'Alaska': { lat: 64.2008, lng: -149.4937 },
      'Vermont': { lat: 44.5588, lng: -72.5778 },
      'Wyoming': { lat: 43.0759, lng: -107.2903 }
    };
    
    // Check for state names in the location
    for (const [stateName, coords] of Object.entries(states)) {
      if (location.includes(stateName)) {
        return coords;
      }
    }
    
    // Check for state abbreviations
    const stateAbbreviations: Record<string, string> = {
      'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
      'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
      'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
      'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
      'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
      'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
      'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
      'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
      'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
      'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
      'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
      'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
      'WI': 'Wisconsin', 'WY': 'Wyoming'
    };
    
    // Check for state abbreviations (e.g., "NY", "CA")
    const words = location.split(/[\s,]+/);
    for (const word of words) {
      const abbr = word.toUpperCase();
      if (stateAbbreviations[abbr]) {
        return states[stateAbbreviations[abbr]];
      }
    }
    
    // If all else fails, return default center
    console.warn(`Could not find coordinates for location: ${location}`);
    return defaultCenter;
  }

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
  };

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
      
      <div className="mb-4 flex items-center">
        <label htmlFor="radius" className="mr-2">Radius:</label>
        <select 
          id="radius" 
          value={radius} 
          onChange={(e) => handleRadiusChange(Number(e.target.value))}
          className="bg-secondary text-text px-3 py-1 rounded-lg"
        >
          <option value="5">5 miles</option>
          <option value="10">10 miles</option>
          <option value="20">20 miles</option>
          <option value="50">50 miles</option>
        </select>
        <span className="ml-4 text-sm text-gray-400">
          {userLocation !== defaultCenter 
            ? `${filteredBarbers.length} barbers found within ${radius} miles` 
            : `${filteredBarbers.length} barbers total`}
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
          {filteredBarbers.map((barber) => (
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
      
      {userLocation !== defaultCenter && filteredBarbers.length === 0 && !isLoading && (
        <div className="mt-4 p-4 bg-secondary rounded-lg text-center">
          <p>No barbers found within {radius} miles.</p>
          <p className="text-sm text-gray-400 mt-2">Try increasing the radius or check another location.</p>
        </div>
      )}
    </div>
  );
}