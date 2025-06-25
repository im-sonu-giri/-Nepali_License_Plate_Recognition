import { useState } from 'react'
import Header from './components/header.jsx'
import ImageUpload from './pages/ImageUpload.jsx';
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main style={{ marginLeft: '240px', padding: '20px', width: '100%' }}>
        <ImageUpload />
      </main>
    </div>
  );
}

export default App;
