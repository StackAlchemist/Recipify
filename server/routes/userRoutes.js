const express = require('express')
const { fetchUsers, postRecipes, getFeed, get_details, deleteRecipe, likePost, getLikes, editRecipes, searchRecipe, getLikedRecipes, analytics } = require('../controllers/userController.js')
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
route.post('/upload', requireAuth, upload.single('image'), postRecipes)
route.get('/getFeed', getFeed)
route.get('/getIndFood/:id', get_details)
route.put('/like/:id', likePost)
route.get('/like/:id', getLikes)
route.get('/liked-recipes', requireAuth, getLikedRecipes)
route.delete('/:userId/getIndFood/:id', deleteRecipe)
route.put('/getIndFood/:id',requireAuth, editRecipes)//requireAuth added offline, check if it works
route.get('/analytics/:userId', analytics)

module.exports = route