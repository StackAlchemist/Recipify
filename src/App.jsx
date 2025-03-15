import React from 'react'
import Hero from './components/Hero'
import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import UploadPG from './pages/Upload'
import { ToastContainer } from 'react-toastify'
import RecipeView from './pages/RecipeView'
import EditingView from './pages/EditingView'
import { AppContextProvider } from './context/AppContext'
import LikedPosts from './pages/LikedPosts'


const App = () => {
  return (
    <AppContextProvider>
    <div className=''>
      <ToastContainer position='top-center' hideProgressBar/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/feed' element={<Feed />}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/upload' element={<UploadPG/>}/>
        <Route path='/recipe/:id' element={<RecipeView/>}/>
        <Route path='/edit/:id' element={<EditingView/>} />
        <Route path='/liked-post' element={<LikedPosts/>} />
      </Routes>
    </div>
    </AppContextProvider>
  )
}

export default App
