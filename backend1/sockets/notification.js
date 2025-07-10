const Notification = require('../models/Notification');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Listen for join event to join user-specific room
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    // Listen for new notification event
    socket.on('notify', async ({ userId, type, message, post, fromUser }) => {
      // Save notification to DB
      const notification = new Notification({ user: userId, type, message, post, fromUser });
      await notification.save();
      // Emit to user room
      io.to(userId).emit('notification', notification);
    });

    socket.on('disconnect', () => {});
  });
}; 