import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks.js';
import projectRoutes from './routes/projects.js';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comments.js';
import historyRoutes from './routes/history.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Initialize default data
    await initializeDefaultData();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Initialize default data
const initializeDefaultData = async () => {
  const User = mongoose.model('User');
  const Project = mongoose.model('Project');
  
  // Check if users exist
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    await User.insertMany([
      { username: 'admin', password: 'admin' },
      { username: 'user1', password: 'user1' },
      { username: 'user2', password: 'user2' }
    ]);
    console.log('Default users created');
  }
  
  // Check if projects exist
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      { name: 'Proyecto Demo', description: 'Proyecto de ejemplo' },
      { name: 'Proyecto Alpha', description: 'Proyecto importante' },
      { name: 'Proyecto Beta', description: 'Proyecto secundario' }
    ]);
    console.log('Default projects created');
  }
};

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
