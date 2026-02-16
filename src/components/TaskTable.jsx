export default function TaskTable() {
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
                  </tr>
              </thead>
              <tbody>
                  {/* Aquí renderizarás tus tareas luego */}
              </tbody>
          </table>
      </div>
    );
  }