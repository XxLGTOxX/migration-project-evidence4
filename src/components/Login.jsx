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
    <div className="panel login-panel" role="main">
      <h2>Login</h2>
      {error && (
        <div className="login-error" role="alert" aria-live="polite">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión">
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input 
            id="username"
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-required="true"
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input 
            id="password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>
        <button type="submit" aria-label="Iniciar sesión" className="login-button">🚀 Entrar</button>
      </form>
    </div>
  );
}
