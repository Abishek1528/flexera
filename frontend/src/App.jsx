import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import SchoolDetailPage from './pages/SchoolDetail.jsx';
import HeatMap from './pages/HeatMap.jsx';
import './styles/App.css';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/',        label: 'Dashboard' },
    { to: '/heatmap', label: 'Heat Map'  },
  ];

  return (
    <header className={`sp-nav${scrolled ? ' sp-nav--scrolled' : ''}`}>
      <div className="sp-nav-inner">

        {/* Logo */}
        <Link to="/" className="sp-nav-logo">
          <span className="sp-nav-logo-mark">S</span>
          <span className="sp-nav-logo-text">
            Shiksha<strong>Pulse</strong>
          </span>
        </Link>

        {/* Links */}
        <nav className="sp-nav-links">
          {links.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`sp-nav-link${active ? ' sp-nav-link--active' : ''}`}
              >
                {label}
                {active && <span className="sp-nav-link-dot" />}
              </Link>
            );
          })}
        </nav>

        {/* Right slot — version pill */}
        <div className="sp-nav-right">
          <span className="sp-nav-pill">Beta</span>
        </div>

      </div>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="sp-app">
        <Navbar />
        <main className="sp-main">
          <Routes>
            <Route path="/"       element={<Dashboard />} />
            <Route path="/school" element={<SchoolDetailPage />} />
            <Route path="/heatmap" element={<HeatMap />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;