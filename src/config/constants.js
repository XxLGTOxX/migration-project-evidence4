// Constantes de la aplicación

export const TASK_STATUSES = [
  'Pendiente',
  'En Progreso',
  'Completada',
  'Bloqueada',
  'Cancelada'
];

export const TASK_PRIORITIES = [
  'Baja',
  'Media',
  'Alta',
  'Crítica'
];

export const DEFAULT_USER = {
  username: 'admin',
  password: 'admin'
};

export const STORAGE_KEYS = {
  USERS: 'users',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  COMMENTS: 'comments',
  HISTORY: 'history',
  NOTIFICATIONS: 'notifications',
  NEXT_TASK_ID: 'nextTaskId',
  NEXT_PROJECT_ID: 'nextProjectId'
};

export const DEFAULT_PROJECTS = [
  { id: 1, name: 'Proyecto Demo', description: 'Proyecto de ejemplo' },
  { id: 2, name: 'Proyecto Alpha', description: 'Proyecto importante' },
  { id: 3, name: 'Proyecto Beta', description: 'Proyecto secundario' }
];

export const DEFAULT_USERS = [
  { id: 1, username: 'admin', password: 'admin' },
  { id: 2, username: 'user1', password: 'user1' },
  { id: 3, username: 'user2', password: 'user2' }
];
