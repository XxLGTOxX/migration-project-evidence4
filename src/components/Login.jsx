import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Usuario y contraseña requeridos');
      return;
    }

    // Obtener usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      setError('');
      onLogin(user);
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="panel login-panel">
      <h2>Login</h2>
      {error && <div className="login-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Usuario:</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
