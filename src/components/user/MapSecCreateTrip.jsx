import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapSecCreateTrip = ({ selectedDay, dayIndex, selectedPlaces }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 13.7563, lng: 100.5018 });
  const [markers, setMarkers] = useState([]);

  const markerIcons = [
    {
      url: 'https://s11.gifyu.com/images/SOH6r.png',
      scaledSize: { width: 40, height: 40 },
    },
    {
      url: 'https://s11.gifyu.com/images/SOH6t.png',
      scaledSize: { width: 40, height: 40 },
    },
    {
      url: ' https://s11.gifyu.com/images/SOH65.png',
      scaledSize: { width: 40, height: 40 },
    },
    {
      url: 'https://s11.gifyu.com/images/SOH6D.png',
      scaledSize: { width: 40, height: 40 },
    },
    {
      url: 'https://s11.gifyu.com/images/SOH6o.png',
      scaledSize: { width: 40, height: 40 },
    },
    'https://www.svgrepo.com/show/115675/goal.svg',
  ];

  useEffect(() => {
    if (selectedDay && selectedDay.places.length > 0) {
      const firstPlace = selectedDay.places[0]; 
      setMapCenter({ lat: firstPlace.lat, lng: firstPlace.lng });

      const currentDayIndex = dayIndex !== undefined ? dayIndex : 0;

      const placesMarkers = selectedDay.places.map((place) => ({
        id: place.id,
        position: { lat: place.lat, lng: place.lng },
        name: place.name,
        icon: markerIcons[currentDayIndex] || markerIcons[markerIcons.length - 1], 
      }));

      setMarkers(placesMarkers);
    } else {
      console.warn('No places found for the selected day.');
      setMarkers([]);
      
      if (selectedPlaces && selectedPlaces.length > 0) {
        const firstPlace = selectedPlaces[0];
        setMapCenter({ lat: firstPlace.lat, lng: firstPlace.lng });
      } else {
        setMapCenter({ lat: 13.7563, lng: 100.5018 }); 
      }
    }
  }, [selectedDay, dayIndex, selectedPlaces]);

  return (
    <div className="flex-1 bg-white p-4 mt-10 rounded-lg border-4 border-yellow-400 shadow-lg">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}
          center={mapCenter}
          zoom={14}
          options={{
            scrollwheel: true, 
          }}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              title={marker.name}
              icon={marker.icon} 
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapSecCreateTrip;
