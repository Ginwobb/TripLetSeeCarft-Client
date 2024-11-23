import React from 'react';

const SumSecCreateTrip = ({ days, onDaySelect, selectedDayIndex }) => {
  return (
    <div className="mb-4 flex-1">
      <h2 className="text-xl my-4 font-bold text-gray-900">Trip Details:</h2>
      <div className='h-[500px] overflow-y-auto'>
        {days.map((day, index) => (
          <div 
            key={index}
            onClick={() => onDaySelect(index)} 
            className={`border rounded-lg p-4 mb-4 cursor-pointer ${
              selectedDayIndex === index ? 'bg-yellow-400 text-gray-800' : 'bg-white border-2 border-amber-400 text-gray-900'
            }`}
          >
            <h3 className="font-bold">Day {index + 1}</h3>
            <ul>
              {day.places.length === 0 ? (
                <p>No places selected for this day</p>
              ) : (
                day.places.map((place) => (
                  <li key={place.id} className="flex items-center my-2 p-2 border rounded-lg gap-4">
                    {place.placeImage && (
                      <img
                        src={place.placeImage}
                        alt={place.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div className="mx-auto font-semibold text-base">{place.name}</div>
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}

      </div>
    </div>
  );
};

export default SumSecCreateTrip;
