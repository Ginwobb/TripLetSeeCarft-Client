import React from 'react'
import useUserStore from '../../stores/userStore'
import { useShallow } from 'zustand/react/shallow'
import { useNavigate } from 'react-router-dom'
import AdminAvatar from '../AdminAvatar'

export default function AdminHeader() {
  const {user, logout} = useUserStore(useShallow(state =>({user:state.user,logout:state.logout})))
  const navigate = useNavigate()

  const logoutHandler =  () => {
    logout()
    navigate('/')
  }
  return (
    <div className='text-white bg-neutral-900 h-16 px-6 flex items-center justify-between shadow-lg'>
    <div className='text-lg font-bold'>Admin Panel</div>
    <div className="dropdown dropdown-end mt-2">
      <div tabIndex={0} role="button" className='hover:scale-105 mr-6' >
        <AdminAvatar 
        className='w-14 h-14 rounded-full'
        menu = {true}
        />
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow text-black font-semibold hover:text-amber-500">
        <li onClick={logoutHandler}><a>Logout</a></li>
      </ul>
    </div>
  </div>
  )
}
