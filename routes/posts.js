const express = require("express");
const Post = require("../schemas/post");
const router = express.Router();

// Create a new post
router.post('/', async (req, res) => {
    const { user, password, title, content } = req.body;
    if (!user || !password || !title || !content) {
        res.status(400).json({ message: "Incorrect Data Format"});
    }

    const userDoc = {
        user,
        password,
        title,
        content,
        createdAt: new Date()
    }
    await Post.create(userDoc);

    res.status(200).json( {message: "Successfully Created a Post"} )
});

// Get the full lit of the posts
router.get("/", async (req, res) => {
  const posts = await Post.find({}).sort({date: -1});
  let result = [];
  for (post of posts) {
    const temp = {
        postId: post._id.toString(),
        user: post.user,
        title: post.title,
        createdAt: post.createdAt
    }
    result.push(temp);
  }
  
  res.status(200).json({
    data: result,
  });
});

// Get one post by postId params
router.get('/:_postId', async (req, res) => {
    try {
        const { _postId } = req.params;
        const targetPost = await Post.findOne({ _id: _postId });
        const temp = {
            postId: targetPost._id.toString(),
            user: targetPost.user,
            title: targetPost.title,
            content: targetPost.content,
            createdAt: targetPost.createdAt
        }
        return res
            .status(200)
            .json({ data: temp });
    }
    catch (err) {
        console.log(`${err} has occurred`);
        return res
            .status(400)
            .json({ message: "Incorrect Data Format"});
    }

});

// Modify one post
router.put('/:_postId', async (req, res) => {
    const { _postId } = req.params;
    const { password, title, content } = req.body;
    if (!_postId || !password || !title || !content) {
        return res.status(400).json({ message: "Invalid input"});
    }
    try {
        const targetPost = await Post.findOne({ _id: _postId });
        if (password === targetPost.password) {
            await Post.updateOne({ _id: _postId }, 
                { $set: 
                    { 
                        title: title,
                        content: content
                    }
                })
        }
        else {
            return res.status(200).json({ message: 'Incorrect Password Input'});
        }
        return res.status(200).json({ message: "Successfully updated the post" });
    }
    catch (err) {
        console.log(`${err} has occurred`);
        return res.status(404).json({ message: "Post Not Found" });
    }  
});

// Delete one post
router.delete('/:_postId', async (req, res) => {
    const { _postId } = req.params;
    const { password } = req.body;
    if (!_postId || !password) {
        return res.status(400).json({ message: "Invalid Input" });
    }
    try {
        const targetPost = await Post.findOne({ _id: _postId });
        if (password === targetPost.password) {
            await Post.deleteOne({ _id: _postId });
        }
        else {
            return res.status(200).json({ message: "Incorrect Password" });
        }
        return res.status(200).json({ message: "Successfully Deleted the post" })
    }
    catch (err) {
        console.log(`${err} has occurred`);
        return res.status(404).json({ message: "Post does not exist" });
    }
})

module.exports = router;