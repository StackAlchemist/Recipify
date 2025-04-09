import db from "../connections/database";

 const TABLE = 'likes'
export const getRecipes = async ()=>{
    try{
        const recipes = await db.withSchema('public').select('*').from('recipes')
        return recipes;
    }catch(err){
        console.log(err)
    }
}

export const getIndRecipe = async (id: number)=>{
    try{
        const recipe = await db.withSchema('public').select('*').from('recipes').where('id', id).first();
        const ingredientsRaw = await db.withSchema('public').select('ingredient').from('ingredients').where('recipe_id', recipe.id);
        const ingredients = ingredientsRaw.map(row=>row.ingredient)
        return { recipe, ingredients };
        
    }catch(err){
        console.log(err)
    }
}



export const setRecipe = async (name: string, desc: string, ingredients: string[], imagePath: string | null, userId: string) => {
    try {
        const basicData = {
            name,
            description: desc,
            image_path: imagePath,
            user_id: userId,
            
        };

        console.log("Inserting recipe:", basicData);

        const [newRecipe] = await db.withSchema('public').insert(basicData).into('recipes').returning('*');
        const ingredientData = ingredients.map(ingredient => ({
            recipe_id: newRecipe.id,
            ingredient
        }));

        console.log("Inserted recipe:", newRecipe);

        await db.withSchema('public').insert(ingredientData).into('ingredients');
        console.log("Inserted ingredients:", ingredientData);

        const postData = {
            post_id: newRecipe.id,
            like_no: 9
        }

        await db.withSchema('public').insert(postData).into('likes')
        console.log("post data:", postData);
        return newRecipe;

    } catch (error) {
        console.error("Error inserting recipe:", error); 
        throw error; // Rethrow the error for further handling
    }
}

export const showInterest = async (postId: string, userId: number, isLiked: boolean)=>{
   
    const likeData = {
        post_id: postId,
        user_id: userId
    }

    const query = db(TABLE).withSchema('public');
    const existingLike = await query.where(likeData).first();

    if(existingLike){
        await query.where(likeData).del()
        return{liked: false, message: 'unliked successfully'}
    }else{
        await query.insert(likeData)
        return {liked: true, message: 'liked successfully'}
    }
    
}

export const getLikes = async (postId: number, userId: number) => {
    const query = db('likes').withSchema('public');
  
    try {
      // Get the total number of likes for the post
      const likesCountResult = await query.where('post_id', postId).count('* as count');
      const likesCount = Number(likesCountResult[0].count);
  
      // Check if the user has liked this post
      const isLikedByUser = await query
        .where('post_id', postId)
        .andWhere('user_id', userId)
        .first();
  
      return { likesCount, isLikedByUser: isLikedByUser !== undefined };
    } catch (error) {
      console.error('Error fetching post likes:', error);
      return { likesCount: 0, isLikedByUser: false }; // Default in case of error
    }
  };


  export const getUserLikedPosts = async (userId: number) => {
    const query = db('recipes').withSchema('public');
  
    try {
      const result = await query
        .where('user_id', userId) // Filter by user_id
        .select('*');       // Select post_id only
  
      // Return the post_ids that the user has liked
      return result;
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      return [];
    }
  }
  
  export const getAnalytics = async (userId: number) => {
    try {
    
      const posts = await db('likes')
        .withSchema('public')
        .select('post_id') // Select post_id from likes table
        .join('recipes', 'likes.post_id', '=', 'recipes.id') // Join the likes table with the recipe table
        .where('recipes.user_id', userId) // Filter posts created by the user
        .groupBy('post_id') // Group by post_id to count the likes per post
        .count('* as likes_count') // Count how many likes each post has received
        .orderBy('likes_count', 'desc') // Order by the number of likes in descending order
        .limit(3); // Limit to the top 3 posts with the most likes
  
      // Step 2: Get the details of the top 3 posts from the recipe table
      const postDetails = await db('recipes')
        .withSchema('public')
        .select('*')
        .whereIn('id', posts.map(post => post.post_id)); // Get details for the top 3 posts
  
      return postDetails; // Return the post details of the top 3 liked posts
    } catch (error) {
      console.error('Error fetching top 3 liked posts for user:', error);
      return []; // Return an empty array in case of an error
    }
  };
  
  
