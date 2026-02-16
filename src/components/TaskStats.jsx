import './TaskStats.css';

export default function TaskStats({ tasks }) {
  const calculateStats = () => {
    let total = tasks.length;
    let completed = 0;
    let pending = 0;
    let highPriority = 0;
    let overdue = 0;

    tasks.forEach(task => {
      if (task.status === 'Completada') {
        completed++;
      } else {
        pending++;
      }

      if (task.priority === 'Alta' || task.priority === 'Crítica') {
        highPriority++;
      }

      if (task.dueDate && task.status !== 'Completada') {
        const due = new Date(task.dueDate);
        const now = new Date();
        if (due < now) {
          overdue++;
        }
      }
    });

    return { total, completed, pending, highPriority, overdue };
  };

  const stats = calculateStats();

  return (
    <div className="stats">
      <div className="stats-header">
        <strong>📊 Estadísticas</strong>
      </div>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-item stat-completed">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completadas</div>
        </div>
        <div className="stat-item stat-pending">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pendientes</div>
        </div>
        <div className="stat-item stat-priority">
          <div className="stat-value">{stats.highPriority}</div>
          <div className="stat-label">Alta Prioridad</div>
        </div>
        <div className="stat-item stat-overdue">
          <div className="stat-value">{stats.overdue}</div>
          <div className="stat-label">Vencidas</div>
        </div>
      </div>
    </div>
  );
}
