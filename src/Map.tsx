import React, { useState, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Marker } from 'react-leaflet'; 
import { EditControl } from 'react-leaflet-draw';
import AddressSearch from './AddressSearch';
import CheckAddress from './CheckAddress';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import * as L from 'leaflet';

const Map: React.FC = () => {
  const center: [number, number] = [56.634, 47.904];
  const MAX_POLYGON_COUNT = 1;
  const MAX_POLYGON_POINTS = 20;

  const [markerCoords, setMarkerCoords] = useState<L.LatLngTuple | null>(null);
  const [polygonGeometry, setPolygonGeometry] = useState<any | null>(null); 

  const handleAddressSelected = useCallback((latlng: L.LatLngTuple) => {
    setMarkerCoords(latlng);
  }, []);

  const getGeoDataHandler = useCallback(() => {
      if (markerCoords && polygonGeometry) {
          return {
              point: markerCoords,
              polygon: polygonGeometry
          };
      }
      return null;
  }, [markerCoords, polygonGeometry]); 

  const [polygonCount, setPolygonCount] = useState(0);
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const [editableFG, setEditableFG] = useState<L.FeatureGroup | null>(null);

  const handlePolygonCreated = useCallback((e: any) => {
    const { layer, layerType } = e;
    if (layerType === 'polygon') {
      setPolygonCount(prevCount => prevCount + 1); 
      const geoJsonData = layer.toGeoJSON();
      setPolygonGeometry(geoJsonData.geometry); 
    }
  }, []); 

  const handlePolygonEdited = useCallback((e: any) => {
    const { layers } = e;
    layers.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Polygon) {
        const geoJsonData = layer.toGeoJSON();
        setPolygonGeometry(geoJsonData.geometry);
      }
    });
  }, []);

  const handlePolygonDeletedCorrected = useCallback((e: any) => {
    setPolygonCount(prevCount => prevCount - 1); 
    setPolygonGeometry(null); 
  }, []);

  const drawOptions = useMemo(() => {
    const enablePolygon = polygonCount < MAX_POLYGON_COUNT;
    return {
        rectangle: false, circle: false, circlemarker: false, marker: false, polyline: false,
        polygon: enablePolygon ? {
          allowIntersection: false, 
          maxPoints: MAX_POLYGON_POINTS,
          drawError: {
          color: '#e1e100',
          message: `<strong>Ошибка:</strong> <ul>
                        <li>Не более ${MAX_POLYGON_POINTS} вершин.</li>
                        <li>Вершины не должны пересекаться.</li>
                    </ul>`
        },
        } : false,
      };
  }, [polygonCount]);

  return (
    <div style={{
      height: '700px', 
      width: '600px', 
      position: 'relative', 
      margin: '0 auto', 
    }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
        
        {markerCoords && <Marker position={markerCoords} />}

        <FeatureGroup 
            ref={(featureGroupInstance) => {
                featureGroupRef.current = featureGroupInstance;
                setEditableFG(featureGroupInstance); 
            }}
        >
          {editableFG && (
            <EditControl
              position="topright"
              onCreated={handlePolygonCreated}
              onEdited={handlePolygonEdited} 
              onDeleted={handlePolygonDeletedCorrected} 
              draw={drawOptions} 
              edit={{
                  edit: { allowIntersection: false, } as any, 
                  remove: true
              }}
            />
          )}
        </FeatureGroup>
        
        <AddressSearch onAddressSelected={handleAddressSelected} />

        <CheckAddress getGeoDataHandler={getGeoDataHandler}/>
      </MapContainer>
    </div>
  );
};

export default Map;
