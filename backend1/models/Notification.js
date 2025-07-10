const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['comment', 'like', 'follow'], required: true },
  message:   { type: String, required: true },
  isRead:    { type: Boolean, default: false },
  post:      { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  fromUser:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
