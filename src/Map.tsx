// src/components/SimpleMapWithDrawing.tsx
import React from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const Map: React.FC = () => {
  const center: [number, number] = [56.634, 47.904];

  return (
    <div style={{ 
      height: '700px', 
      width: '600px',
      position: 'relative'
    }}>
      <MapContainer 
        center={center} 
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        
        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polyline: false,
              polygon: true
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default Map;