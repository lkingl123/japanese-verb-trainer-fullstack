import { useState, useEffect } from 'react';
import { getStats, resetProgress } from '../services/dataService';

function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      try {
        await resetProgress();
        fetchStats();
        alert('Progress reset successfully!');
      } catch (error) {
        console.error('Error resetting progress:', error);
        alert('Failed to reset progress');
      }
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div style={{ padding: '3rem', color: '#667eea' }}>Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="card">
        <div className="flex-between mb-3">
          <h1 style={{ color: '#667eea' }}>Your Statistics</h1>
          <button 
            onClick={handleReset}
            className="btn btn-danger"
          >
            Reset Progress
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {stats.total_verbs_practiced || 0}
            </div>
            <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Verbs Practiced</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {stats.total_correct || 0}
            </div>
            <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Correct Answers</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(245, 158, 11, 0.3)'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {stats.total_attempts || 0}
            </div>
            <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Total Attempts</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(139, 92, 246, 0.3)'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {stats.accuracy || 0}%
            </div>
            <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Accuracy Rate</div>
          </div>
        </div>

        {stats.recent_sessions && stats.recent_sessions.length > 0 && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Recent Sessions</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#667eea' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#667eea' }}>Verbs</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#667eea' }}>Accuracy</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#667eea' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_sessions.map((session) => (
                    <tr 
                      key={session.id}
                      style={{ borderBottom: '1px solid #f0f0f0' }}
                    >
                      <td style={{ padding: '1rem' }}>
                        {new Date(session.session_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem' }}>{session.verbs_practiced}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          background: session.accuracy >= 80 ? '#dcfce7' : 
                                     session.accuracy >= 60 ? '#fef3c7' : '#fee2e2',
                          color: session.accuracy >= 80 ? '#16a34a' : 
                                 session.accuracy >= 60 ? '#ca8a04' : '#dc2626',
                          fontWeight: 'bold'
                        }}>
                          {session.accuracy}%
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {Math.floor(session.duration_seconds / 60)}m {session.duration_seconds % 60}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(!stats.total_attempts || stats.total_attempts === 0) && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              No practice data yet. Start practicing to see your statistics!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsPage;
