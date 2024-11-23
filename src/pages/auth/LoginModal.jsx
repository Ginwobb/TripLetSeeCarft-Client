import React, { useState } from 'react'
import { toast } from 'react-toastify'
import RegisterModal from './RegisterModal'
import useUserStore from '../../stores/userStore'
import { useNavigate } from 'react-router-dom'
import { loginSchema } from '../../utils/authValidator'

const LoginModal = () => {
    const login = useUserStore(state => state.login)
  const [input, setInput] = useState({
    identity: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const handleChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const {error} = loginSchema.validate(input,{abortEarly:false})
    if(error){
      const errorMessages = {};
      error.details.forEach((err) => {
        errorMessages[err.path[0]] = err.message;
      })
      setErrors(errorMessages)
      return
    }
    try {
        const data = await login(input)
        localStorage.setItem('token', data.data.token)
      document.getElementById('login_modal').close()
      console.log(data.data.user.role)
      if (data.data.user.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/')
      }
      toast.success('Login Success')
    } catch (err) {
      const errMsg = err?.response?.data?.error || err.message;
      console.log(errMsg)
      toast.error(errMsg)
    }
  };

  return (
    <>
    <dialog id="login_modal" className="modal">
      <div className="modal-box bg-white shadow-lg rounded-lg">
        <form method="dialog">
          <button 
          onClick={() => document.getElementById('login_modal').close()}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col space-y-4 py-4">
            <input
              type="text"
              placeholder="Email or Username"
              className="input input-bordered"
              name="identity"
              value={input.identity}
              onChange={handleChange}
            />
            {errors.identity && <p className="text-red-500">{errors.identity}</p>}
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered"
              name="password"
              value={input.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
            <button className="btn btn-primary">Login</button>
          </div>
        </form>
        <p className="text-center">
          Don't have an account?{' '}
          <button
            className="text-yellow-500 underline"
            onClick={() => {
              document.getElementById('login_modal').close() 
              document.getElementById('register_modal').showModal()
            }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </dialog>
        <RegisterModal />
  </>  
  )
}

export default LoginModal
