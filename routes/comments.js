const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');

// get the full list of comments
router.get('/:_postId', async (req, res) => {
    try {
        const { _postId } = req.params;
        if (!_postId) {
            return res.status(400).json({ message: "Invalid Input" });
        }
        const comments = await Comment.find({ postId: _postId }).sort({ createdAt: -1 });
        let commentList = [];
        for (comment of comments) {
            const temp = {
                commentId: comment._id.toString(),
                user: comment.user,
                content: comment.content,
                createdAt: comment.createdAt
            }
            commentList.push(temp);
        }
        return res.status(200).json({ data: commentList });
    }
    catch (err) {
        console.log(`${err} has occurred`);
        return res.status(400).json({ message: "Cannot find the post" });
    }
});

// post one comment
router.post('/:_postId', async (req, res) => {
    const { _postId } = req.params;
    const { user, password, content } = req.body;
    if (!_postId || !user || !password) {
        return res.status(400).json({ message: "Invalid input" });
    }
    else if (!content) {
        return res.status(400).json( { message: "Enter the content" });
    }
    
    const temp = {
        user: user,
        password: password,
        content: content,
        createdAt: new Date(),
        postId: _postId
    }
    
    await Comment.create(temp); 
    return res.status(200).json({ message: "Successfully created a comment" });
})

// modify one comment
router.put('/:_commentId', async (req, res) => {
    try {
        const { _commentId } = req.params;
        const { password, content } = req.body;
        if (!_commentId || !password) {
            return res.status(400).json({ message: "Invalid Input" });
        }
        else if (!content) {
            return res.status(400).json({ message: "Enter the content"});
        }

        const targetComment = await Comment.findOne({ _id: _commentId });
        
        if (password === targetComment.password) {
            await Comment.updateOne({ _id: _commentId },
                { $set:
                    {
                        content: content
                    }
                })
        }
        return res.status(200).json({ message: "Comment has been modified" });
    }
    catch (err) {
        console.log(`${err} has occurred`);
        return res.status(404).json({ message: "Cannot find the comment" });
    }
});

// delete a comment
router.delete('/:_commentId', async (req, res) => {
    try {
        const { _commentId } = req.params;
        const { password } = req.body;
        console.log(_commentId);
        console.log(password);
        if (!_commentId || !password) {
            return res.status(400).json({ message: "Invalid Input" });
        }

        const targetComment = await Comment.findOne({ _id: _commentId });
        console.log(targetComment);
        if (password === targetComment.password) {
            await Comment.deleteOne({ _id: _commentId });
            return res.status(200).json({ message: "Comment has been deleted" });
        }
        return res.status(400).json({ message: "Incorrect Password" });
        
    }
    catch (err) {
        console.log(`${err} has occurred`);
        return res.status(404).json({ message: "Cannot find the comment" });
    }
});

module.exports = router;