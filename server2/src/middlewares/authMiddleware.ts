import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import db from '../connections/database'

declare module 'express' {
    interface Request {
        user?: any;
    }
}

const requireAuth = async (req: Request, res: Response, next: NextFunction)=>{
    const authorization = req.headers.authorization;

    if(!authorization) {
        return res.status(401).json({error: 'Authentication Required'})
    }

    const token: string = authorization.split(' ')[1]

    try{
        const decoded = jwt.verify(token, 'recipe') as JwtPayload

        const user = await db.withSchema('public').select('username').from('users').where('user_id', decoded.id).first();

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
          }
          
        req.user =  user
        next();
    } catch (error){
        console.log(error)
        res.status(401).json({error: 'Request is not authorized'}) 
    }
    
}

export default requireAuth