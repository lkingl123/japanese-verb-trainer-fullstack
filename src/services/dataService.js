import verbsData from '../../verbs.json';

/**
 * Data service for managing verbs and progress using JSON + localStorage
 * No API calls needed!
 */

// Initialize progress in localStorage
function initializeProgress() {
  const progress = localStorage.getItem('userProgress');
  if (!progress) {
    localStorage.setItem('userProgress', JSON.stringify({}));
  }
}

// Get all verbs
export function getAllVerbs() {
  return Promise.resolve(verbsData);
}

// Get a random verb
export function getRandomVerb(difficulty = null, exclude = null) {
  let filtered = verbsData;

  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter(v => v.difficulty === difficulty);
  }

  if (exclude && exclude.length > 0) {
    filtered = filtered.filter(v => !exclude.includes(v.id));
  }

  if (filtered.length === 0) {
    return Promise.resolve(null);
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  return Promise.resolve(random);
}

// Get a specific verb by ID
export function getVerbById(id) {
  const verb = verbsData.find(v => v.id === id);
  return Promise.resolve(verb || null);
}

// Record an attempt
export function recordAttempt(verbId, correct) {
  initializeProgress();
  const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');

  if (!progress[verbId]) {
    progress[verbId] = {
      verb_id: verbId,
      attempts: 0,
      correct: 0,
      last_practiced: new Date().toISOString(),
      ease_factor: 2.5,
      interval_days: 1
    };
  }

  const p = progress[verbId];
  p.attempts += 1;
  if (correct) {
    p.correct += 1;
  }
  p.last_practiced = new Date().toISOString();

  // Simple SM-2 algorithm
  if (correct) {
    if (p.interval_days === 1) {
      p.interval_days = 6;
    } else {
      p.interval_days = Math.round(p.interval_days * p.ease_factor);
    }
    p.ease_factor = Math.max(1.3, p.ease_factor + 0.1);
  } else {
    p.interval_days = 1;
    p.ease_factor = Math.max(1.3, p.ease_factor - 0.2);
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + p.interval_days);
  p.next_review = nextReview.toISOString();

  localStorage.setItem('userProgress', JSON.stringify(progress));
  return Promise.resolve(p);
}

// Get statistics
export function getStats() {
  initializeProgress();
  const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');

  const totalVerbsPracticed = Object.keys(progress).length;
  const totalAttempts = Object.values(progress).reduce((sum, p) => sum + p.attempts, 0);
  const totalCorrect = Object.values(progress).reduce((sum, p) => sum + p.correct, 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return Promise.resolve({
    total_verbs_practiced: totalVerbsPracticed,
    total_attempts: totalAttempts,
    total_correct: totalCorrect,
    accuracy: accuracy,
    recent_sessions: []
  });
}

// Reset all progress
export function resetProgress() {
  localStorage.setItem('userProgress', JSON.stringify({}));
  return Promise.resolve({ message: 'Progress reset' });
}

// Get progress for a specific verb
export function getVerbProgress(verbId) {
  initializeProgress();
  const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
  return Promise.resolve(progress[verbId] || null);
}
