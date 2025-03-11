const dotenv = require('dotenv')
dotenv.config();
const UserAuth = require("../model/AuthModel");
const jwt = require('jsonwebtoken')

const maxAge = 3 * 24 * 60 * 60
const createToken =  (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET||'recipe', {
        expiresIn: maxAge
    })
}

const handleErrors = (err) => {
    let errors = { name: '', email: '', password: '' };

    // Duplicate email error
    if (err.code === 11000) {
        errors.email = 'Email already exists';
        return errors;
    }

    // Validation errors
    if (err.message.includes('UserAuth validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

module.exports.signUp = async (req, res)=>{
    try {
        const {name, email, password} = req.body
        const user = await UserAuth.create({name, email, password})
        const token = createToken(user._id)
        res.cookie('authToken', token, {httpOnly: true, maxAge: maxAge*1000})
        res.status(201).json({ user: user._id, token }); //pass token and user as json
    } catch (error) {
        console.error('Failed to create user:', error);
        const errors = handleErrors(error);
        
        if (error.code === 11000 || error.message.includes('UserAuth validation failed')) {
            return res.status(400).json({ errors }); // 400 for validation errors
        }
    
        res.status(500).json({ message: "Internal server error" }); // Keep 500 only for unexpected issues
    }
    
}

module.exports.checkUser = async (req, res)=>{
    try {
        res.json({user: req.user})
    } catch (error) {
        console.log(error)
    }
}

