import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginModal from './auth/LoginModal'
import MainNav from '../components/MainNav'
import useUserStore from '../stores/userStore'
import useTripStore from '../stores/tripStore'
import { getDestList } from '../api/getData-api'
import homeImage from '../assets/homeImage.jpg'
import tripSchema from '../utils/tripValidator'

const Home = () => {
  const {token} = useUserStore()
  const {
    finalDest,
    selectedDest, 
    startDate, 
    endDate, 
    setFinalDest,
    setSelectedDest,
    setStartDate,
    setEndDate,
    setTrip} = useTripStore()

  const [isLoggedIn, setIsLoggedIn] = useState(!!token)

  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const getDest = async () => {
    try {
      const resp = await getDestList(token)
      if (Array.isArray(resp.data.destinations)) {
        setFinalDest(resp.data.destinations)
      }
    } catch (err) {
      console.log('Error fetching destinations:', err)
      setFinalDest([])
    }
  }

  const calculateDays = (start, end) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate - startDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))+1
  }

  useEffect(() => {
    setIsLoggedIn(!!token)
    if (token) {
      getDest()
    }
  }, [token])

  const handlePlanTrip = () => {
    if (!token) {
      document.getElementById('login_modal').showModal();
      return;
    }

    const { error } = tripSchema.validate({ selectedDest, startDate, endDate }, { abortEarly: false });

    if (error) {
      const errorMessages = {};
      error.details.forEach(err => {
        errorMessages[err.path[0]] = err.message;
      });
      setErrors(errorMessages);
      return;
    }
  
    const numOfDays = calculateDays(startDate, endDate);
    if (numOfDays > 5) {
      setErrors({ endDate: 'The trip cannot be longer than 5 days' });
      return;
    }
  
    setTrip(selectedDest, numOfDays);
    navigate('/user/plan');
  };
  

  return (
    <div className="min-h-screen justify-center"
    style={{
      backgroundImage: `url(${homeImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <h1 className="text-8xl font-medium text-center text-white text-shadow bg-black bg-opacity-50 pt-24 mb-24">Let's SeeCraft</h1>
      <div className="flex justify-around items-center space-y-4 my-12">
        <div>
          <label htmlFor="destinations" className="block text-xl font-semibold mb-2 text-white">Destination:</label>
          <select
            id="destinations"
            className="border border-stone-500 rounded-md p-2 w-64"
            value={selectedDest}
            onChange={(e) => setSelectedDest(e.target.value)}
          >
            <option value="">Select destination</option>
            {isLoggedIn && finalDest.map((dest) => (
              <option key={dest.id} value={dest.id}> 
                {dest.name}
              </option>
            ))}
          </select>
          {errors.selectedDest && <p className="text-red-500">{errors.selectedDest}</p>}
        </div>

        <div>
          <label className="block text-xl font-semibold mb-2 text-white">Date:</label>
          <div className="flex space-x-2 items-center">
            <input
              type="date"
              className="border border-stone-500 rounded-md p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              />
            <span>→</span>
            <input
              type="date"
              className="border border-stone-500 rounded-md p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              />
          </div>
          {errors.startDate && <p className="text-red-500">{errors.startDate}</p>}
          {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
        </div>
      </div>
      <div className='flex justify-center'>
        <button
          onClick={handlePlanTrip}
          className='bg-white bg-opacity-50 text-black font-bold py-3 px-8 rounded-lg shadow-md mt-10 w-52 hover:bg-yellow-400 hover:font-bold hover:scale-110'
        >
          Plan
        </button>
      </div>
      <LoginModal />
    </div>
  )
}

export default Home;
