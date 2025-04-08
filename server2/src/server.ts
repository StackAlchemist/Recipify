import express ,{ Express, Request, Response } from "express";
import { getIndRecipe, getRecipes, setRecipe } from "./services/recipeService";
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from "body-parser";
dotenv.config()


const server: Express = express()
server.use(express.json())
// server.use(bodyParser.json())
server.use(cors())

server.listen(4000,()=>{
    console.log('server listening on post 4000')
})


server.get('/recipes', async(req: Request, res: Response)=>{
    try {
        const recipes = await getRecipes()
        res.json(recipes)
        console.log('recipes:', recipes)
    } catch (error) {
        console.log(error)
    }
})

server.get('/indierecipes/:id', async(req: Request, res: Response)=>{
    try {
        const { id } = req.params;
        const recipe = await getIndRecipe(Number(id));
        res.json(recipe);
        console.log('recipe:', recipe);
    } catch (error) {
        console.log(error)
    }
})

server.post('/upload', async(req: Request, res: Response)=>{
    try {
        console.log('req body',req.body)
        const { name, desc, ingredients } = req.body;
        await setRecipe(name, desc, ingredients);
        res.status(201).json('Recipe created');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the recipe.' });
    }
})

