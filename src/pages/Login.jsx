import axios from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'

const Login = () => {

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email:'',
    password:''
  })

  const [isEyeOpen, setIsEyeOpen] = useState(false)

  const auth = async()=>{
    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData, {
        withCredentials: true,
      })
      console.log('Login successful', response.data)
      toast.success('Welcome back')
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userID', response.data.user)
      navigate('/')
      window.location.reload()
    } catch (error) {
      console.error(error)
      if (error.response) {
        const errorMessage = error.response.data.error || "Login failed";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("Server is not responding. Check your internet connection.");
      } else {
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
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Log In</h2>
        <form 
        onSubmit={handleSubmit} 
        className="mt-6 space-y-4">
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
                isEyeOpen? <Eye className='text-emerald-600'/> : <EyeOff className='text-gray-600'/>
              }
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition duration-300"
          >
            {isLoading? (

<ClipLoader className="flex items-center justify-center" color="#ffffff" size={25}/>
            ): 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account? 
          <Link to="/signup" className="text-emerald-600 font-medium hover:underline"> Signup</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
