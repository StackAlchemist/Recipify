import React, { useContext, useEffect, useState } from "react";
import { CloudUpload, Plus, X } from "lucide-react";
import { images } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router";

const UploadPG = () => {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const [file, setFile] = useState(null);
  const [inputs, setInputs] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [recipe, setRecipe] = useState({
    name:'',
    desc: '',
    ingredients: [''],
    image: null,
  })

useEffect(()=>{
  if(!user){
    toast.warning('Login first to upload')
    navigate('/login')
  }
},[user, navigate])

  const handleChange= (e)=>{
    setRecipe({...recipe, [e.target.name]: e.target.value})
  }

  const previewImg = (e) => {
    setFile(URL.createObjectURL(e.target.files[0]));
    setRecipe({...recipe, image: e.target.files[0]})//spread recipe and add image
  };

  const removeImage = () => {
    setFile(null);
    setRecipe({...recipe, image: null})
  };

  const addNewRecipe = () => {
    setRecipe({...recipe, ingredients: [...recipe.ingredients, ""]}); // Add a new input FOR INGREDIENT and add nothing to it//making and empty input vor ingredient
  };

  const handleIngredientChange = (index, value)=>{
    const updatedIngredients = [...recipe.ingredients]
    updatedIngredients[index] = value
    setRecipe({...recipe, ingredients: updatedIngredients})
  }

  // console.log(recipe)

  const handleUpload = async(e)=>{
    e.preventDefault()
    const formData =  new FormData()
    formData.append('name', recipe.name)
    formData.append('desc', recipe.desc)
    formData.append('image', recipe.image)
    recipe.ingredients.forEach((ingredient, index)=>{
      formData.append(`ingredients[${index}]`, ingredient)
    })

    try{
      setIsLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData,
        {headers: {'Content-Type':'multipart/form-data'}}
      )
      console.log(response.data)
      setIsLoading(false)
      toast.success('Recipe Successfully Uploaded!')
    }catch(err){
      setIsLoading(false)
      console.error("Error uploading:", err.response ? err.response.data : err.message);
      toast.error("Error,refill and try again");
    }
  }
  

  return (
    <div className="flex items-center justify-center">
      <form className="w-full max-w-md bg-white/40 shadow-lg rounded-xl mt-20 py-10 px-6 flex flex-col" onSubmit={handleUpload}>
        
        {/* Image Upload Section */}
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-emerald-500">
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-48 gap-2 cursor-pointer">
              <img src={images.upload_illustration} className="w-40 h-40 text-gray-500" />
              <span className="text-gray-500">Click or drag to upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={previewImg} />
            </label>
          ) : (
            <div className="relative w-full">
              <img src={file} alt="Uploaded Preview" className="w-full h-48 object-cover rounded-lg" />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
                onClick={removeImage}
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Input Fields */}
        <div className="mt-4 w-full">
          <input
            className="w-full p-2 border-gray-300 border rounded-lg mb-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            type="text"
            name="name"
            placeholder="Food Name"
            value = {recipe.name}
            onChange={handleChange}
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            rows="3"
            name='desc'
            placeholder="Description"
            value={recipe.desc}
            onChange={handleChange}
          ></textarea>

          {/* Add Recipe Button */}
          <div className="flex justify-between items-center mt-5">
            <p className="text-emerald-500">Add Recipe</p>
            <button
              type="button"
              onClick={addNewRecipe}
              className="bg-cyan-100 shadow-xl rounded-full p-3 hover:bg-cyan-200"
            >
              <Plus color="#10B981" />
            </button>
          </div>

          {/* Dynamically Added Inputs */} 
          <div className="mt-4 w-full space-y-2">
            {recipe.ingredients.map((_m, index) => (
              <input
                key={index}
                type="text"
                name={`ingredient-${index}`}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={`Recipe ${index + 1}`}
                value={recipe.ingredients[index]}
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
  );
};

export default UploadPG;
