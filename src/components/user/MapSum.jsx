import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, Rectangle, InfoWindow, useLoadScript } from '@react-google-maps/api';

const MapSum = ({ placesByDay, selectedDay, allMarkers, destination }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (destination) {
      setCenter({ lat: destination.lat, lng: destination.lng });
      setBounds({
        north: destination.lat + 0.01, 
        south: destination.lat - 0.01,
        east: destination.lng + 0.01,
        west: destination.lng - 0.01,
      });
    }
  }, [destination]);

  useEffect(() => {
    if (selectedDay !== null) {
      const selectedMarkers = allMarkers.filter(marker =>
        placesByDay[selectedDay].some(place => place.name === marker.name)
      );
      setMarkers(selectedMarkers);
      
      if (selectedMarkers.length > 0) {
        setCenter({ lat: selectedMarkers[0].lat, lng: selectedMarkers[0].lng });
      }
    } else {
      setMarkers(allMarkers);
      if (allMarkers.length > 0) {
        setCenter({ lat: allMarkers[0].lat, lng: allMarkers[0].lng });
      }
    }
  }, [placesByDay, selectedDay, allMarkers]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '1000px' }}
        zoom={14}
        center={center}
        options={{
          zoomControl: true,
          gestureHandling: 'greedy',
        }}
      >
        {destination && (
          <Marker
            position={{ lat: destination.lat, lng: destination.lng }}
            title={destination.name}
            icon={{
              url: 'https://s11.gifyu.com/images/SOH8F.png', 
              scaledSize: new window.google.maps.Size(40, 60),
            }}
            onClick={() => {
              setSelectedMarker({
                lat: destination.lat,
                lng: destination.lng,
                name: destination.name,
              });
            }}
          />
        )}

        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.name}
            icon={marker.icon}
            onClick={() => {
              setSelectedMarker(marker);
              setCenter({ lat: marker.lat, lng: marker.lng });
            }}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className='flex flex-col items-center'>
              {selectedMarker.placeImage && (
                <img src={selectedMarker.placeImage} alt={selectedMarker.name} style={{ width: '50px', height: '50px' }} />
              )}
              <h3 className='font-bold'>{selectedMarker.name}</h3>
            </div>
          </InfoWindow>
        )}

        {bounds && (
          <Rectangle
            bounds={bounds}
            options={{
              fillColor: 'blue',
              fillOpacity: 0.1,
              strokeColor: 'blue',
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapSum;