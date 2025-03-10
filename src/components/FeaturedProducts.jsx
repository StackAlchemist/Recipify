import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import Recipe from './Recipe'
import axios from 'axios'
import { Filter } from 'lucide-react'

const FeaturedProducts = () => {

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
    <div className='flex flex-col justify-center mt-20'>
      <div className=' flex items-center justify-center mb-20'>
        <Heading text1={'FEATURED'} text2={'PRODUCTS'}/>
        </div>

      <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
      {feedData.slice(0, 6).map((data, index) => (
      <Recipe key={index} image={data.imagePath} name={data.name} desc={data.desc} itemId={data._id} />
    ))}
      </div>
    </div>
  )
}

export default FeaturedProducts
