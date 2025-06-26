import { useState } from 'react'
import Header from './components/header.jsx'
import ImageUpload from './pages/ImageUpload.jsx'
import ResultPage from './pages/ResultPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main style={{ marginLeft: '330px', padding: '18px', width: '110%' }}>
        <ImageUpload />
        <Routes>
          <Route path="/" element={<ImageUpload />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes> 
      </main>
    </div>
  );
}

export default App;
