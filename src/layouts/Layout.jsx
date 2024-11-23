import React from 'react'
import MainNav from '../components/MainNav'
import { Outlet } from 'react-router-dom'

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <MainNav />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
