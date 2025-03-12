const jwt = require('jsonwebtoken')
const UserAuth = require('../model/AuthModel')

const requireAuth = async (req, res, next) =>{
    const { authorization } = req.headers

if(!authorization) {
    return res.status(401).json({error: 'Authentication Required'})
}

const token = authorization.split(' ')[1]

try{
    const {id} = jwt.verify(token, 'recipe')
    req.user = await UserAuth.findOne({_id: id}).select('name email')//select just name and email from the document with that id
    next();
} catch (error){
    console.log(error)
    res.status(401).json({error: 'Request is not authorized'}) 
}
}


module.exports = {requireAuth}