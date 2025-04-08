import db from "../connections/database";


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



export const setRecipe = async (name: string, desc: string, ingredients: string[]) => {
    try {
        const basicData = {
            name,
            description: desc,
            image_path: 'dummy/img/path.jpg',
            user_id: 'user_123'
        };

        console.log("Inserting recipe:", basicData);

        const [newRecipe] = await db.withSchema('public').insert(basicData).into('recipes').returning('*');
        const ingredientData = ingredients.map(ingredient => ({
            recipe_id: newRecipe.id,
            ingredients
        }));

        console.log("Inserted recipe:", newRecipe);

        await db.withSchema('public').insert(ingredientData).into('ingredients');
        console.log("Inserted ingredients:", ingredientData);

        return newRecipe;

    } catch (error) {
        console.error("Error inserting recipe:", error); 
        throw error; // Rethrow the error for further handling
    }
}
