const express = require('express');
const router = express.Router();
const { addComment, getCommentsByPost } = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/:postId', auth, addComment);
router.get('/:postId', getCommentsByPost);

module.exports = router; 