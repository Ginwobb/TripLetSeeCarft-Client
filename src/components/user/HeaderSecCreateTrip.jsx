import React from 'react';

const HeaderSecCreateTrip = ({ tripName, setTripName, numberOfPeople, setNumberOfPeople }) => {

  console.log('tripName', tripName)
    return (
      <div className="flex justify-between items-center bg-yellow-400 p-4 rounded-t-lg h-24 shadow-md">
        <input
          type="text"
          placeholder="Name of Trip..."
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          className="flex-1 p-4 border rounded-lg mr-2 font-semibold text-lg text-gray-800 text-center focus:outline-none"
        />
        <input
          type="number"
          placeholder="People..."
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(e.target.value)}
          min="1"
          className="p-4 border text-center text-lg font-semibold text-gray-800 rounded-lg"
        />
      </div>
    );
  };

export default HeaderSecCreateTrip
