import { useState } from 'react'
import Header from './components/header.jsx'
import ImageUpload from './pages/ImageUpload.jsx';
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main style={{ marginLeft: '330px', padding: '18px', width: '110%' }}>
        <ImageUpload />
      </main>
    </div>
  );
}

export default App;
