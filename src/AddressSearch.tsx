import React, { useState, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressSearchProps {
  onAddressSelected: (latlng: L.LatLngTuple) => void;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onAddressSelected }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const map = useMap();
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (query.length > 2) {
      const delayDebounce = setTimeout(() => {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
        )
          .then((res) => res.json())
          .then((data) => {
            setResults(data);
            setShowResults(true);
          })
          .catch((err) => {
            console.error('Search error:', err);
            setResults([]);
          });
      }, 300);

      return () => clearTimeout(delayDebounce);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    map.setView([lat, lng], 14);

    onAddressSelected([lat, lng]);

    setQuery(result.display_name);
    setShowResults(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    setTimeout(() => {
      handleSelect(result);
    }, 0);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 10,
        left: 'calc(50% - 150px)',
        zIndex: 400,
        width: '300px',
      }}
    >
      <input
        type="text"
        placeholder="Введите адрес..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowResults(results.length > 0)}
        style={{
          width: '100%', 
          padding: '8px 12px', 
          fontSize: '14px', 
          border: '1px solid #ccc', 
          borderRadius: '4px', 
          outline: 'none', 
          boxSizing: 'border-box', 
        }}
      />
      {showResults && results.length > 0 && (
        <ul
          ref={resultsRef}
          style={{
            position: 'absolute', 
            top: '100%', 
            left: 0, 
            right: 0, 
            backgroundColor: 'white', 
            border: '1px solid #ccc', 
            borderRadius: '4px', 
            marginTop: '2px', 
            maxHeight: '200px', 
            overflowY: 'auto', 
            zIndex: 1001, 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)', 
        }}
        >
        {results.map((result, index) => (
          <li
            key={`${result.lat}-${result.lon}-${index}`}
            onClick={() => handleResultClick(result)}
            style={{
                padding: '8px 12px', 
                cursor: 'pointer', 
                borderBottom: '1px solid #eee', 
                boxSizing: 'border-box', 
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            {result.display_name}
          </li>
        ))}
        </ul>
      )}
    </div>
  );
};

export default AddressSearch;
