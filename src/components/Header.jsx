import './Header.css';

export default function Header({ currentUser, onLogout }) {
  return (
    <header className="header" role="banner">
      <span aria-label="Usuario actual">
        Usuario: <strong>{currentUser?.username || 'Invitado'}</strong>
      </span>
      <button 
        onClick={onLogout}
        aria-label="Cerrar sesión"
      >
        Salir
      </button>
    </header>
  );
}
