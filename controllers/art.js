const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const { handleValidateOwnership, requireToken } = require('../middleware/auth');

router.post('/post', requireToken, async(req, res, next) => {
    try {
        const owner = req.user._id
        const { caption, image } = req.body;
        const newPost = await Post.create({
            user: owner,
            caption,
            image,
        });
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(postId)
        const post = await Post.findById(postId);
        const user = await User.findById(post.user)
        if (!post) {
            return res.status(404).json({ error: 'Post not found'});
        }
        console.log(post)
        console.log(user.username)
        res.json({post, username: user.username});
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
});

module.exports = router;