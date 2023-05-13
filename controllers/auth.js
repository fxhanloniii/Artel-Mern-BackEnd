const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const router = express.Router();
const { createUserToken } = require('../middleware/auth');



// Sign Up
// Post /api/register
router.post('/signup', async (req, res, next) => {

    try {
        let { email, password, username } = req.body;
        console.log(req.body);
        let salt = await bcrypt.genSalt(10);
        let passwordHash = await bcrypt.hash(password, salt);
        const pwStore = password
        password = passwordHash;
        let newUser = await User.create({
            email,
            password,
            username,
        });
        if (newUser) {
            password = pwStore;
            const authenticatedUserToken = createUserToken(req, newUser);
            res.status(201).json({
                currentUser: newUser,
                isLoggedIn: true,
                token: authenticatedUserToken
            });
        } else {
            res.status(400).json({error: 'Something went wrong'})
        }
        
    } catch (err) {
        res.status(400).json({ err: err.message})
    }
})

// Sign In
// Post /api/login
router.post('/login', async (req, res, next) => {
    try {
        const loggingUser = req.body.username;
        const foundUser = await User.findOne({ username: loggingUser });
        const token = await createUserToken(req, foundUser);
        res.status(200).json({
            user: foundUser,
            isLoggedIn: true,
            token,
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    };
});


module.exports = router;