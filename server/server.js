const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes.js');
const AuthRoutes = require('./routes/AuthRoutes.js')


const app = express();
dotenv.config();
const DB_URI = 'mongodb+srv://jolamideprince:olamide@recipecluster.vk5ti.mongodb.net/Recipe_API?retryWrites=true&w=majority&appName=recipeCluster'

mongoose.connect(DB_URI)
.then(()=>console.log('connected to DB!'))
.catch((err)=>console.log('error', err));

app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin:  process.env.FE_PORT || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}
app.use(cors(corsOptions))


app.use('/api', userRoutes)
app.use('/auth', AuthRoutes)

app.listen(5000, ()=>{
    console.log('server started on port 5000')
})

