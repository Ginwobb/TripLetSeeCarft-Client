import React from 'react'
import {Link} from 'react-router-dom'
import { DashIcon, MnTrip, MnUser, PinLocation } from '../../icons'

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6 mt-2 text-center">Admin Panel</h2>
      <nav className="space-y-4">
        <Link to="/admin" className="flex items-center gap-2 py-2 px-4 hover:bg-gray-700 rounded hover:scale-105 transition-all"><DashIcon className='w-6 h-6' />Dashboard</Link>
        <Link to="/admin/users" className="flex items-center gap-2 py-2 px-4 hover:bg-gray-700 rounded hover:scale-105 transition-all"><MnUser className='w-6 h-6' /> Manage Users</Link>
        <Link to="/admin/trips" className="flex items-center gap-2 py-2 px-4 hover:bg-gray-700 rounded hover:scale-105 transition-all"><MnTrip className='w-6 h-6'/> Manage Trips</Link>
        <Link to="/admin/places" className="flex items-center gap-2py-2 px-4 hover:bg-gray-700 rounded hover:scale-105 transition-all"><PinLocation className='w-6 h-6'/>Manage Places</Link>
      </nav>
    </div>
  )
}
