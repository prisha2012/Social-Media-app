const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostById, deletePost, likePost, unlikePost } = require('../controllers/postController');
const auth = require('../middleware/auth');

router.post('/', auth, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/unlike', auth, unlikePost);

module.exports = router; 