import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Recipe = ({ image, name, desc, itemId }) => {
  const navigate = useNavigate();

  const handleRouting = () => {
    navigate(`/recipe/${itemId}`);
  };

  const [isLiked, setIsLiked] = useState(false);
  const [likeNo, setLikeNo] = useState(0);

  const authToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userID");

  const fetchLikes = async () => {
    if (!itemId || !userId) {
      console.warn("No itemId or userId provided, skipping fetchLikes.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:4000/likes/${itemId}`, {
        params: { userId },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const likesCount = res.data.likesCount || 0;
      const likedByUser = res.data.likedByUser;

      setLikeNo(likesCount);
      setIsLiked(likedByUser);
    } catch (err) {
      console.error("Error fetching likes:", err);
    }
  };

  const likeRecipe = async () => {
    if (!userId) {
      toast.error("User not logged in!");
      return;
    }
  
    try {
      const res = await axios.put(
        `http://localhost:4000/like/${itemId}`,
        {
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // const likesCount = res.data.likesCount || 0;
const likedByUser = res.data.liked;

// setLikeNo(likesCount);
setIsLiked(likedByUser);     // Update the like count
  
      toast.success(likedByUser ? "Liked!" : "Unliked!");
    } catch (err) {
      console.error("Error toggling like:", err);
      toast.error("Couldn't update like");
    }
  };
  

  const toggleLike = (e) => {
    e.stopPropagation();
    likeRecipe();
  };

  useEffect(() => {
    if (itemId && userId) {
      fetchLikes();
    }
  }, [isLiked, userId]); // Only fetch likes when itemId or userId changes

  return (
    <div className="p-4" onClick={handleRouting}>
      <div className="relative overflow-hidden rounded-2xl shadow-lg group">
        {/* Recipe Image */}
        <img
          className="w-full h-80 object-cover rounded-2xl transition-transform duration-300 ease-in-out group-hover:scale-110"
          src={`../../server2${image}`}
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
              className="bg-white p-3 rounded-full shadow-md transition-all duration-300 hover:bg-gray-200 hover:scale-110 active:scale-90"
            >
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
