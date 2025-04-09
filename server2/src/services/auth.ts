import db from '../connections/database'
import bcrypt from 'bcrypt'
import {isEmail} from 'validator'
import jwt from 'jsonwebtoken'

export const signUp = async(name:string, email: string, password: string)=>{
    
    if (!isEmail(email)) {
        throw new Error('Invalid email format');
      }

    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    
    const [newUser] = await db.withSchema('public').insert({
        username: name,
        email: email,
        password: hash
      }).into('users').returning(['user_id','username','email'])
          
    return newUser;
}