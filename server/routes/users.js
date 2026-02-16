import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      username: user.username
    }));
    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login (authenticate user)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
      id: user._id.toString(),
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user._id.toString(),
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
