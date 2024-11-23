import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'
import AdminSidebar from '../components/admin/AdminSidebar'

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-100">
      <div className="fixed top-0 left-0 h-full">
        <AdminSidebar />
      </div>
      <div className="flex flex-col flex-1 ml-64">
        <div className="sticky top-0 z-10">
          <AdminHeader />
        </div>
        <div className="flex-1 p-6 bg-white shadow-inner overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout