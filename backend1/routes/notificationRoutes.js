const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.get('/', auth, getNotifications);
router.post('/read/:id', auth, markAsRead);

module.exports = router; 