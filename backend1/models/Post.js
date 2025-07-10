const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:  { type: String, required: true },
  image:    { type: String }, // Optional image URL
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
