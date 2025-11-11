import { useState, useEffect } from 'react';
import { getRandomVerb, recordAttempt } from '../services/dataService';
import FlashcardMode from '../components/FlashcardMode';

function PracticePage() {
  const [difficulty, setDifficulty] = useState('all');
  const [currentVerb, setCurrentVerb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    attempts: 0,
    startTime: Date.now()
  });

  useEffect(() => {
    loadNewVerb();
  }, [difficulty]);

  const loadNewVerb = async () => {
    setLoading(true);
    try {
      const verb = await getRandomVerb(
        difficulty === 'all' ? null : difficulty,
        null
      );
      setCurrentVerb(verb);
    } catch (error) {
      console.error('Error loading verb:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (correct) => {
    // Record attempt
    try {
      await recordAttempt(currentVerb.id, correct);
      setSessionStats(prev => ({
        correct: prev.correct + (correct ? 1 : 0),
        attempts: prev.attempts + 1,
        startTime: prev.startTime
      }));
    } catch (error) {
      console.error('Error recording attempt:', error);
    }

    // Load next verb after a short delay
    setTimeout(() => {
      loadNewVerb();
    }, 1000);
  };

  const accuracy = sessionStats.attempts > 0 
    ? Math.round((sessionStats.correct / sessionStats.attempts) * 100)
    : 0;

  return (
    <div className="practice-page">
      <div className="card">
        <div className="flex-between mb-3">
          <h1 style={{ color: '#667eea' }}>Practice Session</h1>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#667eea' }}>
              {sessionStats.correct} / {sessionStats.attempts}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>
              Accuracy: {accuracy}%
            </div>
          </div>
        </div>

        <div className="controls mb-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Difficulty
            </label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#667eea' }}>
            <div style={{ fontSize: '2rem' }}>Loading...</div>
          </div>
        ) : currentVerb ? (
          <FlashcardMode verb={currentVerb} onAnswer={handleAnswer} />
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>No verbs available. Please add some verbs first!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PracticePage;
