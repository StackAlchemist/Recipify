const Recipe = require("../model/userModel")

const fetchUsers = async (req, res) => {
    console.log('req made')
    try {
        res.json({'users': ['userOne', 'UserTwo', 'userThree']})
        console.log('hello world')
    } catch(err) {
        console.error(err)
    }
}

const postRecipes = async(req, res)=>{
    console.log(req.file)

    try{
        const recipe = await Recipe.create({
            name: req.body.name,
            desc: req.body.desc,
            ingredients: req.body.ingredients,
            imagePath: req.file ? '/uploads/' + req.file.filename : null
        })
        res.status(201).json({message: 'recipe successfully created'})
    }catch(err){
        res.status(500).json({message: err.message})
        console.error(err)
    }
}

const getFeed = async (req, res)=>{
    try {
        const recipe = await Recipe.find()
        res.status(200).json(recipe)
        // console.log(recipe)
    } catch (err) {
        res.status(500).json({message: err.message})
        console.error(err)
    }
}

const get_details = async (req, res)=>{
    const {id} = req.params
    try{
        const recipe = await Recipe.findById(id)
        if(!recipe)return res.status(404).send('recipe not found')
            res.status(200).json(recipe)
    }catch(err){
        console.error(err)
        res.status(500).json({message: err.message})
    }
}

const deleteRecipe = async(req, res)=>{
    const {id} = req.params
    try{
        const recipe = await Recipe.findByIdAndDelete(id)
        if(!recipe)return res.status(404).send('Recipe not found')
            res.status(200).json({message: 'Deleted successfully!'})
    }catch(err){
        console.error(err)
        res.status(500).json({message: err.message})
    }
}

const likePost = async(req, res)=>{
    const {id} = req.params
    const {isLiked} = req.body
    try{
        const recipe = await Recipe.findByIdAndUpdate(id)
        if(!recipe)return res.status(404).send('Recipe doesn`t exist ')
            

        recipe.likes = isLiked ? recipe.likes +=1 : Math.max(recipe.likes-1, 0)
        recipe.save()
        res.status(200).json({likes: recipe.likes})
    }catch(err){
        console.error(err)
        res.status(500).json({message: err.message})
    }
}

const getLikes = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the recipe by ID
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
  
      res.json({
        likes: recipe.likes || 0, // Return number of likes
      });
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({ message: "Server error" });
    }
  }


module.exports = { fetchUsers, postRecipes, getFeed, get_details, deleteRecipe, likePost, getLikes}