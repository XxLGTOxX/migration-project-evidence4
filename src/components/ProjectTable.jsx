import './TaskTable.css';

export default function ProjectTable({ projects, onSelectProject }) {
  return (
    <div className="table-section">
      <h3>Lista de Proyectos</h3>
      <table role="table" aria-label="Tabla de proyectos">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {!projects.length ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }} role="status" aria-live="polite">
                No hay proyectos. Agrega uno con el formulario.
              </td>
            </tr>
          ) : (
            projects.map((proj) => (
              <tr
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProject(proj);
                  }
                }}
                aria-label={`Seleccionar proyecto ${proj.name}`}
              >
                <td>{proj.id}</td>
                <td>{proj.name}</td>
                <td>{proj.description || '—'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
