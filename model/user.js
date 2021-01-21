const mongoose = require('mongoose')
const schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new schema({
    username: String,
    email: String,
    password: String,
    canTorrent: { type: Number, default: 0 }
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)

module.exports = User