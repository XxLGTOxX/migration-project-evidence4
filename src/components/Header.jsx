import './Header.css';

export default function Header({ currentUser, onLogout }) {
  return (
    <div className="header">
      <span>Usuario: <strong>{currentUser?.username || 'Invitado'}</strong></span>
      <button onClick={onLogout}>Salir</button>
    </div>
  );
}
