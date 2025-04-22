import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Recipe from '../components/Recipe';
import { ClipLoader, HashLoader } from 'react-spinners';
import Heading from '../components/Heading';
import SearchBar from '../components/SearchBar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const Feed = () => {

  const [feedData, setFeedData] = useState([])
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const userId  = localStorage.getItem('userID')
  const navigate = useNavigate()
  
  if(!userId){
    toast.warn('cannot access this page, login')
    navigate('/login')
  }

  const fetchAPI = async ()=>{
    try{    
      setLoading(true);
      const response =await axios.get(`${import.meta.env.VITE_GET_FEED}`)
      setFeedData(response.data.reverse())
      // console.log(response.data);
    }catch(err){
      console.error(err)
    } finally{
      setLoading(false);
    }

    
  }

  useEffect(()=>{
    fetchAPI()
  },[])

  return (
<div className=''>
  

  <div className='flex flex-col gap-3 items-center justify-center my-10'>
    <Heading text1={'Your'} text2={'Feed'}/>
    <SearchBar setLoading={setLoading} setSearchData={setSearchData}/>
  </div>
{loading ? (
  <div className="flex justify-center items-center h-screen w-full">
    <ClipLoader color="#50C878" size={45}/>
  </div>
) : (
  <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
    {searchData.length > 0 ? searchData.map((data, index) => (
      <Recipe key={index} image={data.imagePath} name={data.name} creator={data.creator} desc={data.desc} itemId={data._id} likes={data.likes}/>
    )): feedData.map((data, index) => (
      <Recipe key={index} image={data.imagePath} name={data.name} creator={data.creator} desc={data.desc} itemId={data._id} likes={data.likes}/>
    ))}
  </div>
)}

</div>
  )
}

export default Feed
