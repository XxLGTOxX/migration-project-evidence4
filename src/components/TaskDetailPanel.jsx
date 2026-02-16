import { useState, useEffect } from 'react';
import { Storage } from '../services/storage';
import './TaskDetailPanel.css';

export default function TaskDetailPanel({ task, users, currentUser, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!task?.id) {
      setComments([]);
      setHistory([]);
      return;
    }
    loadCommentsAndHistory();
  }, [task?.id]);

  const loadCommentsAndHistory = async () => {
    if (!task?.id) return;
    setLoading(true);
    try {
      const [commentsData, historyData] = await Promise.all([
        Storage.getComments(task.id),
        Storage.getHistory(task.id)
      ]);
      setComments(commentsData);
      setHistory(historyData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId) => {
    const u = users.find(x => x.id === userId);
    return u ? u.username : 'Usuario';
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !task?.id) return;
    try {
      const userId = currentUser?.id || task.createdBy || task.assignedTo;
      if (!userId) {
        alert('No se puede agregar comentario: usuario no identificado');
        return;
      }
      await Storage.addComment({
        taskId: task.id,
        userId,
        commentText: newComment.trim()
      });
      setNewComment('');
      await loadCommentsAndHistory();
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      alert('Error al agregar comentario');
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleString('es-MX');
  };

  if (!task) {
    return (
      <div className="task-detail-panel empty">
        <p>Selecciona una tarea para ver comentarios e historial.</p>
      </div>
    );
  }

  return (
    <div className="task-detail-panel">
      <h3>📋 {task.title}</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <section className="detail-section">
            <h4>💬 Comentarios</h4>
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                rows={2}
                aria-label="Nuevo comentario"
              />
              <button type="submit" className="btn-add-comment">Agregar comentario</button>
            </form>
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="empty-msg">Sin comentarios</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <span className="comment-meta">{getUserName(c.userId)} · {formatDate(c.createdAt)}</span>
                    <p className="comment-text">{c.commentText}</p>
                  </div>
                ))
              )}
            </div>
          </section>
          <section className="detail-section">
            <h4>📜 Historial</h4>
            <div className="history-list">
              {history.length === 0 ? (
                <p className="empty-msg">Sin historial</p>
              ) : (
                history.map((h) => (
                  <div key={h.id} className="history-item">
                    <span className="history-action">{h.action}</span>
                    <span className="history-meta">{getUserName(h.userId)} · {formatDate(h.timestamp)}</span>
                    {(h.oldValue || h.newValue) && (
                      <p className="history-diff">{h.oldValue ? 'Antes: ' + h.oldValue : ''} {h.newValue ? '→ Después: ' + h.newValue : ''}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
