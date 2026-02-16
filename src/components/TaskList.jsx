import { useState, useEffect } from 'react';
import { Storage } from '../services/storage';
import TaskTable from './TaskTable';
import TaskForm from './TaskForm';
import TaskStats from './TaskStats';
import './TaskList.css';

export default function TaskList({ currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    // Inicializar storage y cargar datos
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      await Storage.init();
      await loadTasks();
      await loadProjects();
      await loadUsers();
    } catch (error) {
      console.error('Error initializing data:', error);
      alert('Error conectando con el servidor. Verifica que el backend esté corriendo.');
    }
  };

  const loadTasks = async () => {
    try {
      const tasksData = await Storage.getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const projectsData = await Storage.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await Storage.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const task = {
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'Pendiente',
        priority: taskData.priority || 'Media',
        projectId: taskData.projectId && taskData.projectId !== '0' ? taskData.projectId : null,
        assignedTo: taskData.assignedTo && taskData.assignedTo !== '0' ? taskData.assignedTo : null,
        dueDate: taskData.dueDate || '',
        estimatedHours: parseFloat(taskData.estimatedHours) || 0,
        actualHours: 0,
        createdBy: currentUser.id
      };

      const taskId = await Storage.addTask(task);
      await loadTasks();
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Error al agregar la tarea');
      return false;
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!selectedTaskId) {
      alert('Selecciona una tarea');
      return false;
    }

    try {
      const oldTask = tasks.find(t => t.id === selectedTaskId);
      if (!oldTask) return false;

      const task = {
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'Pendiente',
        priority: taskData.priority || 'Media',
        projectId: taskData.projectId && taskData.projectId !== '0' ? taskData.projectId : null,
        assignedTo: taskData.assignedTo && taskData.assignedTo !== '0' ? taskData.assignedTo : null,
        dueDate: taskData.dueDate || '',
        estimatedHours: parseFloat(taskData.estimatedHours) || 0,
        actualHours: oldTask.actualHours || 0,
        userId: currentUser.id
      };

      await Storage.updateTask(selectedTaskId, task);
      await loadTasks();
      setSelectedTaskId(null);
      setSelectedTask(null);
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error al actualizar la tarea');
      return false;
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTaskId) {
      alert('Selecciona una tarea');
      return;
    }

    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return;

    if (confirm('¿Eliminar tarea: ' + task.title + '?')) {
      try {
        await Storage.deleteTask(selectedTaskId, currentUser.id);
        await loadTasks();
        setSelectedTaskId(null);
        setSelectedTask(null);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error al eliminar la tarea');
      }
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

  const handleExportCSV = () => {
    const tasksData = Storage.getTasks();
    const projectsData = Storage.getProjects();
    const usersData = Storage.getUsers();
    
    // Encabezados del CSV
    let csv = 'ID,Título,Descripción,Estado,Prioridad,Proyecto,Asignado a,Fecha Vencimiento,Horas Estimadas\n';
    
    // Agregar cada tarea al CSV
    tasksData.forEach(task => {
      const project = projectsData.find(p => p.id === task.projectId);
      const user = usersData.find(u => u.id === task.assignedTo);
      
      // Escapar comillas y reemplazar saltos de línea
      const escapeCSV = (str) => {
        if (!str) return '';
        return String(str)
          .replace(/"/g, '""') // Escapar comillas dobles
          .replace(/\n/g, ' ') // Reemplazar saltos de línea
          .replace(/\r/g, ''); // Eliminar retornos de carro
      };
      
      csv += `${task.id},"${escapeCSV(task.title)}","${escapeCSV(task.description)}","${task.status || 'Pendiente'}","${task.priority || 'Media'}","${project ? project.name : 'Sin proyecto'}","${user ? user.username : 'Sin asignar'}","${task.dueDate || 'Sin fecha'}","${task.estimatedHours || 0}"\n`;
    });

    // Crear el blob y descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tareas_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert('✅ Archivo CSV exportado correctamente');
  };

  return (
    <div className="task-list-container">
      <div className="header-actions">
        <h2>Gestión de Tareas</h2>
        <button onClick={handleExportCSV} className="export-csv-btn" title="Exportar tareas a CSV">
          📥 Exportar CSV
        </button>
      </div>
      
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
