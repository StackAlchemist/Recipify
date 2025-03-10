import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Recipe from '../components/Recipe';
import { ClipLoader, HashLoader } from 'react-spinners';
import Heading from '../components/Heading';

const Feed = () => {

  const [feedData, setFeedData] = useState([])
  const [loading, setLoading] = useState(false);

  const fetchAPI = async ()=>{
    try{    
      setLoading(true);
      const response =await axios.get(`${import.meta.env.VITE_GET_FEED}`)
      setFeedData(response.data)
      console.log(response.data);
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
<div>
  <div className='flex items-center justify-center my-10'>
    <Heading text1={'Your'} text2={'Feed'}/>
  </div>
{loading ? (
  <div className="flex justify-center items-center h-screen w-full">
    <ClipLoader color="#50C878" size={45}/>
  </div>
) : (
  <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
    {feedData.map((data, index) => (
      <Recipe key={index} image={data.imagePath} name={data.name} desc={data.desc} itemId={data._id} likes={data.likes}/>
    ))}
  </div>
)}

</div>
  )
}

export default Feed
