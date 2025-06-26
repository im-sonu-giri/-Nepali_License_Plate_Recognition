import { useState } from 'react'
import Header from './components/header.jsx'
import ImageUpload from './pages/ImageUpload.jsx'
import ResultPage from './pages/ResultPage.jsx'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ImageUpload />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
