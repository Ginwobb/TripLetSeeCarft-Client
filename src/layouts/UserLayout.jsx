import React from 'react'
import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <MainNav />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  )
}

export default UserLayout