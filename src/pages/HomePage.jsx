import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getStats } from '../services/dataService';

function HomePage() {
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

  return (
    <div className="home-page">
      <div className="card text-center">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#667eea' }}>
          🇯🇵 Japanese Verb Trainer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Master Japanese verbs with spaced repetition and interactive practice
        </p>

        <div className="flex-center gap-2">
          <Link to="/practice" className="btn btn-primary btn-large">
            Start Practice
          </Link>
          <Link to="/verbs" className="btn btn-secondary btn-large">
            Browse Verbs
          </Link>
        </div>
      </div>

      {!loading && stats && (
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Your Progress</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="stat-card">
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>
                {stats.total_verbs_practiced || 0}
              </div>
              <div style={{ color: '#666', marginTop: '0.5rem' }}>Verbs Practiced</div>
            </div>
            
            <div className="stat-card">
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
                {stats.total_attempts || 0}
              </div>
              <div style={{ color: '#666', marginTop: '0.5rem' }}>Total Attempts</div>
            </div>
            
            <div className="stat-card">
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {stats.accuracy || 0}%
              </div>
              <div style={{ color: '#666', marginTop: '0.5rem' }}>Accuracy</div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>📚 Comprehensive Verb Library</h3>
            <p style={{ color: '#666' }}>Learn from a curated collection of essential Japanese verbs</p>
          </div>
          
          <div>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>🧠 Spaced Repetition</h3>
            <p style={{ color: '#666' }}>Smart algorithm helps you review verbs at optimal intervals</p>
          </div>
          
          <div>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>📊 Progress Tracking</h3>
            <p style={{ color: '#666' }}>Monitor your learning journey with detailed statistics</p>
          </div>
          
          <div>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>🎯 Multiple Practice Modes</h3>
            <p style={{ color: '#666' }}>Flashcards, fill-in-the-blank, and listening comprehension</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
