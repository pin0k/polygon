import React from 'react';
import * as L from 'leaflet'; 

interface GeoData {
  point: L.LatLngTuple;
  polygon: { type: string; coordinates: [number, number][][] }; 
}

interface CheckAddressProps {
  getGeoDataHandler: () => GeoData | null;
}

const CheckAddress: React.FC<CheckAddressProps> = ({ getGeoDataHandler }) => {
  const isPointInPolygon = (point: L.LatLngTuple, polyCoords: [number, number][][]): boolean => {
    const [lat, lng] = point;
    const polygon = polyCoords[0]; 
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      const intersect = ((yi > lat) !== (yj > lat)) && 
        (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
 
      if (intersect) inside = !inside;
      j = i;
    }

    return inside;
  };

  const checkedAddress = () => {      
    const data = getGeoDataHandler(); 
    if (data) {
      const isInside = isPointInPolygon(data.point, data.polygon.coordinates);
        if (isInside) {
          alert("✅ Метка НАХОДИТСЯ внутри полигона!");
        } else {
          alert("❌ Метка ВНЕ полигона или на его границе!");
        }
      } else {
        alert("⚠️ Нет данных для проверки (нет метки или полигона).");
    }
  }

  return (
    <div 
      style={{
        position: 'absolute',
        bottom: 10,
        left: 'calc(50% - 70px)',
        zIndex: 400,
        width: '140px',
      }}>
      <button 
        style={{
          textTransform: 'uppercase'
        }}
        onClick={checkedAddress}
      >Check address</button>
    </div>
  )
}

export default CheckAddress;
