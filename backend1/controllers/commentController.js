const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = new Comment({ post: req.params.postId, author: req.user.id, content });
    await comment.save();
    // Add comment to post
    await Post.findByIdAndUpdate(req.params.postId, { $push: { comments: comment._id } });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username avatar').sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 