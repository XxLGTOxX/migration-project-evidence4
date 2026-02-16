import { useState, useEffect } from 'react';
import './ProjectForm.css';

export default function ProjectForm({ project, onAdd, onUpdate, onDelete, onClear }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (!formData.name.trim()) {
      alert('El nombre del proyecto es requerido');
      return;
    }
    onAdd(formData);
    onClear();
  };

  const handleUpdate = () => {
    if (!formData.name.trim()) {
      alert('El nombre del proyecto es requerido');
      return;
    }
    if (!project) {
      alert('Selecciona un proyecto');
      return;
    }
    onUpdate(formData);
    onClear();
  };

  const handleDelete = () => {
    if (!project) {
      alert('Selecciona un proyecto');
      return;
    }
    onDelete();
  };

  return (
    <div className="form-section project-form-section">
      <h3>Nuevo / Editar Proyecto</h3>
      <div className="form-group">
        <label htmlFor="project-name">Nombre:</label>
        <input
          id="project-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nombre del proyecto"
          aria-required="true"
        />
      </div>
      <div className="form-group">
        <label htmlFor="project-description">Descripción:</label>
        <textarea
          id="project-description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción del proyecto"
          aria-label="Descripción del proyecto"
        />
      </div>
      <div className="button-group" role="group" aria-label="Acciones de proyecto">
        <button type="button" onClick={handleAdd} className="btn-primary">
          ➕ Agregar
        </button>
        <button type="button" onClick={handleUpdate} className="btn-primary" disabled={!project}>
          ✏️ Actualizar
        </button>
        <button type="button" onClick={handleDelete} className="btn-danger" disabled={!project}>
          🗑️ Eliminar
        </button>
        <button type="button" onClick={onClear} className="btn-secondary">
          🔄 Limpiar
        </button>
      </div>
    </div>
  );
}
