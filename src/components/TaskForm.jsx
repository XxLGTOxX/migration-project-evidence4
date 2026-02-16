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
    <div className="form-section">
      <h3>Nueva/Editar Tarea</h3>
      <div className="form-group">
        <label>Título:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Descripción:</label>
        <textarea
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Estado:</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option>Pendiente</option>
          <option>En Progreso</option>
          <option>Completada</option>
          <option>Bloqueada</option>
          <option>Cancelada</option>
        </select>
      </div>
      <div className="form-group">
        <label>Prioridad:</label>
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option>Baja</option>
          <option>Media</option>
          <option>Alta</option>
          <option>Crítica</option>
        </select>
      </div>
      <div className="form-group">
        <label>Proyecto:</label>
        <select name="projectId" value={formData.projectId} onChange={handleChange}>
          <option value="0">Sin proyecto</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Asignado a:</label>
        <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
          <option value="0">Sin asignar</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Fecha Vencimiento:</label>
        <input
          type="text"
          name="dueDate"
          placeholder="YYYY-MM-DD"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Horas Estimadas:</label>
        <input
          type="number"
          name="estimatedHours"
          step="0.5"
          value={formData.estimatedHours}
          onChange={handleChange}
        />
      </div>
      <div className="button-group">
        <button onClick={handleAdd}>Agregar</button>
        <button onClick={handleUpdate}>Actualizar</button>
        <button onClick={handleDelete}>Eliminar</button>
        <button onClick={onClear}>Limpiar</button>
      </div>
    </div>
  );
}
