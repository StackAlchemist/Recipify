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
            user_id: userId
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
  try {
    // Get the total number of likes for the post
    const likesCountResult = await db('likes')
      .withSchema('public')
      .where('post_id', postId)
      .count('* as count');
    const likesCount = Number(likesCountResult[0].count);

    // Check if the user has liked this post
    const isLikedByUser = await db('likes')
      .withSchema('public')
      .where({ post_id: postId, user_id: userId })
      .first();

    return {
      likesCount,
      isLikedByUser: isLikedByUser !== undefined,
    };
  } catch (error) {
    console.error('Error fetching post likes:', error);
    return {
      likesCount: 0,
      isLikedByUser: false,
    };
  }
};



export const getUserLikedPosts = async (userId: number) => {
  try {
    
    const likedPostRows = await db('likes')
      .withSchema('public')
      .where('user_id', userId)
      .select('post_id');

    const likedPostIds = likedPostRows.map((row) => row.post_id);

    if (likedPostIds.length === 0) {
      return []; 
    }

    
    const likedPosts = await db('recipes')
      .withSchema('public')
      .whereIn('id', likedPostIds)
      .select('*');

    return likedPosts;
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    return [];
  }
};

  
  export const getAnalytics = async (userId: number) => {
    let analyticsResult: object[] = []
    try {
    
      const posts = await db('recipes').withSchema('public').select('id', 'name', 'image_path').where('user_id', userId)
      posts.forEach(async({ id, name, image_path})=>{
        const filtered = (await db('likes').select('*').where('post_id', id)).length;
        console.log(filtered)
        const result = {
          id,
          name,
          image_path,
          filtered
        }

        analyticsResult.push(result);
    })

    console.log(analyticsResult)
    return analyticsResult;

    
      // console.log(posts)
       // Return the post details of the top 3 liked posts
    } catch (error) {
      console.error('Error fetching top 3 liked posts for user:', error);
      return []; // Return an empty array in case of an error
    }
  };
  
  
