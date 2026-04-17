function JobItem({ job, onEdit, onDelete }) {
  const formattedDate = new Date(job.application_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const getPriorityColor = (prio) => {
    if (prio === 'High') return 'var(--danger-color)';
    if (prio === 'Medium') return 'var(--warning-color)';
    return 'var(--success-color)';
  };

  return (
    <div className={`job-card glass-panel status-${job.status}`}>
      <div className="job-header">
        <div>
          <h3 className="job-company" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {job.company_name}
            {job.priority && (
              <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', border: `1px solid ${getPriorityColor(job.priority)}`, color: getPriorityColor(job.priority), borderRadius: '4px' }}>
                {job.priority}
              </span>
            )}
          </h3>
          <p className="job-role">{job.role}</p>
        </div>
        <span className="status-badge">{job.status}</span>
      </div>
      
      <p className="job-date">Applied on {formattedDate}</p>

      {job.reminder_date && (
        <p className="job-date" style={{ color: 'var(--warning-color)', marginTop: '-0.5rem' }}>
          ⏰ Reminder: {new Date(job.reminder_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
      )}
      
      {job.notes && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <p>{job.notes.length > 60 ? job.notes.substring(0, 60) + '...' : job.notes}</p>
        </div>
      )}

      <div className="job-actions">
        <button className="icon-btn" onClick={() => onEdit(job)}>Edit</button>
        <button className="icon-btn delete-btn" onClick={() => onDelete(job.id)}>Delete</button>
      </div>
    </div>
  );
}

export default JobItem;
