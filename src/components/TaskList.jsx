import { useState, useEffect } from 'react';
import { Storage } from '../services/storage';
import TaskTable from './TaskTable';
import TaskForm from './TaskForm';
import TaskStats from './TaskStats';
import './TaskList.css';
import './TaskList.css';

export default function TaskList({ currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    // Inicializar storage y cargar datos
    Storage.init();
    loadTasks();
    loadProjects();
    loadUsers();
  }, []);

  const loadTasks = () => {
    const tasksData = Storage.getTasks();
    setTasks(tasksData);
  };

  const loadProjects = () => {
    const projectsData = Storage.getProjects();
    setProjects(projectsData);
  };

  const loadUsers = () => {
    const usersData = Storage.getUsers();
    setUsers(usersData);
  };

  const handleAddTask = (taskData) => {
    const task = {
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'Pendiente',
      priority: taskData.priority || 'Media',
      projectId: parseInt(taskData.projectId) || 0,
      assignedTo: parseInt(taskData.assignedTo) || 0,
      dueDate: taskData.dueDate || '',
      estimatedHours: parseFloat(taskData.estimatedHours) || 0,
      actualHours: 0,
      createdBy: currentUser.id
    };

    const taskId = Storage.addTask(task);
    
    Storage.addHistory({
      taskId: taskId,
      userId: currentUser.id,
      action: 'CREATED',
      oldValue: '',
      newValue: task.title
    });

    if (task.assignedTo > 0) {
      Storage.addNotification({
        userId: task.assignedTo,
        message: 'Nueva tarea asignada: ' + task.title,
        type: 'task_assigned'
      });
    }

    loadTasks();
    return true;
  };

  const handleUpdateTask = (taskData) => {
    if (!selectedTaskId) {
      alert('Selecciona una tarea');
      return false;
    }

    const oldTask = tasks.find(t => t.id === selectedTaskId);
    if (!oldTask) return false;

    const task = {
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'Pendiente',
      priority: taskData.priority || 'Media',
      projectId: parseInt(taskData.projectId) || 0,
      assignedTo: parseInt(taskData.assignedTo) || 0,
      dueDate: taskData.dueDate || '',
      estimatedHours: parseFloat(taskData.estimatedHours) || 0,
      actualHours: oldTask.actualHours || 0,
      createdBy: oldTask.createdBy,
      createdAt: oldTask.createdAt
    };

    if (oldTask.status !== task.status) {
      Storage.addHistory({
        taskId: selectedTaskId,
        userId: currentUser.id,
        action: 'STATUS_CHANGED',
        oldValue: oldTask.status,
        newValue: task.status
      });
    }

    if (oldTask.title !== task.title) {
      Storage.addHistory({
        taskId: selectedTaskId,
        userId: currentUser.id,
        action: 'TITLE_CHANGED',
        oldValue: oldTask.title,
        newValue: task.title
      });
    }

    Storage.updateTask(selectedTaskId, task);

    if (task.assignedTo > 0) {
      Storage.addNotification({
        userId: task.assignedTo,
        message: 'Tarea actualizada: ' + task.title,
        type: 'task_updated'
      });
    }

    loadTasks();
    setSelectedTaskId(null);
    setSelectedTask(null);
    return true;
  };

  const handleDeleteTask = () => {
    if (!selectedTaskId) {
      alert('Selecciona una tarea');
      return;
    }

    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return;

    if (confirm('¿Eliminar tarea: ' + task.title + '?')) {
      Storage.addHistory({
        taskId: selectedTaskId,
        userId: currentUser.id,
        action: 'DELETED',
        oldValue: task.title,
        newValue: ''
      });

      Storage.deleteTask(selectedTaskId);
      loadTasks();
      setSelectedTaskId(null);
      setSelectedTask(null);
    }
  };

  const handleSelectTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTaskId(taskId);
      setSelectedTask(task);
    }
  };

  const handleClearForm = () => {
    setSelectedTaskId(null);
    setSelectedTask(null);
  };

  return (
    <div className="task-list-container">
      <h2>Gestión de Tareas</h2>
      
      <div className="content-wrapper">
        <TaskForm
          task={selectedTask}
          projects={projects}
          users={users}
          onAdd={handleAddTask}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          onClear={handleClearForm}
        />

        <div className="right-column">
          <TaskTable
            tasks={tasks}
            projects={projects}
            users={users}
            onSelectTask={handleSelectTask}
          />

          <TaskStats tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
