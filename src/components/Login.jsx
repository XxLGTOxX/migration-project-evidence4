import { useState } from 'react';
import { Storage } from '../services/storage';
import './Login.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Usuario y contraseña requeridos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await Storage.login(username, password);
      setError('');
      onLogin(user);
    } catch (err) {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
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
        <button type="submit" aria-label="Iniciar sesión" className="login-button" disabled={loading}>
          {loading ? '⏳ Cargando...' : '🚀 Entrar'}
        </button>
      </form>
    </div>
  );
}
