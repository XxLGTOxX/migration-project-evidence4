import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATED', 'UPDATED', 'DELETED', 'STATUS_CHANGED', 'TITLE_CHANGED']
  },
  oldValue: {
    type: String,
    default: ''
  },
  newValue: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('History', historySchema);
