const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const { handleValidateOwnership, requireToken } = require('../middleware/auth');

// Get User Profile
router.get('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found'});
        }
        res.json(user)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;