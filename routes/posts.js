const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { uploadFile } = require('../s3');

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body)
  try {
    if (!newPost.img) {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost)
    } else {
      await uploadFile(req);
      newPost.img = `images/${newPost.postKey}`
      const savedPost = await newPost.save();
      res.status(200).json(savedPost)
    }
  } catch (err) {
    res.status(500).json(err)
  }
})
//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body })
      res.status(200).json('Post has been updated')
    } else {
      res.status(403).json('You can update only your post')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})
//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    console.log(req.body.userId);
    if (post.userId === req.body.userId) {
      await post.deleteOne({ $set: req.body })
      res.status(200).json('Your post has been deleted')
    } else {
      res.status(403).json('You can update only your post')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

//like / dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json('Post has been liked')
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } })
      res.status(200).json('Post has been disliked')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})
//get a post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err)
  }
})

//get timeline posts
router.get('/timeline/:userId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const followedPosts = await Promise.all(
      currentUser.followings.map(followedId => {
        return Post.find({ userId: followedId })
      })
    )
    const posts = userPosts.concat(...followedPosts);
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json(err);
  }
})

//get users all posts
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;
