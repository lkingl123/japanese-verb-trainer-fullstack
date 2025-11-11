import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Load verbs from JSON
let verbs = [];
let progress = {};

function loadVerbs() {
  try {
    const verbsPath = path.join(__dirname, 'verbs.json');
    const data = fs.readFileSync(verbsPath, 'utf8');
    verbs = JSON.parse(data);
    console.log(`✓ Loaded ${verbs.length} verbs`);
  } catch (error) {
    console.error('Error loading verbs:', error);
    verbs = [];
  }
}

// Verb endpoints
app.get('/api/verbs', (req, res) => {
  res.json(verbs);
});

app.get('/api/verbs/random', (req, res) => {
  const { difficulty } = req.query;

  let filtered = verbs;
  if (difficulty && difficulty !== 'all') {
    filtered = verbs.filter(v => v.difficulty === difficulty);
  }

  if (filtered.length === 0) {
    return res.status(404).json({ error: 'No verbs found' });
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  res.json(random);
});

app.get('/api/verbs/:id', (req, res) => {
  const verb = verbs.find(v => v.id === parseInt(req.params.id));
  if (!verb) {
    return res.status(404).json({ error: 'Verb not found' });
  }
  res.json(verb);
});

// Progress endpoints (in-memory storage for local dev)
app.post('/api/progress/attempt', (req, res) => {
  const { verb_id, correct } = req.body;

  if (!verb_id || correct === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!progress[verb_id]) {
    progress[verb_id] = {
      verb_id,
      attempts: 0,
      correct: 0,
      last_practiced: new Date().toISOString(),
      ease_factor: 2.5,
      interval_days: 1
    };
  }

  progress[verb_id].attempts += 1;
  if (correct) {
    progress[verb_id].correct += 1;
  }
  progress[verb_id].last_practiced = new Date().toISOString();

  res.json(progress[verb_id]);
});

app.get('/api/progress/stats', (req, res) => {
  const stats = {
    total_verbs_practiced: Object.keys(progress).length,
    total_attempts: Object.values(progress).reduce((sum, p) => sum + p.attempts, 0),
    total_correct: Object.values(progress).reduce((sum, p) => sum + p.correct, 0),
    accuracy: 0,
    recent_sessions: []
  };

  if (stats.total_attempts > 0) {
    stats.accuracy = Math.round((stats.total_correct / stats.total_attempts) * 100);
  }

  res.json(stats);
});

app.post('/api/progress/reset', (req, res) => {
  progress = {};
  res.json({ message: 'Progress reset' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', verbs: verbs.length });
});

loadVerbs();

app.listen(PORT, () => {
  console.log(`\n✓ Local API server running on http://localhost:${PORT}`);
  console.log(`✓ Verbs endpoint: http://localhost:${PORT}/api/verbs\n`);
});
