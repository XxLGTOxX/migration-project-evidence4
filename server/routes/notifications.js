import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get all notifications (optionally filtered by userId and read status)
router.get('/', async (req, res) => {
  try {
    const { userId, read } = req.query;
    const query = {};
    if (userId) query.userId = userId;
    if (read !== undefined) query.read = read === 'true';
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 });
    
    const formattedNotifications = notifications.map(notif => ({
      id: notif._id.toString(),
      userId: notif.userId.toString(),
      message: notif.message,
      type: notif.type,
      read: notif.read,
      createdAt: notif.createdAt
    }));
    
    res.json(formattedNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create notification
router.post('/', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({ id: notification._id.toString() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark notifications as read
router.put('/mark-read/:userId', async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, read: false },
      { read: true }
    );
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
