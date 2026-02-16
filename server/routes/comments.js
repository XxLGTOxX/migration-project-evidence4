import express from 'express';
import Comment from '../models/Comment.js';

const router = express.Router();

// Get all comments (optionally filtered by taskId)
router.get('/', async (req, res) => {
  try {
    const { taskId } = req.query;
    const query = taskId ? { taskId } : {};
    const comments = await Comment.find(query)
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    
    const formattedComments = comments.map(comment => ({
      id: comment._id.toString(),
      taskId: comment.taskId.toString(),
      userId: comment.userId ? comment.userId._id.toString() : 0,
      commentText: comment.commentText,
      createdAt: comment.createdAt
    }));
    
    res.json(formattedComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create comment
router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json({ id: comment._id.toString() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
