import { AlertTriangle } from 'lucide-react';

function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: 'var(--s-12)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          backgroundColor: 'var(--danger-soft)', 
          color: 'var(--danger)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto var(--s-6)' 
        }}>
          <AlertTriangle size={32} />
        </div>
        
        <h3 style={{ marginBottom: 'var(--s-2)', fontSize: '1.5rem' }}>Are you sure?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--s-12)', fontSize: '0.95rem', lineHeight: '1.5' }}>
          {message}
        </p>
        
        <div style={{ display: 'flex', gap: 'var(--s-3)' }}>
          <button className="secondary-btn" onClick={onCancel} style={{ flex: 1 }}>
            Cancel
          </button>
          <button className="primary-btn" style={{ backgroundColor: 'var(--danger)', flex: 1 }} onClick={onConfirm}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
