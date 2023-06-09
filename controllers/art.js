const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const { handleValidateOwnership, requireToken } = require('../middleware/auth');

// Recent Posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ _id: -1 }).limit(20);
        res.json(posts)
        
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
})

// New Post Route
router.post('/', requireToken, async(req, res) => {
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
        const post = await Post.findById(postId);
        const user = await User.findById(post.user)
        if (!post) {
            return res.status(404).json({ error: 'Post not found'});
        }
        const commentIds = post.comments
        const comments = await Comment.find({ _id: { $in: commentIds } })
        const commentInfo = [];
        for (const comment of comments) {
            const commenter = await User.findById(comment.user)
            commentInfo.push({
                id: comment._id,
                username: commenter.username,
                text: comment.text,
                createdAt: comment.createdAt
            });
        };
        res.json({post, username: user.username, comments: commentInfo});
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
});



// Comments Routes
// Comment Post Route
router.post('/:id/comment', requireToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const owner = req.user._id;
        const commentText = req.body.text;
        // Create Comment and associate it with the post
        const comment = await Comment.create({
            post: postId,
            user: owner,
            text: commentText,
        });
        // Add Comment ID to the Post Document
        await Post.findByIdAndUpdate(postId, {
            $push: { comments: comment._id },
        }),

        res.status(201).json(comment)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id/comment/:commentId', requireToken, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user._id
        const postId = req.params.id

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment Not Found'})
        }
        if (comment.user.toString() !== userId.toString()) {
            return res.status(401).json({ error: 'Unauthorized'})
        }

        await Comment.findByIdAndDelete(commentId);

        await Post.findByIdAndUpdate(postId, {
            $pull: { comments: commentId }
        });
        res.json({ message: 'Comment Deleted Successfully'})
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

router.post('/:id/like', requireToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const post = await Post.findById(postId);

        // Check if user liked the post already

        const userLiked = post.likes.includes(userId);

        if (userLiked) {
            await Post.findByIdAndUpdate(postId, {
                $pull: { likes: userId }
            });
            const updatedPost = await Post.findById(postId)
            res.json(updatedPost)
        } else {
            // User hasn't liked the post
            await Post.findByIdAndUpdate(postId, {
                $push: { likes: userId },
            })
            const updatedPost = await Post.findById(postId)
            res.json(updatedPost)
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

})



module.exports = router;