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
        if(!userId && !authToken){
            toast.error('you need to be logged in')
            navigate('/login')
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/liked-recipes`,{
            params: {userId},
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })

        setData(response.data.likedRecipes)
    }

    useEffect(()=>{
        fetchLikedPosts()
        
    },[data])

 
  return (
    <div>
        <div className='pl-4 mt-6'>
        <Heading text1={'Your'} text2={'liked posts'}/>
        </div>
        <div>
            {
                data?.map((recipe, index)=>(
                    <Recipe key={index} image={recipe.imagePath} name={recipe.name} desc={recipe.desc} itemId={recipe._id} likes={recipe.likes}/>
                ))
            }
        </div>
        
      
    </div>
  )
}

export default LikedPosts
