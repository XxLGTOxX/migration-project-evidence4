import { useState } from 'react'
import './App.css'
import TaskTable from './components/TaskTable'

function App() {
  // Aquí irá la lógica de login y pestañas después
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="container">
        <h1>Task Manager Modern</h1>
        
        {!isLoggedIn ? (
          /* Aquí irá el Panel de Login */
          <div className="panel">
              <h2>Login</h2>
              <div className="form-group">
                  <label>Usuario:</label>
                  <input type="text" defaultValue="admin" />
              </div>
              <div className="form-group">
                  <label>Contraseña:</label>
                  <input type="password" defaultValue="admin" />
              </div>
              <button onClick={() => setIsLoggedIn(true)}>Entrar</button>
          </div>
        ) : (
          /* Aquí irá el Panel Principal cuando isLoggedIn sea true */
          <div className="panel">
              <div className="header">
                  <span>Usuario: <strong>Admin</strong></span>
                  <button onClick={() => setIsLoggedIn(false)}>Salir</button>
              </div>
              {<TaskTable />}
              <p>Bienvenido al sistema migrado.</p>
          </div>
        )}
    </div>
  )
}

export default App