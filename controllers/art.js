const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const { handleValidateOwnership, requireToken } = require('../middleware/auth');


// New Post Route
router.post('', requireToken, async(req, res) => {
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
// Edit Route
router.put('/:id', requireToken, async (req, res) => {
    try {
        const postId = req.params.id;
        let updatedPost = req.body;
        

        const post = await Post.findById(postId);
        console.log(post)
        if (!post) {
            return res.status(404).json({ error: 'Post not found'});
        }
        handleValidateOwnership(req, post);

        updatedPost = await Post.findByIdAndUpdate(postId, updatedPost, { new: true });

        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete Route
router.delete('/:id', requireToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found'});
        }

        handleValidateOwnership(req, post);

        await Post.findByIdAndDelete(postId);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Post Show Page
router.get('/:id', async (req, res) => {
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

// Trending Route
router.get('/trending', async (req, res) => {
    try {
        const trendingPosts = await Post.find().sort({ likes: -1 }).limit(20);

        res.json(trendingPosts);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Tags Route
router.get('/tags/:tag', async (req, res) => {
    try {
        const tag = req.params.tag;
        const posts = await Post.find({ tags: tag });
        res.json(posts);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Comments Routes

router.post('/:id/comment', requireToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const owner = req.user._id;
        const commentText = req.body;

        // Create Comment and associate it with the post
        const comment = await Comment.create({
            post: postId,
            user: owner,
            text: commentText,
        });

        res.status(201).json(comment)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



module.exports = router;