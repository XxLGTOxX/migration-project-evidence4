import './TaskSearch.css';

export default function TaskSearch({ searchText, setSearchText, statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, projectFilter, setProjectFilter, projects }) {
  return (
    <div className="task-search">
      <input
        type="text"
        className="search-input"
        placeholder="Buscar por título o descripción..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        aria-label="Buscar tareas"
      />
      <select
        className="search-select"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        aria-label="Filtrar por estado"
      >
        <option value="">Todos los estados</option>
        <option value="Pendiente">Pendiente</option>
        <option value="En Progreso">En Progreso</option>
        <option value="Completada">Completada</option>
        <option value="Bloqueada">Bloqueada</option>
        <option value="Cancelada">Cancelada</option>
      </select>
      <select
        className="search-select"
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        aria-label="Filtrar por prioridad"
      >
        <option value="">Todas las prioridades</option>
        <option value="Baja">Baja</option>
        <option value="Media">Media</option>
        <option value="Alta">Alta</option>
        <option value="Crítica">Crítica</option>
      </select>
      <select
        className="search-select"
        value={projectFilter}
        onChange={(e) => setProjectFilter(e.target.value)}
        aria-label="Filtrar por proyecto"
      >
        <option value="">Todos los proyectos</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}
