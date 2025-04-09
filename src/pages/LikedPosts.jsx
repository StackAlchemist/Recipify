import React, { useEffect, useState } from 'react'
import Heading from '../components/Heading'
import Recipe from '../components/Recipe'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

const LikedPosts = () => {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const fetchLikedPosts = async ()=>{
        const userId = localStorage.getItem('userID')
        const authToken = localStorage.getItem('authToken')

        if (!userId || !authToken) {
            toast.error('You need to be logged in')
            navigate('/login')
            return; // Ensure we exit the function if not logged in
        }
        const response = await axios.get(`http://localhost:4000/user/${userId}`,{
            // params: {userId},
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        console.log(response.data)
        setData(response.data.likedPosts)
    }

    useEffect(()=>{
        fetchLikedPosts()
        
    },[])

 
  return (
    <div>
        <div className='pl-4 mt-6'>
        <Heading text1={'Your'} text2={'liked posts'}/>
        </div>
        <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
            {
                data.map((recipe, index)=>(
                    <Recipe key={index} image={recipe.image_path} name={recipe.name} desc={recipe.description} itemId={recipe.id} likes={recipe.likes}/>
                ))
            }
        </div>
        
      
    </div>
  )
}

export default LikedPosts
