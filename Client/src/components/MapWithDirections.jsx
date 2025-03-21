// components/MapWithDirections.jsx
import React, { useState } from 'react';
import { 
  GoogleMap, 
  LoadScript, 
  Marker, 
  DirectionsService, 
  DirectionsRenderer 
} from '@react-google-maps/api';

const MapWithDirections = () => {
  const [map, setMap] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [directions, setDirections] = useState(null);
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const mapStyles = {
    height: "500px",
    width: "100%"
  };
  
  const defaultCenter = {
    lat: 40.712776,
    lng: -74.005974
  };

  const geocodeAddress = (address, setCoords) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        setCoords({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  const calculateRoute = () => {
    if (origin === '' || destination === '') {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  const handleOriginChange = (e) => {
    setOrigin(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleSearch = () => {
    if (origin) geocodeAddress(origin, setOriginCoords);
    if (destination) geocodeAddress(destination, setDestinationCoords);
  };

  return (
    <div>
      <div className="search-container" style={{ marginBottom: '20px' }}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Starting point"
            value={origin}
            onChange={handleOriginChange}
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={handleDestinationChange}
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
          <button onClick={handleSearch} style={{ padding: '8px 15px' }}>
            Search
          </button>
          <button onClick={calculateRoute} style={{ padding: '8px 15px', marginLeft: '10px' }}>
            Get Directions
          </button>
        </div>
      </div>
      
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={originCoords || defaultCenter}
          onLoad={map => setMap(map)}
        >
          {originCoords && <Marker position={originCoords} />}
          {destinationCoords && <Marker position={destinationCoords} />}
          
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapWithDirections;