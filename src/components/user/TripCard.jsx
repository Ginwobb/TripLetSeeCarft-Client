import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const TripCard = ({ tripName, destination, date, people, tripId, onDelete }) => {
  const navigate = useNavigate()
  
  const handleDelete = async (e) => {
    e.stopPropagation()
    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`http://localhost:8080/trips/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('tripId', tripId)

      if (response.status === 200) {
        onDelete(tripId);
        navigate('/user/profile');
      } else {
        console.error('Failed to delete trip:', response.data.message)
      }
    } catch (error) {
      console.error('Error deleting trip:', error)
    }
  }

  return (
    <div className="flex items-center bg-gray-200 rounded-lg p-4 mb-4">
      <img 
        src="https://via.placeholder.com/150" 
        alt="Trip" 
        className="w-24 h-24 rounded-lg mr-4" 
      />
      <div className="flex-grow">
        <h3 className="font-bold text-xl">{tripName}</h3>
        <p className="text-gray-600">Destination: {destination}</p>
        <p className="text-gray-600">Date: {date}</p>
        <p className="text-gray-600">People: {people} Person(s)</p>
      </div>
      <button onClick={(e) => handleDelete(e)} className="text-red-500 font-bold">X</button>
    </div>
  )
}

export default TripCard;
