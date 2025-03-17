import React, { useEffect, useState } from "react";
import { images } from "../assets/assets";
import { Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Recipe = ({ image, name, desc, itemId }) => {
  const navigate = useNavigate();

  const handleRouting = () => {
    navigate(`/recipe/${itemId}`);
  };

  const [isLiked, setIsLiked] = useState(false);
  const [likeNo, setLikeNo] = useState(0)
  

  const fetchLikes = async () => {
    if (!itemId) {
      console.warn("No itemId provided, skipping fetchLikes.");
      return;
    }
  
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.warn("No authToken found in localStorage.");
     
    }

    const userId = localStorage.getItem('userID')
  
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/like/${itemId}`, {
        params: {userId: userId},
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const likesCount = res.data.likesCount || 0;
      const likedByUser = res.data.likedByUser;
      console.log(res.data)
  
      
      setLikeNo(likesCount);
      setIsLiked(likedByUser);
    } catch (err) {
      console.error("Error fetching likes:", err);
    }
  };
  
  


  const likeRecipe = async ()=>{
    try{    
      const userID = localStorage.getItem('userID')
      console.log(userID)


      if (!userID) {
        toast.error("User not logged in!");
        return;
      }


      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/like/${itemId}`, {
        isLiked: !isLiked,//send the req body as opposite of whatever our current state
        userId: userID 
      }, {
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      setLikeNo(res.data.likes)
      setIsLiked(!isLiked)

      
      console.log(res.data.likes)
      if(!isLiked){
        toast.success('Liked!')
      }else{
        toast.success('UnLiked!')
      }
    }catch(err){
      setIsLiked(false)
      console.error(err)
      toast.error("Couldn't like post")
    }
  }

  const toggleLike = (e) => {
    e.stopPropagation()
    likeRecipe()
  };

  useEffect(()=>{
    fetchLikes()
  }, [isLiked, likeNo])
  // console.log(`${image}`)
  return (
    <div className="p-4" onClick={handleRouting}>
      <div className="relative overflow-hidden rounded-2xl shadow-lg group">
        {/* Recipe Image */}
        <img
          className="w-full h-80 object-cover rounded-2xl transition-transform duration-300 ease-in-out group-hover:scale-110"
          src={`../../server${image}`}
          alt="recipe image"
        />

        {/* Overlay Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 flex justify-between items-center text-white">
          {/* Recipe Title and Description */}
          <div>
            <h1 className="text-2xl font-semibold">{name}</h1>
            <p className="text-sm text-gray-300">{desc}</p>
          </div>

          {/* Favorite Button */}
          <div className="flex flex-col justify-center items-center">

         
          <button
            onClick={toggleLike}
            className="bg-white p-3 rounded-full shadow-md transition-all duration-300 
             hover:bg-gray-200 hover:scale-110 active:scale-90">
            {isLiked ? (
              <FaHeart className="text-red-500 transition-all duration-300" />
            ) : (
              <FaRegHeart className="text-gray-500 transition-all duration-300" />
            )}
            
          </button>
          <p className="text-white">{likeNo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
