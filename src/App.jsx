import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PracticePage from './pages/PracticePage';
import StatsPage from './pages/StatsPage';
import VerbListPage from './pages/VerbListPage';
import './App.css';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
              🇯🇵 Japanese Verb Trainer
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/practice" className="nav-link">Practice</Link>
              </li>
              <li className="nav-item">
                <Link to="/verbs" className="nav-link">Verbs</Link>
              </li>
              <li className="nav-item">
                <Link to="/stats" className="nav-link">Stats</Link>
              </li>
            </ul>

            {/* Hamburger Menu Button */}
            <button
              className={`hamburger-menu ${mobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Mobile Menu */}
            <ul className={`nav-menu-mobile ${mobileMenuOpen ? 'active' : ''}`}>
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/practice" className="nav-link" onClick={closeMobileMenu}>Practice</Link>
              </li>
              <li className="nav-item">
                <Link to="/verbs" className="nav-link" onClick={closeMobileMenu}>Verbs</Link>
              </li>
              <li className="nav-item">
                <Link to="/stats" className="nav-link" onClick={closeMobileMenu}>Stats</Link>
              </li>
            </ul>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/verbs" element={<VerbListPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
