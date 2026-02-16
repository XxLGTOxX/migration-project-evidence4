import './ReportGenerator.css';

const REPORT_TASKS = 'tasks';
const REPORT_PROJECTS = 'projects';
const REPORT_USERS = 'users';

function escapeCSV(str) {
  if (str == null) return '';
  return String(str).replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, '');
}

export default function ReportGenerator({ tasks, projects, users }) {
  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    alert('✅ Reporte exportado correctamente');
  };

  const handleReportTasks = () => {
    let csv = 'ID,Título,Descripción,Estado,Prioridad,Proyecto,Asignado a,Fecha Vencimiento,Horas Estimadas\n';
    tasks.forEach((task) => {
      const project = projects.find((p) => p.id === task.projectId);
      const user = users.find((u) => u.id === task.assignedTo);
      csv += `${task.id},"${escapeCSV(task.title)}","${escapeCSV(task.description)}","${task.status || 'Pendiente'}","${task.priority || 'Media'}","${project ? project.name : 'Sin proyecto'}","${user ? user.username : 'Sin asignar'}","${task.dueDate || 'Sin fecha'}","${task.estimatedHours || 0}"\n`;
    });
    downloadCSV(csv, `reporte_tareas_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleReportProjects = () => {
    let csv = 'ID,Nombre,Descripción,Cantidad de tareas\n';
    projects.forEach((project) => {
      const count = tasks.filter((t) => t.projectId === project.id).length;
      csv += `${project.id},"${escapeCSV(project.name)}","${escapeCSV(project.description)}",${count}\n`;
    });
    downloadCSV(csv, `reporte_proyectos_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleReportUsers = () => {
    let csv = 'ID,Usuario,Tareas asignadas\n';
    users.forEach((user) => {
      const count = tasks.filter((t) => t.assignedTo === user.id).length;
      csv += `${user.id},"${escapeCSV(user.username)}",${count}\n`;
    });
    downloadCSV(csv, `reporte_usuarios_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="report-generator">
      <span className="report-label">Generar reporte:</span>
      <button type="button" className="report-btn" onClick={handleReportTasks} title="Reporte de tareas CSV">
        📋 Tareas CSV
      </button>
      <button type="button" className="report-btn" onClick={handleReportProjects} title="Reporte de proyectos CSV">
        📁 Proyectos CSV
      </button>
      <button type="button" className="report-btn" onClick={handleReportUsers} title="Reporte de usuarios CSV">
        👥 Usuarios CSV
      </button>
    </div>
  );
}
