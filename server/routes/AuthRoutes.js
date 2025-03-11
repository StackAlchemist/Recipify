const express = require('express')
const { signUp, checkUser } = require('../controllers/AuthController')
const { requireAuth } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/signup', signUp)
router.get('/whoami',requireAuth ,checkUser)//add reuireAuth

module.exports = router