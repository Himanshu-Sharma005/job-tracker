import { Pencil, Trash2, Calendar, AlertCircle } from 'lucide-react';

function JobItem({ job, onEdit, onDelete }) {
  const formattedDate = new Date(job.application_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const getPriorityInfo = (prio) => {
    if (prio === 'High') return { color: 'var(--danger)', icon: <AlertCircle size={14} /> };
    if (prio === 'Medium') return { color: 'var(--warning)', icon: null };
    return { color: 'var(--success)', icon: null };
  };

  const priorityInfo = getPriorityInfo(job.priority);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {job.company_name}
            </h3>
            {job.priority && (
              <span style={{ 
                fontSize: '0.65rem', 
                padding: '0.1rem 0.4rem', 
                border: `1px solid ${priorityInfo.color}`, 
                color: priorityInfo.color, 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontWeight: '600'
              }}>
                {priorityInfo.icon}
                {job.priority.toUpperCase()}
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>{job.role}</p>
        </div>
        <span className={`status-badge bg-${job.status.toLowerCase()}`}>
          {job.status}
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          <Calendar size={14} />
          <span>applied {formattedDate}</span>
        </div>

        {job.reminder_date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', fontSize: '0.75rem', fontWeight: '500' }}>
            <Calendar size={14} />
            <span>Follow-up: {new Date(job.reminder_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>
      
      {job.notes && (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5',  display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.notes}
        </p>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 'var(--s-4)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 'var(--s-2)' }}>
        <button className="icon-btn" onClick={() => onEdit(job)} style={{ flex: 1, justifyContent: 'center' }}>
          <Pencil size={16} />
          <span>Edit</span>
        </button>
        <button className="icon-btn delete-btn" onClick={() => onDelete(job.id)} style={{ flex: 1, justifyContent: 'center' }}>
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default JobItem;
