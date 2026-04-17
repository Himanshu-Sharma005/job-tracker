function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '400px', textAlign: 'center', padding: '2.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Are you sure?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="secondary-btn" onClick={onCancel}>Cancel</button>
          <button className="primary-btn" style={{ background: 'var(--danger-color)' }} onClick={onConfirm}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
