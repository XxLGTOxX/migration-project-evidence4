// Servicio de almacenamiento con localStorage
export const Storage = {
  // Inicializar datos por defecto
  init() {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([
        { id: 1, username: 'admin', password: 'admin' },
        { id: 2, username: 'user1', password: 'user1' },
        { id: 3, username: 'user2', password: 'user2' }
      ]));
    }
    if (!localStorage.getItem('projects')) {
      localStorage.setItem('projects', JSON.stringify([
        { id: 1, name: 'Proyecto Demo', description: 'Proyecto de ejemplo' },
        { id: 2, name: 'Proyecto Alpha', description: 'Proyecto importante' },
        { id: 3, name: 'Proyecto Beta', description: 'Proyecto secundario' }
      ]));
    }
    if (!localStorage.getItem('tasks')) {
      localStorage.setItem('tasks', JSON.stringify([]));
    }
    if (!localStorage.getItem('comments')) {
      localStorage.setItem('comments', JSON.stringify([]));
    }
    if (!localStorage.getItem('history')) {
      localStorage.setItem('history', JSON.stringify([]));
    }
    if (!localStorage.getItem('notifications')) {
      localStorage.setItem('notifications', JSON.stringify([]));
    }
    if (!localStorage.getItem('nextTaskId')) {
      localStorage.setItem('nextTaskId', '1');
    }
    if (!localStorage.getItem('nextProjectId')) {
      localStorage.setItem('nextProjectId', '4');
    }
  },

  // Usuarios
  getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  },

  // Proyectos
  getProjects() {
    return JSON.parse(localStorage.getItem('projects') || '[]');
  },

  addProject(project) {
    const projects = this.getProjects();
    const id = parseInt(localStorage.getItem('nextProjectId') || '1');
    project.id = id;
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('nextProjectId', String(id + 1));
    return id;
  },

  updateProject(id, project) {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      project.id = id;
      projects[index] = project;
      localStorage.setItem('projects', JSON.stringify(projects));
      return true;
    }
    return false;
  },

  deleteProject(id) {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem('projects', JSON.stringify(filtered));
    return true;
  },

  // Tareas
  getTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  },

  addTask(task) {
    const tasks = this.getTasks();
    const id = parseInt(localStorage.getItem('nextTaskId') || '1');
    task.id = id;
    task.createdAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('nextTaskId', String(id + 1));
    return id;
  },

  updateTask(id, task) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      task.id = id;
      task.updatedAt = new Date().toISOString();
      tasks[index] = task;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return true;
    }
    return false;
  },

  deleteTask(id) {
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filtered));
    return true;
  },

  // Comentarios
  getComments() {
    return JSON.parse(localStorage.getItem('comments') || '[]');
  },

  addComment(comment) {
    const comments = this.getComments();
    comment.id = comments.length + 1;
    comment.createdAt = new Date().toISOString();
    comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(comments));
  },

  // Historial
  getHistory() {
    return JSON.parse(localStorage.getItem('history') || '[]');
  },

  addHistory(entry) {
    const history = this.getHistory();
    entry.id = history.length + 1;
    entry.timestamp = new Date().toISOString();
    history.push(entry);
    localStorage.setItem('history', JSON.stringify(history));
  },

  // Notificaciones
  getNotifications() {
    return JSON.parse(localStorage.getItem('notifications') || '[]');
  },

  addNotification(notification) {
    const notifications = this.getNotifications();
    notification.id = notifications.length + 1;
    notification.read = false;
    notification.createdAt = new Date().toISOString();
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
  },

  markNotificationsRead(userId) {
    const notifications = this.getNotifications();
    notifications.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
};
