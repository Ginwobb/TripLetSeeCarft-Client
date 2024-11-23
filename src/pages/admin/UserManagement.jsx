import React, { useEffect, useState } from 'react'
import useUserStore from '../../stores/userStore'
import { toast } from 'react-toastify'
import axios from 'axios'


export default function UserManagement() {
    const [users, setUsers] = useState([])
    const {token} = useUserStore(state=>state)

    useEffect(()=>{
        getUsers()
    },[])

    const getUsers = async () => {
        try {
            const result = await axios.get('http://localhost:8080/admin/users',{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            setUsers(result.data.users)
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        }
    }

    const handleDelete = async (id) => {
      try {
          const result = await axios.delete(`http://localhost:8080/admin/users/${id}`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          })
          getUsers()
          toast.success(result.data.message)
      } catch (err) {
          console.log(err)
          toast.error(err.message)
      }
  }

    const handleUpdate = async (e,id) => {
        const role = e.target.value
        console.log(role)
        try {
            const result = await axios.put(`http://localhost:8080/admin/users/${id}`,{role},{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            getUsers()
            toast.success(result.data.message)
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        }
    }

  return (
    <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">ID</th>
          <th scope="col" className="px-6 py-3">Email / Username</th>
          <th scope="col" className="px-6 py-3">Role</th>
          <th scope="col" className="px-6 py-3 text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {
        users.length > 0 ?(
          users.map((item,index)=>{
            return(
              <tr
              key ={index} 
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index+1}</th>
              <td className="px-6 py-4">{item.email}{item.username}</td>
              <td className="px-6 py-4">
                <select
                onChange={(e)=>handleUpdate(e,item.id)} 
                defaultValue={item.role}>
                  <option>USER</option>
                  <option>ADMIN</option>
                </select>
              </td>
              <td className="px-6 py-4 text-right">
                <p onClick={()=>handleDelete(item.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</p>
              </td>
            </tr>
            )
          })
        ):(
          <tr>
            <td colSpan="4" className="px-6 py-4">No data</td>
          </tr>
        )
        }
      </tbody>
    </table>
  </div>
)
}
