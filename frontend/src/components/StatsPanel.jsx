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

  if (isLoading || !stats) return (
    <div className="card" style={{ padding: 'var(--s-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
      Loading analytics...
    </div>
  );

  const chartData = {
    labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
    datasets: [
      {
        data: [stats.Applied, stats.Interview, stats.Offer, stats.Rejected],
        backgroundColor: [
          '#9ca3af', // Gray
          '#3b82f6', // Blue
          '#10b981', // Green
          '#ef4444'  // Red
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 13
          },
          color: '#1f2937'
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="card stats-panel">
      <div className="stats-summary">
        <div style={{ padding: 'var(--s-4)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 'var(--s-1)' }}>Total</p>
          <p style={{ fontSize: '2rem', fontWeight: '800' }}>{stats.total}</p>
        </div>
        <div style={{ padding: 'var(--s-4)', textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 'var(--s-1)' }}>Interviews</p>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)' }}>{stats.Interview}</p>
        </div>
        <div style={{ padding: 'var(--s-4)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--success)', textTransform: 'uppercase', marginBottom: 'var(--s-1)' }}>Offers</p>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>{stats.Offer}</p>
        </div>
      </div>
      <div style={{ height: '160px', width: '100%', position: 'relative' }}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default StatsPanel;
