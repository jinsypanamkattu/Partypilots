import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  useEffect(() => {
    const map = L.map('map').setView([37.692457, -97.318858], 12); // Set your fixed latitude and longitude

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add a marker at a specific latitude and longitude
    const marker = L.marker([37.692457, -97.318858]).addTo(map);

    // Add a popup to the marker
    marker.bindPopup('Partypilot: 123 Event Street, Suite 456, New York, NY 10001').openPopup();

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ width: '100%', height: '600px' }}></div>;
};

export default Map;