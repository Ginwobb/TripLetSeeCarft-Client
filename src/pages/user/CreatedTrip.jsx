import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import useTripStore from '../../stores/tripStore';
import HeaderSecCreateTrip from '../../components/user/HeaderSecCreateTrip';
import SumSecCreateTrip from '../../components/user/SumSecCreateTrip';
import MapSecCreateTrip from '../../components/user/MapSecCreateTrip';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Backb, NextIcon } from '../../icons';

const CreatedTrip = () => {
  const { destination, days, selectedPlaces, tripName, numberOfPeople, setTripName, setNumberOfPeople,startDate, endDate } = useTripStore(state => ({
    destination: state.selectedDest,
    days: state.days,
    selectedPlaces: state.selectedPlaces,
    tripName: state.tripName,
    numberOfPeople: state.numberOfPeople,
    setTripName: state.setTripName,
    setNumberOfPeople: state.setNumberOfPeople,
    startDate: state.startDate,
    endDate: state.endDate
  }));
  const [selectedDayIndex, setSelectedDayIndex] = useState(days[0]);
  const navigate = useNavigate();


  const hdlSubmit = async (e) => {
    e.preventDefault()

    const placesData = []

    let destinationId

    days.forEach((day, dayIndex) => {
      day.places.forEach((place) => {
        placesData.push({
          dayIndex,
          placeId: place.id,
        })
        if (!destinationId) {
          destinationId = place.destinationId 
        }
      })
    })

    const tripData = {
      name: tripName,
      destinationId, 
      days: days.length,
      people: numberOfPeople,
      places: placesData,
      startDate: startDate,
      endDate: endDate,
    }
    try {
      const response = await axios.post('http://localhost:8080/trips/', tripData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        toast.success(`Save ${response.data.trip.name}'s trip success`)
        navigate('/user/profile');
      } else {
        toast.error(`Save ${response.data.trip.name}'s trip failed`)
      }
    } catch (error) {
      console.error('Error creating trip:', error.response ? error.response.data : error.message);
    }
  };

  const hdlBack = () => {
    navigate('/user/plan', { state: { tripName, numberOfPeople, days, selectedPlaces, destination } });
  };

  const handleDaySelect =(index) =>{
    setSelectedDayIndex(index)
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900">
      <h1 className="text-2xl font-bold text-white my-4">Trip Summary</h1>
      <form onSubmit={hdlSubmit} className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <HeaderSecCreateTrip
          tripName={tripName}
          setTripName={setTripName}
          numberOfPeople={numberOfPeople}
          setNumberOfPeople={setNumberOfPeople}
        />
        <div className='flex items-center justify-center bg-white'>
        {!tripName && <p className="text-red-600 mb-2">Please enter a trip name.</p>}
        </div>
        <div className="flex gap-5 p-4">
          <SumSecCreateTrip days={days} onDaySelect={handleDaySelect} selectedDayIndex={selectedDayIndex} />
          <MapSecCreateTrip selectedDay={days[selectedDayIndex]} dayIndex={selectedDayIndex}/>
        </div>
        <div className="flex justify-around my-4">
          <button
            type="button" 
            onClick={hdlBack}
            className="flex gap-2 items-center justify-center bg-white border-2 border-gray-800 text-gray-800 py-4 px-4 rounded-full w-1/3 font-semibold shadow-md mt-4 hover:bg-gray-800 hover:text-yellow-400 hover:border-2 hover:border-white transition-all"
          > 
          <Backb className='w-6 h-6'/>Back to Select
          </button>
          <button
            type="submit"
            className={`flex gap-2 items-center justify-center py-2 px-4 mt-4  border-2 border-gray-800 h-16 shadow-md rounded-full w-1/3 ${!tripName ? 'bg-gray-300 text-gray-600 font-semibold cursor-not-allowed' : 'bg-white text-gray-800 font-semibold hover:bg-gray-800 hover:text-yellow-400 hover:border-2 hover:border-white transition-all'}`}
            disabled={!tripName}
          >
           Save <NextIcon className='w-6 h-6' />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatedTrip;
