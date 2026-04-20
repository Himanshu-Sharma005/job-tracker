import { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';

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
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s-6)' }}>
          <h2 style={{ fontSize: '1.5rem' }}>{job ? 'Edit Application' : 'New Application'}</h2>
          <button className="icon-btn" onClick={onCancel} style={{ padding: '0.5rem' }}>
            <X size={20} />
          </button>
        </div>

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
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)', marginBottom: 'var(--s-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)', marginBottom: 'var(--s-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Application Date</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="date" 
                  name="application_date" 
                  value={formData.application_date} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
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
              rows="4" 
              placeholder="Any specific details, links, or interview notes..."
            ></textarea>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--s-3)', marginTop: 'var(--s-8)' }}>
            <button type="button" className="secondary-btn" onClick={onCancel} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" style={{ flex: 1 }}>
              <Save size={18} />
              <span>{job ? 'Update' : 'Create'} Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobForm;
