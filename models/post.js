const mongoose = require('mongoose');
require('../config/connection');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
    }],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },  
    ],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;