const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const { handleValidateOwnership, requireToken } = require('../middleware/auth');

// Get User Profile
router.get('/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username });
        console.log(user)
        if (!user) {
            return res.status(404).json({ error: 'User not found'});
        }
        res.json(user)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;