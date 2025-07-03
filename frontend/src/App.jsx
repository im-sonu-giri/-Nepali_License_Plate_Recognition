import { useState } from 'react'
import Header from './components/header.jsx'
import ImageUpload from './pages/ImageUpload.jsx'
import ResultPage from './pages/ResultPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import HomePage from './pages/HomePage.jsx'
import UploadPlate from './components/UploadPlate'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main style={{ marginLeft: '310px', padding: '18px', width: '100%' }}>
        <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/upload" element={<UploadPlate />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes> 
      </main>
    </div>
  );
}

export default App;
