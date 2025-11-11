import { useState } from 'react';

function FillBlankMode({ verb, onAnswer }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);

  const checkAnswer = () => {
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    const correctRomaji = verb.romaji.toLowerCase();
    const isCorrect = normalizedAnswer === correctRomaji;
    
    setFeedback(isCorrect);
    setAnswered(true);
    onAnswer(isCorrect);
    
    setTimeout(() => {
      setUserAnswer('');
      setFeedback(null);
      setAnswered(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !answered && userAnswer.trim()) {
      checkAnswer();
    }
  };

  return (
    <div className="fill-blank-mode">
      <div 
        style={{
          background: feedback === null ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                     feedback ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '3rem',
          borderRadius: '16px',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.9 }}>
          Type the romaji for:
        </div>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          {verb.english}
        </div>

        {!answered ? (
          <>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type romaji here..."
              autoFocus
              style={{
                padding: '1rem',
                fontSize: '1.5rem',
                borderRadius: '8px',
                border: 'none',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
              }}
            />
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="btn btn-primary btn-large mt-3"
              style={{ minWidth: '200px' }}
            >
              Check Answer
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              {feedback ? '✓ Correct!' : '❌ Incorrect'}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {verb.masu_form}
            </div>
            <div style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
              {verb.romaji}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FillBlankMode;
