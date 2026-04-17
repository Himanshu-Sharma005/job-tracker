import { useState, useEffect } from 'react';
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
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Use a refresh key to force StatsPanel to refresh when jobs change
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      let url = `/api/jobs?page=${page}&limit=9`; // 9 implies 3x3 grid
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

  // Reset page when filters change
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
      setRefreshKey(old => old + 1); // trigger stats refresh
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
    <div className="dashboard" style={{ padding: '2rem 5%' }}>
      <div className="dashboard-header">
        <h2>Your Job Applications</h2>
        <button className="primary-btn" onClick={openAddForm}>+ New Application</button>
      </div>

      <StatsPanel key={refreshKey} />

      {reminders.length > 0 && (
        <div className="reminders-section glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--warning-color)' }}>
          <h3 style={{ color: 'var(--warning-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔔 Reminders Today
          </h3>
          <div className="jobs-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
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

      <div className="dashboard-controls" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Search by company..." 
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1', minWidth: '200px' }}
        />
        <select 
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select 
          className="status-filter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort: Newest First</option>
          <option value="priority">Sort: By Priority</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="empty-state">Loading your applications...</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <h3>No applications found</h3>
          <p>Click the button above to start tracking your job search.</p>
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
            <div className="pagination-controls">
              <button 
                className="secondary-btn" 
                onClick={() => setPage(page - 1)} 
                disabled={page === 1}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages} (Total: {totalCount})</span>
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
