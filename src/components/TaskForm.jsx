import { useState, useEffect } from 'react';
import './TaskForm.css';

export default function TaskForm({ task, projects, users, onAdd, onUpdate, onDelete, onClear }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pendiente',
    priority: 'Media',
    projectId: '0',
    assignedTo: '0',
    dueDate: '',
    estimatedHours: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pendiente',
        priority: task.priority || 'Media',
        projectId: String(task.projectId || '0'),
        assignedTo: String(task.assignedTo || '0'),
        dueDate: task.dueDate || '',
        estimatedHours: task.estimatedHours || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Pendiente',
        priority: 'Media',
        projectId: '0',
        assignedTo: '0',
        dueDate: '',
        estimatedHours: ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = () => {
    if (!formData.title) {
      alert('El título es requerido');
      return;
    }
    if (onAdd(formData)) {
      onClear();
    }
  };

  const handleUpdate = () => {
    if (!formData.title) {
      alert('El título es requerido');
      return;
    }
    if (onUpdate(formData)) {
      alert('Tarea actualizada');
    }
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="form-section task-form-section" role="form" aria-label="Formulario de tarea">
      <h3>Nueva / Editar Tarea</h3>
      <div className="form-fields">
        <div className="form-group form-group-full">
          <label htmlFor="task-title">Título:</label>
          <input
            id="task-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Nombre de la tarea"
            aria-required="true"
          />
        </div>
        <div className="form-group form-group-full">
          <label htmlFor="task-description">Descripción:</label>
          <textarea
            id="task-description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción opcional"
            aria-label="Descripción de la tarea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-status">Estado:</label>
          <select
            id="task-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            aria-label="Estado de la tarea"
          >
            <option>Pendiente</option>
            <option>En Progreso</option>
            <option>Completada</option>
            <option>Bloqueada</option>
            <option>Cancelada</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="task-priority">Prioridad:</label>
          <select
            id="task-priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            aria-label="Prioridad de la tarea"
          >
            <option>Baja</option>
            <option>Media</option>
            <option>Alta</option>
            <option>Crítica</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="task-project">Proyecto:</label>
          <select
            id="task-project"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            aria-label="Proyecto asignado"
          >
            <option value="0">Sin proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="task-assigned">Asignado a:</label>
          <select
            id="task-assigned"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            aria-label="Usuario asignado"
          >
            <option value="0">Sin asignar</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="task-due-date">Fecha vencimiento:</label>
          <input
            id="task-due-date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            aria-label="Fecha de vencimiento"
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-hours">Horas estimadas:</label>
          <input
            id="task-hours"
            type="number"
            name="estimatedHours"
            step="0.5"
            min="0"
            value={formData.estimatedHours}
            onChange={handleChange}
            aria-label="Horas estimadas"
          />
        </div>
        <div className="button-group form-group-full" role="group" aria-label="Acciones de tarea">
          <button onClick={handleAdd} aria-label="Agregar nueva tarea" className="btn-primary">➕ Agregar</button>
          <button onClick={handleUpdate} aria-label="Actualizar tarea seleccionada" className="btn-primary" disabled={!task}>✏️ Actualizar</button>
          <button onClick={handleDelete} aria-label="Eliminar tarea seleccionada" className="btn-danger" disabled={!task}>🗑️ Eliminar</button>
          <button onClick={onClear} aria-label="Limpiar formulario" className="btn-secondary">🔄 Limpiar</button>
        </div>
      </div>
    </div>
  );
}
