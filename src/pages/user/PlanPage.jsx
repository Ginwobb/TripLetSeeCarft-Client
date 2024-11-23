import React, { useEffect, useState } from 'react';
import PlacesList from '../../components/user/PlacesList';
import MapMarker from '../../components/user/MapMarker';
import UserPlaceList from '../../components/user/UserPlaceList';
import { useNavigate } from 'react-router-dom';
import useTripStore from '../../stores/tripStore';
import useUserStore from '../../stores/userStore';
import { getPlaceListByDest, getCategories } from '../../api/getData-api';
import { RemoveIcon } from '../../icons/index';
import { toast } from 'react-toastify';

const PlanPage = () => {
  const navigate = useNavigate();
  const { token } = useUserStore();
  const {
    selectedDest,
    numOfDays,
    selectedPlaces,
    addSelectedPlace,
    removeSelectedPlace,
    setDays,
    days,
    addPlaceToDay, 
    removePlaceFromDay,
  } = useTripStore((state) => ({
    selectedDest: state.selectedDest,
    numOfDays: state.numOfDays,
    selectedPlaces: state.selectedPlaces,
    addSelectedPlace: state.addSelectedPlace,
    removeSelectedPlace: state.removeSelectedPlace,
    setDays: state.setDays,
    days: state.days,
    addPlaceToDay: state.addPlaceToDay,
    removePlaceFromDay: state.removePlaceFromDay
  }));

  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isHidden, setIsHidden] = useState(false); 

    useEffect(() => {
    const fetchData = async () => {
      if (selectedDest && token) {
        const res = await getPlaceListByDest(selectedDest, token, selectedCategory);
        setPlaces(res);
        const categoryRes = await getCategories(token);
        setCategories(categoryRes);
      }
    };

    fetchData();
  }, [selectedDest, token, selectedCategory])

  useEffect(() => {
    const storedState = JSON.parse(localStorage.getItem('trip-storage'));
    if (storedState) {
      if (JSON.stringify(storedState.state.days) !== JSON.stringify(days)) {
        setDays(storedState.state.days);
      }
      setPlaces(storedState.state.places || []);
      setCategories(storedState.state.categories || []);
      setSelectedCategory(storedState.state.selectedCategory || null);
      setIsHidden(storedState.state.isHidden || false);
    }
  }, []);

  const isPlaceInAnyDay = (id) => {
    return days.some((day) => day.places.some((place) => place.id === id));
  };

  const hdlSave = () => {
    const allDaysHavePlaces = days.every(day => day.places.length > 0);
  
    if (!allDaysHavePlaces) {
      toast.error('Please select at least one place for each day before saving.');
    } else {
      navigate('/user/create-trip');
    }
  };
  

  return (
    <div className="h-screen bg-white fixed">
      <div className='flex p-4 gap-4 mt-5'>
        <div className="w-1/3 bg-gray-200 p-4 rounded-lg shadow-lg hover:scale-105 cursor-pointer transition-all overflow-y-auto" style={{ maxHeight: '80vh' }}>
          <h2 className="text-xl font-bold text-gray-900 my-2">Places List</h2>
          <PlacesList 
            places={places} 
            addPlace={addSelectedPlace} 
            selectedPlaces={selectedPlaces} 
            categories={categories}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        <div className="w-1/3 bg-yellow-400 hover:scale-105 transition-all p-4 rounded-lg shadow-lg overflow-y-auto" style={{ maxHeight: '80vh' }}>
          <div className='flex justify-between'>
            <h2 className="text-xl my-2 font-bold text-gray-900">My Trip</h2>
            <button
              onClick={() => setIsHidden(!isHidden)}
              className="mb-2 bg-white text-gray-900 py-1 px-4 rounded-full font-semibold hover:bg-amber-400 hover:text-white hover:border-2 hover:border-white transition-all"
            >
              {isHidden ? 'Expand' : 'Hidden'}
            </button>
          </div>

          {!isHidden && (
            <UserPlaceList
              selectedPlaces={selectedPlaces}
              tripDays={numOfDays}
              days={days} 
              onAddToDay={addPlaceToDay}
              removePlaceFromSelected={removeSelectedPlace}
              isPlaceInAnyDay={isPlaceInAnyDay}
            />
          )}

          <h3 className="text-lg font-bold mt-4 text-gray-800">Plan for {numOfDays} days</h3>
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="border border-white rounded-lg p-4 mb-4 shadow bg-gray-800 bg-opacity-90">
              <h3 className="text-md font-semibold text-white">Day {dayIndex + 1}</h3>
              <ul className="mt-2">
                {day.places.length === 0 ? (
                  <p className="text-gray-200">No places added</p>
                ) : (
                  day.places.map((place) => (
                    <li key={place.id} className="flex justify-between items-center py-2 border-b">
                      <span className="text-yellow-400 hover:text-yellow-300 font-medium">{place.name}</span>
                      <button
                        onClick={() => removePlaceFromDay(place.id, dayIndex)} 
                      >
                        <RemoveIcon className="w-6 h-6 text-white"/>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
          <button onClick={hdlSave} className="w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
            Save Trip
          </button>
        </div>

        <div className="w-1/3 bg-gray-300 p-4 rounded-lg shadow-lg hover:scale-105 transition-all">
          <MapMarker
          selectedPlaces={selectedPlaces}
          allPlaces={places}
          selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
