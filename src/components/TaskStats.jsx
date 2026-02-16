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
      <strong>Estadísticas:</strong>
      <span>
        {' '}Total: {stats.total} | Completadas: {stats.completed} | 
        Pendientes: {stats.pending} | Alta Prioridad: {stats.highPriority} | 
        Vencidas: {stats.overdue}
      </span>
    </div>
  );
}
