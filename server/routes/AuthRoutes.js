const express = require('express')
const { signUp, checkUser, login, logout } = require('../controllers/AuthController')
const { requireAuth } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.post('/logout', logout)
router.get('/whoami',requireAuth ,checkUser)//add reuireAuth

module.exports = router