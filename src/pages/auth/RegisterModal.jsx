import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import useUserStore from '../../stores/userStore'
import { registerSchema } from '../../utils/authValidator'

const RegisterModal = () => {
    const register = useUserStore(state=>state.register)
  const [input, setInput] = useState({
    firstName: '',
    lastName: '',
    identity: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    const {error} = registerSchema.validate(input,{abortEarly:false})
    if(error){
      const errorMessages = {};
      error.details.forEach((err) => {
        errorMessages[err.path[0]] = err.message;
      })
      setErrors(errorMessages)
      return 
    }
    try {
      const data = await register(input)
      setInput({
        firstName: '',
        lastName: '',
        identity: '',
        password: '',
        confirmPassword: '',
      });
      document.getElementById('register_modal').close()
      document.getElementById('login_modal').showModal()
      toast.success('Register Success')
    } catch (err) {
      const errMsg = err?.response?.data?.error || err.message
      toast.error(errMsg)
    }
  }

  return (
    <>
    <dialog id="register_modal" className="modal">
      <div className="modal-box bg-white shadow-lg rounded-lg">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Sign Up</h3>
        <form onSubmit={handleRegister}>
          <div className="flex flex-col space-y-4 py-4">
            <input
              type="text"
              placeholder="First Name"
              className="input input-bordered"
              name="firstName"
              value={input.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className='text-red-500'>{errors.firstName}</p>}
            <input
              type="text"
              placeholder="Last Name"
              className="input input-bordered"
              name="lastName"
              value={input.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className='text-red-500'>{errors.lastName}</p>}
            <input
              type="text"
              placeholder="Email or Username"
              className="input input-bordered"
              name="identity"
              value={input.identity}
              onChange={handleChange}
            />
            {errors.identity && <p className='text-red-500'>{errors.identity}</p>}
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered"
              name="password"
              value={input.password}
              onChange={handleChange}
            />
            {errors.password && <p className='text-red-500'>{errors.password}</p>}
            <input
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered"
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword}</p>}
            <button className="btn btn-primary">Sign Up</button>
          </div>
        </form>
        <p className="text-center">
            Already have an account?{' '}
            <button
              className="text-yellow-500 underline"
              onClick={() => {
                document.getElementById('register_modal').close()
                document.getElementById('login_modal').showModal()
              }}
            >
              Login
            </button>
          </p>
      </div>
    </dialog>

</>
  )
}

export default RegisterModal
