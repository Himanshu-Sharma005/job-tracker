import { useState, useEffect } from 'react';

function JobForm({ job, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    company_name: '',
    role: '',
    status: 'Applied',
    priority: 'Medium',
    reminder_date: '',
    application_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (job) {
      setFormData({
        company_name: job.company_name,
        role: job.role,
        status: job.status,
        priority: job.priority || 'Medium',
        reminder_date: job.reminder_date ? new Date(job.reminder_date).toISOString().split('T')[0] : '',
        application_date: new Date(job.application_date).toISOString().split('T')[0],
        notes: job.notes || ''
      });
    }
  }, [job]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <h2>{job ? 'Edit Job Application' : 'Add New Application'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input 
              type="text" 
              name="company_name" 
              value={formData.company_name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Google"
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input 
              type="text" 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Frontend Developer"
            />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Application Date</label>
              <input 
                type="date" 
                name="application_date" 
                value={formData.application_date} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Follow-up Reminder</label>
              <input 
                type="date" 
                name="reminder_date" 
                value={formData.reminder_date} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              rows="3" 
              placeholder="Any specific details, links, or contacts..."
            ></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
            <button type="submit" className="primary-btn">{job ? 'Update Job' : 'Add Job'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobForm;
