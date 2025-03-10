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
        type: Number,
        required: true,
        default: 0
    }
},{timestamps: true})

const Recipe = mongoose.model('Recipe', RecipeSchema)
module.exports = Recipe;    