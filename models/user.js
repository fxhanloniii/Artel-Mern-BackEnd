const mongoose = require('mongoose');
require('../config/connection');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Hey you have to enter an email"],
        unique: [true, "You already have an account with that email address"]
    }, 
    password: {
        type: String,
        required: [true, "You have to enter a password"]
    }, 
    username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: [true, "That username already exists"]
    }, 
}, 
{
    timestamps: true,
    toJSON: {
        virtuals: true,
        // ret is the returned Mongoose document
        transform: (_doc, ret) => {
          delete ret.password;
          return ret;
        },
    },
});

const User = mongoose.model('user', userSchema);

module.exports = User;