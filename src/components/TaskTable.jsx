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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Proyecto</th>
            <th>Asignado</th>
            <th>Vencimiento</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                No hay tareas registradas
              </td>
            </tr>
          ) : (
            tasks.map(task => (
              <tr key={task.id} onClick={() => onSelectTask(task.id)}>
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