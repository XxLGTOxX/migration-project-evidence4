// Servicio de almacenamiento con MongoDB API
import API_BASE_URL from '../config/api.js';

const api = {
  async get(url) {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async post(url, data) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async put(url, data) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async delete(url, data = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};

export const Storage = {
  // Inicializar datos (el backend lo hace automáticamente)
  async init() {
    try {
      // Verificar que la API esté funcionando
      await api.get('/health');
      return true;
    } catch (error) {
      console.error('Error connecting to API:', error);
      // Fallback a localStorage si la API no está disponible
      return false;
    }
  },

  // Usuarios
  async getUsers() {
    try {
      return await api.get('/users');
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Login
  async login(username, password) {
    try {
      const user = await api.post('/users/login', { username, password });
      return user;
    } catch (error) {
      throw new Error('Credenciales inválidas');
    }
  },

  // Proyectos
  async getProjects() {
    try {
      return await api.get('/projects');
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async addProject(project) {
    try {
      const result = await api.post('/projects', project);
      return result.id;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  },

  async updateProject(id, project) {
    try {
      await api.put(`/projects/${id}`, project);
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      return false;
    }
  },

  async deleteProject(id) {
    try {
      await api.delete(`/projects/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  },

  // Tareas
  async getTasks() {
    try {
      return await api.get('/tasks');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  async addTask(task) {
    try {
      const result = await api.post('/tasks', task);
      return result.id;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  async updateTask(id, task) {
    try {
      await api.put(`/tasks/${id}`, task);
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  },

  async deleteTask(id, userId) {
    try {
      await api.delete(`/tasks/${id}`, { userId });
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },

  // Comentarios
  async getComments(taskId = null) {
    try {
      const url = taskId ? `/comments?taskId=${taskId}` : '/comments';
      return await api.get(url);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  async addComment(comment) {
    try {
      await api.post('/comments', comment);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Historial
  async getHistory(taskId = null) {
    try {
      const url = taskId ? `/history?taskId=${taskId}` : '/history';
      return await api.get(url);
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  },

  async addHistory(entry) {
    try {
      await api.post('/history', entry);
    } catch (error) {
      console.error('Error adding history:', error);
      throw error;
    }
  },

  // Notificaciones
  async getNotifications(userId = null, read = null) {
    try {
      let url = '/notifications';
      const params = [];
      if (userId) params.push(`userId=${userId}`);
      if (read !== null) params.push(`read=${read}`);
      if (params.length > 0) url += '?' + params.join('&');
      return await api.get(url);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  async addNotification(notification) {
    try {
      await api.post('/notifications', notification);
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  },

  async markNotificationsRead(userId) {
    try {
      await api.put(`/notifications/mark-read/${userId}`);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  },
};
