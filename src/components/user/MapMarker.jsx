import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Circle, InfoWindow } from '@react-google-maps/api';

const MapMarker = ({ selectedPlaces, allPlaces, selectedCategory }) => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!googleMapsApiKey) {
    console.error('Missing Google Maps API key');
    return null;
  }

  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [markers, setMarkers] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);

  const categoryIcons = {
    1: {url:'https://s11.gifyu.com/images/SOHEo.png',
      scaledSize: { width: 40, height: 40 }
    },
    2: {url:'https://s11.gifyu.com/images/SOHEr.png',
    scaledSize: { width: 40, height: 40 }
  },
    3: {url:'https://s11.gifyu.com/images/SOHEt.png',
      scaledSize: { width: 40, height: 40 }
    },
  };

  const getRadius = (zoom) => {
    const baseRadius = 90000;
    const zoomAdjustmentFactor = 0.5;
    return baseRadius * Math.pow(zoomAdjustmentFactor, zoom - 8);
  };

  useEffect(() => {
    if (selectedPlaces.length > 0) {
      setMarkers(selectedPlaces);
    } else if (selectedCategory) {
      const filteredPlaces = allPlaces.filter(place => place.categoryId === selectedCategory);
      setMarkers(filteredPlaces);
    } else {
      setMarkers(allPlaces);
    }
  }, [selectedPlaces, allPlaces, selectedCategory]);

  useEffect(() => {
    if (markers.length > 0) {
      const latSum = markers.reduce((sum, place) => sum + place.lat, 0);
      const lngSum = markers.reduce((sum, place) => sum + place.lng, 0);
      const center = {
        lat: latSum / markers.length,
        lng: lngSum / markers.length,
      };
      setMapCenter(center);
    }
  }, [markers]);

  const onLoad = (map) => {
    setZoomLevel(map.getZoom());
    map.addListener('zoom_changed', () => {
      const newZoom = map.getZoom();
      setZoomLevel(newZoom);
    });
  };

  const handleMarkerClick = (place) => {
    setMapCenter({ lat: place.lat, lng: place.lng });
    setZoomLevel((prevZoom) => prevZoom + 1);
    setActiveMarker(place);
  };

  const handleCloseInfoWindow = () => {
    setActiveMarker(null);
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={{ height: '500px', width: '100%' }}
        center={mapCenter}
        zoom={zoomLevel}
        onLoad={onLoad}
      >
        {markers.map((place) => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            title={place.name}
            icon={categoryIcons[place.categoryId] || 'https://www.svgrepo.com/show/312483/location-indicator-red.svg'} 
            onClick={() => handleMarkerClick(place)}
          />
        ))}
        <Circle
          center={mapCenter}
          radius={getRadius(zoomLevel)}
          options={{
            fillColor: 'blue',
            fillOpacity: 0.1,
            strokeColor: 'blue',
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
        {activeMarker && (
          <InfoWindow
            position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
            onCloseClick={handleCloseInfoWindow}
          >
            <div className='flex flex-col items-center p-2'>
              {activeMarker.placeImage && <img src={activeMarker.placeImage} alt={activeMarker.name} style={{ width: '50px', height: '50px' }} />}
              <h2 className="font-bold">{activeMarker.name}</h2>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapMarker;
