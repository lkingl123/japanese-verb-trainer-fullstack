import { useState } from 'react';

function FlashcardMode({ verb, onAnswer }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (correct) => {
    setAnswered(true);
    onAnswer(correct);
    setTimeout(() => {
      setShowAnswer(false);
      setAnswered(false);
    }, 1000);
  };

  return (
    <div className="flashcard-mode">
      <div 
        className="flashcard"
        style={{
          background: answered ? (showAnswer ? '#10b981' : '#ef4444') : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '3rem',
          borderRadius: '16px',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: showAnswer ? 'default' : 'pointer',
          transition: 'all 0.3s',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}
        onClick={() => !showAnswer && setShowAnswer(true)}
      >
        {!showAnswer ? (
          <>
            <div style={{ fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.9 }}>
              English Meaning
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>
              {verb.english}
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.8 }}>
              Click to reveal the Japanese verb
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.9 }}>
              {verb.english}
            </div>
            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {verb.masu_form}
            </div>
            <div style={{ fontSize: '2rem', marginBottom: '2rem', opacity: 0.9 }}>
              {verb.romaji}
            </div>
            {verb.verb_type && (
              <div style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '1rem' }}>
                Type: {verb.verb_type}
              </div>
            )}
          </>
        )}
      </div>

      {showAnswer && !answered && (
        <div className="flex-center gap-2 mt-3">
          <button 
            className="btn btn-danger btn-large"
            onClick={() => handleAnswer(false)}
          >
            ❌ Incorrect
          </button>
          <button 
            className="btn btn-success btn-large"
            onClick={() => handleAnswer(true)}
          >
            ✓ Correct
          </button>
        </div>
      )}

      {answered && (
        <div className="text-center mt-3" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          {showAnswer ? '✓ Great job!' : '❌ Keep practicing!'}
        </div>
      )}
    </div>
  );
}

export default FlashcardMode;
