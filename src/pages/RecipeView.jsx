import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Heading from '../components/Heading'
import { ClipLoader } from 'react-spinners'
import { Edit, Trash } from 'lucide-react'
import { toast } from 'react-toastify'
import BackButton from '../components/BackButton'
import { AppContext } from '../context/AppContext'

const RecipeView = () => {
    const {id} = useParams()
    const {user} = useContext(AppContext)
    const [isLoading, setIsLoading] = useState(false)
    const [recipeData, setRecipeData] = useState(null)
    const navigate = useNavigate()
    const storedUser = localStorage.getItem('username')
    const userId = localStorage.getItem('userID')
    const [isOwned, setIsOwned] = useState(false)

    if(!storedUser){
      // toast.error('you need to login first')
      navigate('/login')
    }

    const fetchRecipe = async()=>{

      try {
        setIsLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/getIndFood/${id}`,{
        params: {userId: userId}
      })
          setRecipeData(response.data.recipe)
          setIsOwned(response.data.isOwned)
          console.log(response.data)
        
    } catch (error) {
        console.error(error)
    } finally{
      setIsLoading(false)
    }
    }

    const handleDelete = async () => {
      const userId = localStorage.getItem('userID');
      
      if (!userId) {
          toast.error('User not authenticated');
          return;
      }
  
      try {
          setIsLoading(true);
          await axios.delete(`${import.meta.env.VITE_API_URL}/api/${userId}/getIndFood/${id}`);
  
          toast.success('Deleted Successfully!');
          navigate('/feed');
      } catch (err) {
          console.error(err);
          toast.error('Error deleting');
      } finally {
          setIsLoading(false);
      }
  };
  


    useEffect(()=>{
      fetchRecipe()
    },[])
  return (<>
  <BackButton />
<div className="flex flex-col items-center justify-center p-4">
  {isLoading ? (
    <ClipLoader className='flex justify-center items-center' color="#50C878" size={45}/>
  ) : recipeData ? (
    <div className="flex flex-col sm:flex-row border border-gray-400 rounded-lg overflow-hidden shadow-md justify-between w-full max-w-3xl md:items-center items-start">
      {/* Recipe Text Section */}
      <div className="md:p-12 p-4 flex flex-col gap-2">
        <h2 className="font-space-grotesk text- font-bold text-3xl">{recipeData.name}</h2>
        <p className="text-gray-700">{recipeData.desc}</p>
      </div>

      {/* Recipe Image */}
      <img
        src={`../../server${recipeData.imagePath}`}
        alt={recipeData.name}
        className="w-full sm:w-1/2 h-auto object-cover"
      />
    </div>
  ) : (
    <p className="text-gray-500">No recipe found</p>
  )}

  {/* Ingredients List */}
  {recipeData?.ingredients?.length > 0 && (
    <div className="mt-6 flex flex-col gap-2 w-full max-w-3xl">
      <h3 className="text-xl font-semibold">Ingredients</h3>
      {recipeData.ingredients.map((ingredient, index) => (
        <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
          <Heading text1={index + 1} />
          <span className="text-gray-800">{ingredient}</span>
        </div>
      ))}

{isOwned ?<><button  onClick={()=>navigate(`/edit/${id}`)} className='bg-amber-300 mt-6 text-white flex  items-center py-3 rounded-lg justify-center w-full max-w-3xl'>
    <p className='font-bold text-lg'>Edit</p>
    <Edit color='white'/>
  </button>

<button  onClick={handleDelete} className='bg-red-500 mt-2 text-white flex  items-center py-3 rounded-lg justify-center w-full max-w-3xl'>
    <p className='font-bold text-lg'>Delete</p>
    <Trash color='white'/>
  </button>
  </>:''}
    </div>
  )}


</div>
</>
  )
}

export default RecipeView
