import express ,{ Express, Request, Response } from "express";
import { getAnalytics, getIndRecipe, getLikes, getRecipes, getUserLikedPosts, setRecipe, showInterest } from "./services/recipeService";
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from "body-parser";
import upload from "./middlewares/multer";
import { signUp } from "./services/auth";
import requireAuth from "./middlewares/authMiddleware";
import jwt from "jsonwebtoken";
dotenv.config()


const server: Express = express()
server.use(express.json())
// server.use(bodyParser.json())
server.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
server.listen(4000,()=>{
    console.log('server listening on post 4000')
})


server.get('/recipes', async(req: Request, res: Response)=>{
    try {
        const recipes = await getRecipes()
        res.json(recipes)
        // console.log('recipes:', recipes)
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

server.post('/upload',upload.single('image'), async(req: Request, res: Response)=>{
    try {
        console.log('req body',req.body)
        // const {file} = req.file;
        const imagePath: string | null = req.file ? "/uploads/" + req.file.filename : null;
        const { name, desc, ingredients, userId } = req.body;
        await setRecipe(name, desc, ingredients, imagePath, userId);
        res.status(201).json('Recipe created');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the recipe.' });
    }
})

server.post('/signup', async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;

        const newUser = await signUp(name, email, password); // Ensure it returns { user_id, ... }
        console.log(newUser);
        
        const token = jwt.sign(
            { id: newUser.user_id }, // Ensure newUser has user_id
            process.env.JWT_SECRET || 'recipe',
            { expiresIn: '3d' }
        );

        // Send response with user ID and token
        res.status(201).json({ message: 'User created', userId: newUser.user_id, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating user' });
    }
});


server.get('/whoami',requireAuth, async (req: Request, res: Response) =>{
    try {
        console.log(req.user)
        res.json(req.user)
    } catch (error) {
        console.log(error)
    }
})
  
server.put('/like/:postId', requireAuth, async(req: Request, res: Response)=>{
    try {
        const {postId} = req.params;
    const {userId, isLiked} = req.body;
    const result = await showInterest(postId, userId, isLiked)
    console.log(`Post ID: ${postId}, User ID: ${userId}, Is Liked: ${isLiked}`);
    console.log(result)
    return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
    
})

server.get('/user/:userId/liked-posts', requireAuth, async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    const numericUserId = Number(userId);
  
    
    try {
      const likedPosts = await getUserLikedPosts(numericUserId);
  
      if (likedPosts.length === 0) {
        return res.status(404).json({ message: 'No liked posts found for this user' });
      }
  
      res.status(200).json({ likedPosts }); // Respond with array of post IDs
    } catch (error) {
      console.error('Error fetching user liked posts:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  

server.get('/likes/:postId', requireAuth, async (req: Request, res: Response) => {
    const postId = Number(req.params.postId);
    const userId = Number(req.query.userId);
  
    if (isNaN(postId) || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid postId or userId' });
    }
  
    try {
      const { likesCount, isLikedByUser } = await getLikes(postId, userId);
  
      res.json({
        likesCount,
        likedByUser: isLikedByUser,
      });
    } catch (error) {
      console.error('Error fetching post likes:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  

server.get('/user/analytics/:userId', async (req: Request, res: Response)=>{
     try {
        const userId =  Number(req.params.userId)
        const result = await getAnalytics(userId)

        res.status(200).json({analysis: result})
     } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong while fetching' });
     }
})