import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function StatsPanel() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/jobs/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading || !stats) return <div className="stats-panel glass-panel">Loading analytics...</div>;

  const chartData = {
    labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
    datasets: [
      {
        label: '# of Applications',
        data: [stats.Applied, stats.Interview, stats.Offer, stats.Rejected],
        backgroundColor: [
          'rgba(99, 102, 241, 0.6)', // Accent
          'rgba(245, 158, 11, 0.6)', // Warning
          'rgba(16, 185, 129, 0.6)', // Success
          'rgba(239, 68, 68, 0.6)'   // Danger
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="stats-panel glass-panel">
      <div className="stats-cards">
        <div className="stat-card">
          <h4>Total Applications</h4>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h4>Interviews</h4>
          <p className="stat-value">{stats.Interview}</p>
        </div>
        <div className="stat-card">
          <h4>Offers</h4>
          <p className="stat-value">{stats.Offer}</p>
        </div>
      </div>
      <div className="chart-container">
        <Doughnut data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#f8fafc' } } } }} />
      </div>
    </div>
  );
}

export default StatsPanel;
