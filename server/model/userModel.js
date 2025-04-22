const { default: mongoose } = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    imagePath : {
        type: String,
        required: true
    },
    likes: {
        type: [String],
        default: []
    },
    userId: {
        type: String,
        required: false
    },
    creator: {
        type: String,
        required: true
    }
},{timestamps: true})

const Recipe = mongoose.model('Recipe', RecipeSchema)
module.exports = Recipe;    