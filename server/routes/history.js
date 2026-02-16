import express from 'express';
import History from '../models/History.js';

const router = express.Router();

// Get all history (optionally filtered by taskId)
router.get('/', async (req, res) => {
  try {
    const { taskId } = req.query;
    const query = taskId ? { taskId } : {};
    const history = await History.find(query)
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    
    const formattedHistory = history.map(entry => ({
      id: entry._id.toString(),
      taskId: entry.taskId.toString(),
      userId: entry.userId ? entry.userId._id.toString() : 0,
      action: entry.action,
      oldValue: entry.oldValue,
      newValue: entry.newValue,
      timestamp: entry.createdAt
    }));
    
    res.json(formattedHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create history entry
router.post('/', async (req, res) => {
  try {
    const history = new History(req.body);
    await history.save();
    res.status(201).json({ id: history._id.toString() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
