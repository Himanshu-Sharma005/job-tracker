import { useState, useEffect } from 'react';
import { Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import JobItem from '../components/JobItem';
import JobForm from '../components/JobForm';
import StatsPanel from '../components/StatsPanel';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [reminders, setReminders] = useState([]);
  
  const { addToast } = useToast();
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      let url = `/api/jobs?page=${page}&limit=9`;
      if (search) url += `&search=${search}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (sortBy) url += `&sortBy=${sortBy}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to fetch jobs');
      
      setJobs(data.data.jobs);
      setTotalPages(data.data.totalPages);
      setTotalCount(data.data.totalCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs/reminders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setReminders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch reminders');
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchReminders();
  }, [search, statusFilter, sortBy, page]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sortBy]);

  const handleAddJob = async (jobData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });
      
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to add job');
      
      addToast('Job application created successfully!', 'success');
      await fetchJobs();
      setRefreshKey(old => old + 1);
      setIsFormOpen(false);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleUpdateJob = async (jobData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/jobs/${editingJob.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });
      
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to update job');
      
      addToast('Job application updated successfully!', 'success');
      await fetchJobs();
      setRefreshKey(old => old + 1);
      closeForm();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/jobs/${jobToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to delete job');
      
      addToast('Job application deleted successfully!', 'success');
      await fetchJobs();
      setRefreshKey(old => old + 1);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setJobToDelete(null);
    }
  };

  const handleDeleteRequest = (id) => {
    setJobToDelete(id);
  };

  const openAddForm = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const openEditForm = (job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Your Job Applications</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track and manage your professional journey</p>
        </div>
        <button className="primary-btn" onClick={openAddForm}>
          <Plus size={18} />
          <span>New Application</span>
        </button>
      </div>

      <StatsPanel key={refreshKey} />

      {reminders.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--s-8)', borderLeft: '4px solid var(--warning)' }}>
          <h3 style={{ color: 'var(--warning)', marginBottom: 'var(--s-4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔔 Reminders Today
          </h3>
          <div className="jobs-grid" style={{ marginBottom: 0 }}>
            {reminders.map(job => (
              <JobItem 
                key={job.id} 
                job={job} 
                onEdit={openEditForm}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-controls">
        <div className="control-group search-wrapper" style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search by company..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        
        <div className="control-group">
          <Filter size={18} style={{ color: 'var(--text-secondary)' }} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: '160px' }}
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="control-group">
          <ArrowUpDown size={18} style={{ color: 'var(--text-secondary)' }} />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ minWidth: '180px' }}
          >
            <option value="date">Newest First</option>
            <option value="priority">By Priority</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="empty-state">
          <div className="loading-spinner" style={{ marginBottom: '1rem' }}>Loading...</div>
          <p>Fetching your job applications...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="card empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
          <h3>No applications found</h3>
          <p>You haven't added any job applications yet. Click the "New Application" button to start tracking your search.</p>
        </div>
      ) : (
        <>
          <div className="jobs-grid">
            {jobs.map(job => (
              <JobItem 
                key={job.id} 
                job={job} 
                onEdit={openEditForm}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--s-4)', marginTop: 'var(--s-8)' }}>
              <button 
                className="secondary-btn" 
                onClick={() => setPage(page - 1)} 
                disabled={page === 1}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Page {page} of {totalPages}</span>
              <button 
                className="secondary-btn" 
                onClick={() => setPage(page + 1)} 
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {isFormOpen && (
        <JobForm 
          job={editingJob} 
          onSubmit={editingJob ? handleUpdateJob : handleAddJob} 
          onCancel={closeForm} 
        />
      )}

      <ConfirmModal 
        isOpen={!!jobToDelete}
        message="This action cannot be undone. You will permanently lose this job application."
        onConfirm={confirmDelete}
        onCancel={() => setJobToDelete(null)}
      />
    </div>
  );
}

export default Dashboard;
