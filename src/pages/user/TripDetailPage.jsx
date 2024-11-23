import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MapSum from "../../components/user/MapSum";
import EditTripModal from "../../components/user/EditTripModal";
import './TripDetailPage.css'


const TripDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripId } = location.state || {};
  const [trip, setTrip] = useState(null);
  const [placeDetails, setPlaceDetails] = useState({});
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [allMarkers, setAllMarkers] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const markerIcons = [
    {url:'https://s11.gifyu.com/images/SOH6r.png',
      scaledSize: { width: 50, height: 50 }
    },
    {url:'https://s11.gifyu.com/images/SOH6t.png',
      scaledSize: { width: 50, height: 50 }
    },
    {url:' https://s11.gifyu.com/images/SOH65.png',
      scaledSize: { width: 50, height: 50 }
    },
    {url:'https://s11.gifyu.com/images/SOH6D.png',
      scaledSize: { width: 50, height: 50 }
    },
    {url:'https://s11.gifyu.com/images/SOH6o.png',
      scaledSize: { width: 50, height: 50 }
    },
    'https://www.svgrepo.com/show/115675/goal.svg'
  ];

  const fetchTripDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/trips/${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setTrip(response.data.trip);
      fetchDestinationDetails(response.data.trip.destinationId);

      const placesData = response.data.trip.places;
      const details = {};
      const markers = []; 

      placesData.forEach((place) => {
        details[place.place.id] = {
          image: place.place.placeImage,
          name: place.place.name,
          description: place.place.description,
        };

        if (place.place.lat && place.place.lng) {
          markers.push({
            lat: parseFloat(place.place.lat),
            lng: parseFloat(place.place.lng),
            name: place.place.name,
            placeImage: place.place.placeImage,
            icon: markerIcons[place.dayIndex],
          });
        }
      });

      setPlaceDetails(details);
      setAllMarkers(markers); 

    } catch (error) {
      console.error("Error fetching trip details:", error);
      setError("Could not fetch trip details.");

      if (error.response && error.response.status === 404) {
        alert(`Trip with ID ${tripId} not found. Redirecting to profile.`);
        navigate("/user/profile");
      }
    } finally {
      setLoading(false);
    }
  };


  const fetchDestinationDetails = async (destinationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/destinations/${destinationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response.data.destination", response.data);
      // setDestination(response.data.destination);
      setDestination({
        id: response.data.destination.id,
        name: response.data.destination.name,
        lat: response.data.destination.lat,  
        lng: response.data.destination.lng,  
        places: response.data.destination.places 
      });
    } catch (error) {
      console.error("Error fetching destination:", error);
      setError("Could not fetch destination.");
    }
  };

  useEffect(() => {
    if (!tripId) {
      console.error("tripId is undefined");
      navigate("/user/profile");
    } else {
      fetchTripDetails();
    }
  }, [tripId]);

  const cloneTrip = async () => {
    const token = localStorage.getItem("token"); 

    if (!token) {
        alert('Please log in to clone trips.');
        return; 
    }

    try {
        console.log(`Cloning trip with ID: ${tripId}`); 
        const response = await axios.post(
            `http://localhost:8080/trips/${tripId}/clone`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            }
        );

        console.log('Trip cloned successfully:', response.data);
        navigate('/user/profile')
    } catch (error) {
        console.error('Error cloning trip:', error);
        setError('Could not clone trip. Please try again.'); 
    }
};

  const groupedPlaces =
    trip?.places?.reduce((acc, place) => {
      const { dayIndex, place: placeDetails } = place;
      if (!acc[dayIndex]) {
        acc[dayIndex] = [];
      }
      acc[dayIndex].push({
        id: placeDetails.id,
        name: placeDetails.name,
        description: placeDetails.description,
        placeImage: placeDetails.placeImage,
        latitude: placeDetails.lat,
        longitude: placeDetails.lng,
      });
      return acc;
    }, {}) || {};

  const handleTripUpdated = async () => {
    setIsEditModalOpen(false);
    await fetchTripDetails();
  };

  const handleDaySelected = (dayIndex) => {
    setSelectedDay(dayIndex);
  };

  const handleViewAll = () => {
    setSelectedDay(null);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 flex flex-col md:flex-row space-x-0 md:space-x-4 overflow-y-auto">
      <div className="bg-yellow-300 rounded-lg p-6 w-full md:w-1/3 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <h2 className="w-5/6 text-2xl font-bold mb-4 text-center bg-white p-2 rounded-full shadow-md">
          {trip?.name}
        </h2>
        <button onClick={handleViewAll} className="w-1/6 mb-4" id="view-all-btn" >
          <img 
          src="https://s1.gifyu.com/images/SOHRv.png" alt="View All" 
          className="w-10 h-10 hover:scale-125 hover:cursor-pointer hover:opacity-75 transition duration-200" />
        </button>
      </div>

        {destination && (
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold">
              Destination: {destination?.name}
            </h3>
          </div>
        )}

        <div className="flex justify-around items-center p-2 border-2 border-white rounded-lg mb-3">
          <p>Days: {trip.days}</p>
          <p>People: {trip.people}</p>
        </div>

        {Object.keys(groupedPlaces).map((dayIndex) => (
          <div key={dayIndex} className="mb-4">
            <div className="flex justify-between">
            <h3 className="font-semibold text-lg">
              Day {parseInt(dayIndex) + 1}
            </h3>
            <button onClick={() => handleDaySelected(dayIndex)} className="day-btn" id={`day-btn-${dayIndex}`}>
              <img src="https://s1.gifyu.com/images/SOHRk.png" alt="Day {dayIndex + 1}" 
              className="w-6 h-6 hover:scale-125 hover:cursor-pointer hover:opacity-75 transition duration-200"  />
            </button>
            </div>
            <ul className="space-y-4">
              {groupedPlaces[dayIndex].map((place, index) => (
                <li
                  key={`${place.id}-${index}`}
                  className="relative flex items-center bg-white p-4 rounded-lg shadow-md"
                >
                  <img
                    src={place.placeImage || "https://via.placeholder.com/150"}
                    alt={`Place ${place.name}`}
                    className="w-20 h-16 object-cover rounded-md shadow-md"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-base">
                      {place.name || "Loading..."}
                    </h4>
                    <p className="text-gray-600 text-sm max-h-[60px] overflow-y-auto">
                      {place.description || "Loading..."}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex justify-between gap-4">
          <button onClick={cloneTrip} className="bg-white text-black font-bold p-2 rounded-full mt-6 shadow-md w-1/3">
            Copy
          </button>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-white text-black font-bold p-2 rounded-full mt-6 shadow-md w-1/3"
          >
            Edit
          </button>
          <button
            onClick={() => navigate("/user/profile")}
            className="bg-white text-black font-bold p-2 rounded-full mt-6 shadow-md w-1/3"
          >
            Back to Profile
          </button>
        </div>
      </div>

      <div className="mt-4 md:mt-0 md:w-2/3">
        <MapSum placesByDay={groupedPlaces} selectedDay={selectedDay} allMarkers={allMarkers} destination={destination}/>
      </div>

      <EditTripModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        tripId={trip.id}
        tripName={trip.name}
        tripPeople={trip.people}
        onTripUpdated={handleTripUpdated}
      />
    </div>
  );
};

export default TripDetailPage;
