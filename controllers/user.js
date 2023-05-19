const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const { handleValidateOwnership, requireToken } = require('../middleware/auth');



// API EndPoint For Sending User Info Back
router.get('', requireToken, async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        res.json(user)
    } catch (err) {
        return res.status(404).json({ error: 'User not found'});
    }
});

// Get User Profile
router.get('/profile/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username });
        console.log(user)
        if (!user) {
            return res.status(404).json({ error: 'User not found'});
        }
        const userPosts = await Post.find({ user: user._id });
        console.log(userPosts)
        res.json({user, posts: userPosts})
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;