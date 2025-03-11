const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt')

const UserAUTHSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter your name to proceed'],
    },
    email: {
        type: String,
        required: [true, 'Please Enter an Email to proceed'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid Email']
    },
    password: {
        type: String,
        required: [true, 'Please Enter an password to proceed'],
        minlength: [6, 'Password must not be less than 6']
    }
})

UserAUTHSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
    next()
})

UserAUTHSchema.post('save', async function (doc, next) {
    console.log('user created', doc)
    next()
})


UserAUTHSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email})
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error('Wrong Credentials')
    } throw Error('User does not exist')    
}


const UserAuth = mongoose.model('users', UserAUTHSchema);
module.exports = UserAuth;