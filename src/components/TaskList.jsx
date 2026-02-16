import { useState, useEffect, useMemo } from 'react';
import { Storage } from '../services/storage';
import TaskTable from './TaskTable';
import TaskForm from './TaskForm';
import TaskStats from './TaskStats';
import TaskDetailPanel from './TaskDetailPanel';
import TaskSearch from './TaskSearch';
import ReportGenerator from './ReportGenerator';
import NotificationsPanel from './NotificationsPanel';
import ProjectForm from './ProjectForm';
import ProjectTable from './ProjectTable';
import './TaskList.css';

const TAB_TAREAS = 'tareas';
const TAB_PROYECTOS = 'proyectos';
const TAB_NOTIFICACIONES = 'notificaciones';

export default function TaskList({ currentUser }) {
  const [activeTab, setActiveTab] = useState(TAB_TAREAS);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

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

  const handleAddProject = async (formData) => {
    try {
      await Storage.addProject({ name: formData.name.trim(), description: formData.description || '' });
      await loadProjects();
      return true;
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Error al agregar el proyecto');
      return false;
    }
  };

  const handleUpdateProject = async (formData) => {
    if (!selectedProject) return;
    try {
      await Storage.updateProject(selectedProject.id, {
        name: formData.name.trim(),
        description: formData.description || ''
      });
      await loadProjects();
      setSelectedProject(null);
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error al actualizar el proyecto');
      return false;
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    if (!confirm(`¿Eliminar proyecto "${selectedProject.name}"?`)) return;
    try {
      await Storage.deleteProject(selectedProject.id);
      await loadProjects();
      setSelectedProject(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar el proyecto');
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const handleClearProjectForm = () => {
    setSelectedProject(null);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const text = searchText.toLowerCase().trim();
      if (text) {
        const matchTitle = (task.title || '').toLowerCase().includes(text);
        const matchDesc = (task.description || '').toLowerCase().includes(text);
        if (!matchTitle && !matchDesc) return false;
      }
      if (statusFilter && (task.status || 'Pendiente') !== statusFilter) return false;
      if (priorityFilter && (task.priority || 'Media') !== priorityFilter) return false;
      if (projectFilter && task.projectId !== projectFilter) return false;
      return true;
    });
  }, [tasks, searchText, statusFilter, priorityFilter, projectFilter]);

  return (
    <div className="task-list-container">
      <div className="tabs-header">
        <button
          type="button"
          className={`tab-button ${activeTab === TAB_TAREAS ? 'active' : ''}`}
          onClick={() => setActiveTab(TAB_TAREAS)}
        >
          📋 Tareas
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === TAB_PROYECTOS ? 'active' : ''}`}
          onClick={() => setActiveTab(TAB_PROYECTOS)}
        >
          📁 Proyectos
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === TAB_NOTIFICACIONES ? 'active' : ''}`}
          onClick={() => setActiveTab(TAB_NOTIFICACIONES)}
        >
          🔔 Notificaciones
        </button>
      </div>

      {activeTab === TAB_TAREAS && (
        <>
          <div className="header-actions">
            <h2>Gestión de Tareas</h2>
            <ReportGenerator tasks={tasks} projects={projects} users={users} />
          </div>

          <TaskSearch
            searchText={searchText}
            setSearchText={setSearchText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            projectFilter={projectFilter}
            setProjectFilter={setProjectFilter}
            projects={projects}
          />

          <div className="content-wrapper content-wrapper-three">
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
                tasks={filteredTasks}
                projects={projects}
                users={users}
                onSelectTask={handleSelectTask}
              />
              <TaskStats tasks={filteredTasks} />
            </div>
            <TaskDetailPanel
              task={selectedTask}
              users={users}
              currentUser={currentUser}
              onCommentAdded={() => {}}
            />
          </div>
        </>
      )}

      {activeTab === TAB_PROYECTOS && (
        <>
          <div className="header-actions">
            <h2>Gestión de Proyectos</h2>
          </div>
          <div className="content-wrapper">
            <ProjectForm
              project={selectedProject}
              onAdd={handleAddProject}
              onUpdate={handleUpdateProject}
              onDelete={handleDeleteProject}
              onClear={handleClearProjectForm}
            />
            <div className="right-column">
              <ProjectTable projects={projects} onSelectProject={handleSelectProject} />
            </div>
          </div>
        </>
      )}

      {activeTab === TAB_NOTIFICACIONES && (
        <NotificationsPanel currentUser={currentUser} />
      )}
    </div>
  );
}
