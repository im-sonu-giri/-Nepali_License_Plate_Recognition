import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <a href="/" className="logo">
          <div className="logo-icon"></div>
          <span className="logo-text">NLPR System</span>
        </a>
        <nav className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
        </nav>
      </header>

      <main>
        <h1>Nepali License Plate Recognition</h1>
        <p className="devanagari">नेपाली लाइसेन्स प्लेट</p>
      </main>
    </div>
  );
}

export default App;