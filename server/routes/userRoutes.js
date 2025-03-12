const express = require('express')
const { fetchUsers, postRecipes, getFeed, get_details, deleteRecipe, likePost, unLikePost, getLikes, editRecipes, searchRecipe } = require('../controllers/userController.js')
const multer = require('multer')
const path = require('path')
const { requireAuth } = require('../middlewares/authMiddleware.js')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))//setting the filename to it's original name
    }
})
const upload = multer( {storage: storage} )

const route = express.Router()

route.get('/search', searchRecipe)
route.post('/upload',upload.single('image'), postRecipes)
route.get('/getFeed', getFeed)
route.get('/getIndFood/:id', get_details)
route.put('/like/:id', likePost)
route.get('/like/:id', getLikes)
route.delete('/getIndFood/:id', deleteRecipe)
route.put('/getIndFood/:id', editRecipes)

module.exports = route