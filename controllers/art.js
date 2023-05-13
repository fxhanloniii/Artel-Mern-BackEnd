const express = require('express');
const router = express.Router();
const Post = require('../models/post');
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
            error: err.message,
        });
    }
});

module.exports = router;