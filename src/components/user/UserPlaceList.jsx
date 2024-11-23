import { useState } from "react";

const UserPlaceList = ({ selectedPlaces, tripDays, onAddToDay, removePlaceFromSelected, isPlaceInAnyDay, days }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleDaySelect = (dayIndex) => {
    if (selectedPlace) {
      const isAlreadyAddedInSameDay = days[dayIndex].places.some(place => place.id === selectedPlace.id);
      if (!isAlreadyAddedInSameDay) {
        onAddToDay(dayIndex, selectedPlace);
        setShowOptions(false);
        setSelectedPlace(null);
      }
    }
  };

  const toggleOptions = (place) => {
    if (selectedPlace && selectedPlace.id === place.id) {
      setShowOptions(false);
      setSelectedPlace(null);
    } else {
      setSelectedPlace(place);
      setShowOptions(true);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-gray-900">My Trip</h2>
      {selectedPlaces.length === 0 ? (
        <p className="text-zinc-500">No places selected</p>
      ) : (
        <div className="max-h-64 overflow-y-auto"> 
        <ul>
          {selectedPlaces.map((place) => (
            <li key={place.id} className="border-b p-2 flex justify-between items-center border-gray-600">
              <span className="text-gray-800 text-sm"> ✺ {place.name}</span>
              <div className="flex items-center">
                <button
                  onClick={() => removePlaceFromSelected(place.id)}
                  className={`ml-4 text-sm px-2 py-1 rounded ${isPlaceInAnyDay(place.id) ? 'bg-gray-400' : 'bg-gray-800 text-white hover:bg-white hover:text-gray-800 hover:border-gray-800 hover:border-2 transition-all'}`}
                  disabled={isPlaceInAnyDay(place.id)}
                >
                  Remove
                </button>
                <button
                  onClick={() => toggleOptions(place)}
                  className={`ml-4 text-sm border-2 border-gray-800 bg-white text-gray-800 hover:bg-gray-800 hover:text-white transition-all px-2 py-1 rounded ${selectedPlace && selectedPlace.id === place.id ? 'bg-gray-400' : ''}`}
                >
                  {selectedPlace && selectedPlace.id === place.id ? 'Selected' : 'Select Day'}
                </button>
              </div>
            </li>
          ))}
        </ul>
        </div>
      )}
      {showOptions && selectedPlace && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold">Select a Day for {selectedPlace.name}:</h3>
          <div className="flex flex-wrap mt-2">
            {[...Array(tripDays)].map((_, index) => {
              const isAddedToOtherDay = isPlaceInAnyDay(selectedPlace?.id);
              const isAlreadyAddedInSameDay = days[index].places.some(place => place.id === selectedPlace?.id);
              const isDisabled = isAddedToOtherDay || isAlreadyAddedInSameDay;

              return (
                <button
                  key={index}
                  onClick={() => handleDaySelect(index)}
                  disabled={isDisabled}
                  className={`mr-2 mb-2 px-3 py-1 rounded transition duration-200 ${
                    isDisabled
                      ? 'bg-gray-300 text-white cursor-not-allowed'
                      : 'bg-amber-300 text-white hover:bg-amber-400'
                  }`}
                >
                  Day {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPlaceList;