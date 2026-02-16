import express from 'express';
import Task from '../models/Task.js';
import History from '../models/History.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('projectId', 'name')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    
    // Convert to format expected by frontend
    const formattedTasks = tasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      projectId: task.projectId ? task.projectId._id.toString() : 0,
      assignedTo: task.assignedTo ? task.assignedTo._id.toString() : 0,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
      createdBy: task.createdBy ? task.createdBy._id.toString() : 0,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));
    
    res.json(formattedTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId', 'name')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      projectId: task.projectId ? task.projectId._id.toString() : 0,
      assignedTo: task.assignedTo ? task.assignedTo._id.toString() : 0,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
      createdBy: task.createdBy ? task.createdBy._id.toString() : 0,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      projectId: req.body.projectId && req.body.projectId !== '0' ? req.body.projectId : null,
      assignedTo: req.body.assignedTo && req.body.assignedTo !== '0' ? req.body.assignedTo : null,
      createdBy: req.body.createdBy
    };
    
    const task = new Task(taskData);
    await task.save();
    
    // Create history entry
    await History.create({
      taskId: task._id,
      userId: task.createdBy,
      action: 'CREATED',
      oldValue: '',
      newValue: task.title
    });
    
    // Create notification if assigned
    if (task.assignedTo) {
      await Notification.create({
        userId: task.assignedTo,
        message: `Nueva tarea asignada: ${task.title}`,
        type: 'task_assigned'
      });
    }
    
    res.status(201).json({ id: task._id.toString() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const oldTask = await Task.findById(req.params.id);
    if (!oldTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updateData = {
      ...req.body,
      projectId: req.body.projectId && req.body.projectId !== '0' ? req.body.projectId : null,
      assignedTo: req.body.assignedTo && req.body.assignedTo !== '0' ? req.body.assignedTo : null
    };
    
    const task = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    // Create history entries for changes
    if (oldTask.status !== task.status) {
      await History.create({
        taskId: task._id,
        userId: req.body.userId || task.createdBy,
        action: 'STATUS_CHANGED',
        oldValue: oldTask.status,
        newValue: task.status
      });
    }
    
    if (oldTask.title !== task.title) {
      await History.create({
        taskId: task._id,
        userId: req.body.userId || task.createdBy,
        action: 'TITLE_CHANGED',
        oldValue: oldTask.title,
        newValue: task.title
      });
    }
    
    // Create notification if assigned
    if (task.assignedTo) {
      await Notification.create({
        userId: task.assignedTo,
        message: `Tarea actualizada: ${task.title}`,
        type: 'task_updated'
      });
    }
    
    res.json({ id: task._id.toString() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Create history entry
    await History.create({
      taskId: task._id,
      userId: req.body.userId || task.createdBy,
      action: 'DELETED',
      oldValue: task.title,
      newValue: ''
    });
    
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
