import { useState, useEffect } from 'react';
import { Storage } from '../services/storage';
import './NotificationsPanel.css';

const FILTER_ALL = 'all';
const FILTER_UNREAD = 'unread';
const FILTER_READ = 'read';

export default function NotificationsPanel({ currentUser }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState(FILTER_UNREAD);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const all = await Storage.getNotifications(currentUser.id);
      setNotifications(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [currentUser?.id]);

  const handleMarkAllRead = async () => {
    if (!currentUser?.id) return;
    try {
      await Storage.markNotificationsRead(currentUser.id);
      await loadNotifications();
    } catch (err) {
      alert('Error al marcar notificaciones');
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === FILTER_UNREAD) return !n.read;
    if (filter === FILTER_READ) return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleString('es-MX');
  };

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h2>🔔 Notificaciones</h2>
        <div className="notifications-filters">
          <button
            type="button"
            className={`filter-btn ${filter === FILTER_ALL ? 'active' : ''}`}
            onClick={() => setFilter(FILTER_ALL)}
          >
            Todas ({notifications.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === FILTER_UNREAD ? 'active' : ''}`}
            onClick={() => setFilter(FILTER_UNREAD)}
          >
            No leídas ({unreadCount})
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === FILTER_READ ? 'active' : ''}`}
            onClick={() => setFilter(FILTER_READ)}
          >
            Leídas ({notifications.length - unreadCount})
          </button>
        </div>
        {unreadCount > 0 && (
          <button type="button" className="btn-mark-read" onClick={handleMarkAllRead}>
            Marcar todas como leídas
          </button>
        )}
      </div>
      {loading ? (
        <p className="loading-msg">Cargando...</p>
      ) : (
        <div className="notifications-list">
          {filtered.length === 0 ? (
            <p className="empty-msg">No hay notificaciones</p>
          ) : (
            filtered.map((n) => (
              <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                <span className="notification-type">{n.type || 'info'}</span>
                <p className="notification-message">{n.message}</p>
                <span className="notification-date">{formatDate(n.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
