import axios from 'axios'
import { CloudUpload, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { IoCloudUploadSharp } from 'react-icons/io5'
import { useNavigate, useParams } from 'react-router'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
const EditingView = () => {

    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isContentLoading, setIsContentLoading] = useState(false)
    const [recipeData, setRecipeData] = useState({ name: "", desc: "", ingredients: [] })
    const navigate = useNavigate()

    const fetchRecipe = async()=>{

        try {
          setIsContentLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/getIndFood/${id}`)
            setRecipeData(response.data)
            console.log(response.data)
          
      } catch (error) {
          console.error(error)
      } finally{
        setIsContentLoading(false)
      }
      }

    const handleEdit = async(e)=>{
        e.preventDefault() 
    try {
       await axios.put(`${import.meta.env.VITE_API_URL}/api/getIndFood/${id}`, recipeData, {
        headers: {'Content-Type':'application/json'}
      })
      setIsLoading(true)
      toast.success('Edited Successfully')
      navigate(`/recipe/${id}`)
    } catch (error) {
        toast.error('Oops, you Can`t Edit!')
      console.error(error)
    }finally{
        setIsLoading(false)
    }
  }

  const handleChange = (e)=>{
    setRecipeData({...recipeData, [e.target.name]: e.target.value})
  }

  const handleIngredientChange = (index, value)=>{
    const updatedIngredients = [...recipeData.ingredients]
    updatedIngredients[index]= value
    setRecipeData({...recipeData, ingredients: updatedIngredients})
  }

  const addNewIngredient = () => {
    setRecipeData({ ...recipeData, ingredients: [...recipeData.ingredients, ""] });
  };


  useEffect(()=>{
    fetchRecipe()
  },[])



  return (
    
<div className="flex items-center justify-center">
    
      <form className="w-full max-w-md bg-white/40 shadow-lg rounded-xl mt-20 py-10 px-6 flex flex-col" 
        onSubmit={handleEdit}
      >
        <h2 className='font-semibold text-2xl'>{recipeData?.name}</h2>

        {/* Input Fields */}
        <div className="mt-4 w-full">
          <input
            className="w-full p-2 border-gray-300 border rounded-lg mb-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            type="text"
            name="name"
            placeholder="Food Name"
            value = {recipeData?.name}
            onChange={handleChange}
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            rows="3"
            name='desc'
            placeholder="Description"
            value={recipeData?.desc}
            onChange={handleChange}
          ></textarea>

          {/* Add Recipe Button */}
          <div className="flex justify-between items-center mt-5">
            <p className="text-emerald-500">Add Recipe</p>
            <button
              type="button"
              onClick={addNewIngredient}
              className="bg-cyan-100 shadow-xl rounded-full p-3 hover:bg-cyan-200"
            >
              <Plus color="#10B981" />
            </button>
          </div>

          {/* Dynamically Added Inputs */} 
          <div className="mt-4 w-full space-y-2">
            {recipeData?.ingredients.map((_m, index) => (
              <input
                key={index}
                type="text"
                name={`ingredient-${index}`}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={`Recipe ${index + 1}`}
                value={recipeData.ingredients[index]}
                onChange={(e)=>handleIngredientChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>
            <button type="submit" disabled={isLoading} className="flex items-center text-center justify-center bg-emerald-600 text-white rounded-lg py-3 mt-4">
            {isLoading ? <ClipLoader className="flex items-center justify-center" color="#ffffff" size={25}/> : (

              <>
              <p>Upload</p>
              <CloudUpload/>
              </>
            )}</button>
      </form>
    </div>
  )
}

export default EditingView
