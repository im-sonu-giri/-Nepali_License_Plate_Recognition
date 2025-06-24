import './Home.css'

export default function Home({ setCurrentPage }) {
  return (
    <div className="home-container">
      <h1>Nepali License Plate Recognition</h1>
      <p>Upload an image to detect Nepali license plates (Devanagari script)</p>
      <button 
        className="home-button"
        onClick={() => setCurrentPage('upload')}
      >
        Get Started
      </button>
    </div>
  )
}