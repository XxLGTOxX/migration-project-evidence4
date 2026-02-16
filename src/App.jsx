import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import Header from './components/Header'
import TaskList from './components/TaskList'
import { Storage } from './services/storage'

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Inicializar storage al cargar la app
    Storage.init();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="container">
      <h1>Task Manager Modern</h1>
      
      {!currentUser ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="panel">
          <Header currentUser={currentUser} onLogout={handleLogout} />
          <TaskList currentUser={currentUser} />
        </div>
      )}
    </div>
  )
}

export default App