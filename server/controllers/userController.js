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

  try {
    const recipe = await Recipe.create({
      name: req.body.name,
      desc: req.body.desc,
      ingredients: req.body.ingredients,
      imagePath: req.file ? "/uploads/" + req.file.filename : null,
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
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).send("recipe not found");
    res.status(200).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) return res.status(404).send("Recipe not found");
    res.status(200).json({ message: "Deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const likePost = async (req, res) => {

  const { id } = req.params;
  const { userId, isLiked } = req.body;
  try {
    const recipe = await Recipe.findByIdAndUpdate(id);
    if (!recipe) return res.status(404).send("Recipe doesn`t exist ");

    if(isLiked){
      if(!recipe.likes.includes(userId)){
        recipe.likes.push(userId)
      }
    } else{
      recipe.likes = recipe.likes.filter((id)=> id !== userId)
    }
    await recipe.save();
    res.status(200).json({ likes: recipe.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getLikes = async (req, res) => {
  try {
    const { id } = req.params;
    // const userId = req.user.id

    // Find the recipe by ID
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

      // Extract user ID from token if available
      const userId = req.user ? req.user.id : null;
      const likedByUser = userId ? recipe.likes.includes(userId) : false;

    res.status(200).json({
      likesCount: recipe.likes.length,  // Number of likes
      likedByUser               // is it liked by the logged in user?
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const editRecipes = async (req, res) => {
  try {
    const { id } = req.params;
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

module.exports = {
  searchRecipe,
  postRecipes,
  getFeed,
  get_details,
  deleteRecipe,
  likePost,
  getLikes,
  editRecipes,
};
