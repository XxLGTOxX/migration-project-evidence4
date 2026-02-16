import './TaskTable.css';

export default function TaskTable({ tasks, projects, users, onSelectTask }) {
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Sin proyecto';
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Sin asignar';
  };

  return (
    <div className="table-section">
      <h3>Lista de Tareas</h3>
      <table role="table" aria-label="Tabla de tareas">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Título</th>
            <th scope="col">Estado</th>
            <th scope="col">Prioridad</th>
            <th scope="col">Proyecto</th>
            <th scope="col">Asignado</th>
            <th scope="col">Vencimiento</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }} role="status" aria-live="polite">
                No hay tareas registradas
              </td>
            </tr>
          ) : (
            tasks.map(task => (
              <tr 
                key={task.id} 
                onClick={() => onSelectTask(task.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTask(task.id);
                  }
                }}
                aria-label={`Seleccionar tarea ${task.title}`}
              >
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.status || 'Pendiente'}</td>
                <td>{task.priority || 'Media'}</td>
                <td>{getProjectName(task.projectId)}</td>
                <td>{getUserName(task.assignedTo)}</td>
                <td>{task.dueDate || 'Sin fecha'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}