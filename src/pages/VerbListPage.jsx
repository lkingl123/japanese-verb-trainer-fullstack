import { useState, useEffect } from 'react';
import { verbAPI } from '../services/api';

function VerbListPage() {
  const [verbs, setVerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    fetchVerbs();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchVerbs = async () => {
    try {
      const response = await verbAPI.getAll();
      setVerbs(response.data);
    } catch (error) {
      console.error('Error fetching verbs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVerbs = verbs
    .filter(verb => filter === 'all' || verb.difficulty === filter)
    .filter(verb => 
      verb.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verb.romaji.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verb.masu_form.includes(searchTerm)
    );

  return (
    <div className="verb-list-page">
      <div className="card">
        <h1 style={{ color: '#667eea', marginBottom: '2rem' }}>Verb Library</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search verbs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#667eea' }}>
            Loading verbs...
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1rem', color: '#666' }}>
              Showing {filteredVerbs.length} of {verbs.length} verbs
            </div>

            {/* Desktop Table View */}
            {!isMobile && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#667eea' }}>Japanese</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#667eea' }}>Romaji</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#667eea' }}>English</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#667eea' }}>Type</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#667eea' }}>Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVerbs.map((verb) => (
                      <tr
                        key={verb.id}
                        style={{
                          borderBottom: '1px solid #f0f0f0',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                          {verb.masu_form}
                        </td>
                        <td style={{ padding: '1rem' }}>{verb.romaji}</td>
                        <td style={{ padding: '1rem' }}>{verb.english}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            background: '#e0e7ff',
                            color: '#667eea',
                            fontSize: '0.85rem'
                          }}>
                            {verb.verb_type || 'N/A'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            background: verb.difficulty === 'beginner' ? '#dcfce7' :
                                       verb.difficulty === 'intermediate' ? '#fef3c7' : '#fee2e2',
                            color: verb.difficulty === 'beginner' ? '#16a34a' :
                                   verb.difficulty === 'intermediate' ? '#ca8a04' : '#dc2626',
                            fontSize: '0.85rem',
                            textTransform: 'capitalize'
                          }}>
                            {verb.difficulty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile Card View */}
            {isMobile && (
              <div className="verb-cards-grid mobile">
                {filteredVerbs.map((verb) => (
                  <div key={verb.id} className="verb-card">
                    <div className="verb-card-japanese">{verb.masu_form}</div>
                    <div className="verb-card-romaji">{verb.romaji}</div>
                    <div className="verb-card-english">{verb.english}</div>
                    <div className="verb-card-meta">
                      {verb.verb_type && (
                        <span className="verb-card-badge verb-card-type">
                          {verb.verb_type}
                        </span>
                      )}
                      <span className={`verb-card-badge verb-card-difficulty ${verb.difficulty}`}>
                        {verb.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VerbListPage;
