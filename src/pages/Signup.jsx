import axios from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'

const Signup = () => {

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name:'',
    email:'',
    password:''
  })

  const [isEyeOpen, setIsEyeOpen] = useState(false)

  const auth = async()=>{
    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, formData, {
        withCredentials: true,
      })
      console.log('Login successful', response.data)
      toast.success('Welcome')
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      navigate('/')
    } catch (error) {
      console.error(error)
      if (error.response) {
        // Backend responded with an error status (e.g., 400, 500)
        if (error.response.status === 400) {
          const errors = error.response.data.errors;
          toast.error(errors.email || errors.password || errors.name || "Signup failed");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Server is not responding. Check your internet connection.");
      } else {
        // Something else happened while setting up the request
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    auth()
  }

  return (
<div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Sign Up</h2>
        <form 
        onSubmit={handleSubmit} 
        className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-xl bg-gray-100 focus:border-emerald-600 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-xl bg-gray-100 focus:border-emerald-600 focus:ring-emerald-600"
            />
          </div>
          <div className='relative'>
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type={`${isEyeOpen ? 'text' : 'password'}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-xl bg-gray-100 focus:border-emerald-600 focus:ring-emerald-600"
            />
            <div className='absolute top-[35px] right-4' onClick={()=>setIsEyeOpen(!isEyeOpen)}>
              {
                isEyeOpen? <Eye className='text-emerald-600'/> : <EyeOff className='text-grey-600'/>
              }
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition duration-300"
          >
            {isLoading? (

<ClipLoader className="flex items-center justify-center" color="#ffffff" size={25}/>
            ): 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? 
          <Link to="/login" className="text-emerald-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
