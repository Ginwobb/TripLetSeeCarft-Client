import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import useUserStore from '../../stores/userStore'

export default function Dashboard() {
  const [usersCount, setUsersCount] = useState(0)
  const [tripsCount, setTripsCount] = useState(0)
  const [placesCount, setPlacesCount] = useState(0)
  const { token } = useUserStore(state => state)

  useEffect(() => {
    getUsersCount()
    getTripsCount()
    getPlacesCount()
  }, [])

  const getUsersCount = async () => {
    try {
      const result = await axios.get('http://localhost:8080/admin/users/count', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsersCount(result.data.users)
    } catch (error) {
      console.log(error)
    }
  }

  const getTripsCount = async () => {
    try {
      const result = await axios.get('http://localhost:8080/admin/trips/count', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTripsCount(result.data.trips)
    } catch (error) {
      console.log(error)
    }
  }


  const getPlacesCount = async () => {
    try {
      const result = await axios.get('http://localhost:8080/admin/places/count', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlacesCount(result.data.places)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <h2 className="text-2xl">Users</h2>
          <p className="text-xl font-bold">{usersCount}</p>
          <p>Manage users here</p>
          <Link to="/admin/users">
            <button className="bg-white text-blue-500 mt-2 py-2 px-4 rounded">
              Manage Users
            </button>
          </Link>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h2 className="text-2xl">Trips</h2>
          <p className="text-xl font-bold">{tripsCount}</p>
          <p>Manage trips here</p>
          <Link to="/admin/trips">
            <button className="bg-white text-green-500 mt-2 py-2 px-4 rounded">
              Manage Trips
            </button>
          </Link>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-lg">
          <h2 className="text-2xl">Places</h2>
          <p className="text-xl font-bold">{placesCount}</p>
          <p>Manage places here</p>
          <Link to="/admin/places">
            <button className="bg-white text-yellow-500 mt-2 py-2 px-4 rounded">
              Manage Places
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
