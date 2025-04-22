const UserAuth = require("../model/AuthModel");
const Recipe = require("../model/userModel");

const searchRecipe = async (req, res) => {
  
  try {
    const query = req.query.q;
    if(!query){
      return res.status(400).json({error: 'search query required'})
    }

    const results = await Recipe.find({name: {$regex: query, $options: "i"}})
    
    if (!results.length) {
      return res.status(404).json({ error: "No recipes found" });
  }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const postRecipes = async (req, res) => {
  console.log(req.file);
  const { name } = req.user;

  try {
    const recipe = await Recipe.create({
      name: req.body.name,
      desc: req.body.desc,
      ingredients: req.body.ingredients,
       userId: req.body.userId,
      imagePath: req.file ? "/uploads/" + req.file.filename : null,
      creator: name
    });
    res.status(201).json({ message: "recipe successfully created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

const getFeed = async (req, res) => {
  try {
    const recipe = await Recipe.find();
    res.status(200).json(recipe);
    // console.log(recipe)
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

const get_details = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  

  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) return res.status(404).send("recipe not found");
    const isOwned = recipe.userId === userId;
    
    res.status(200).json({recipe, isOwned});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const deleteRecipe = async (req, res) => {//check this when online
  const { id, userId } = req.params;
  // const userId = req.user

  try {
    const recipe = await Recipe.findById(id)
    if(!recipe){
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: You can't delete this recipe" });
    }
    
    await Recipe.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  const { id } = req.params;
  const { userId, isLiked } = req.body;

  console.log("Received userId:", userId); // Debugging

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const recipe = await Recipe.findById(id);  // Fix: Use findById instead of findByIdAndUpdate
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if (isLiked) {
      if (!recipe.likes.includes(userId)) {
        recipe.likes.push(userId);
      }
    } else {
      recipe.likes = recipe.likes.filter((uid) => uid !==userId);
    }

    await recipe.save(); // Fix: Save the document after modification
    res.status(200).json({ likes: recipe.likes.length });
  } catch (err) {
    console.error("Error updating likes:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; 

    
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    
    const likedByUser = userId ? recipe.likes.includes(userId) : false;

    res.status(200).json({
      likesCount: recipe.likes.length,  
      likedByUser,                     
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getLikedRecipes = async (req, res) => {
  try {
    const {userId} = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    // Find all recipes where the userId exists in the likes array
    const likedRecipes = await Recipe.find({ likes: { $in: [userId] } });
    
    if (likedRecipes.length === 0) {
      return res.status(404).json({ message: 'No liked recipes found' });
    }

    res.status(200).json({ likedRecipes });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

const editRecipes = async (req, res) => {//check this when online
  try {
    const { id } = req.params;
    const userId = req.user._id.toString()
    console.log(userId)
    const foundRecipe = await Recipe.findById({_id: id})
    if (foundRecipe.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized: You can't edit this recipe" });
    }

    const recipe = await Recipe.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        desc: req.body.desc,
        ingredients: req.body.ingredients,
      },
      { new: true }
    );
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "book updated", recipe });
  } catch (err) {
    console.error(err);
  }
};

const analytics = async (req, res)=>{
  const {userId} = req.params;
  try {
    const topRecipe = await Recipe.find({userId})
    .sort({likes: -1})
    .limit(3);

    if(!topRecipe)return res.status(404).json({message: 'user recipe not found'})
      res.status(200).json({analysis: topRecipe})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'server error'})
  }
}

module.exports = {
  searchRecipe,
  postRecipes,
  getFeed,
  get_details,
  deleteRecipe,
  likePost,
  getLikes,
  editRecipes,
  getLikedRecipes,
  analytics
};
