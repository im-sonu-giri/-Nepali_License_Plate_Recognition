import React from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import './ResultPage.css';

export default function ResultPage() {
  const location = useLocation();
  const navigate =  useNavigate();
  const { previewImage, imageName, resultText } = location.state || {};

  const handleBack = () =>{
    navigate('/upload')
  }
  return (
    <div className="result-container">
      <h2 className="result-title">Recognition Results</h2>
      
      <div className="result-content">
        <div className="image-section">
          <h3>Uploaded Image</h3>
          <img 
            src={previewImage} 
            alt="Uploaded plate" 
            className="result-image"
          />
          <p className="image-name">{imageName}</p>
        </div>

        <div className="text-section">
          <h3>Recognized Text</h3>
          <div className="recognized-text">
            {resultText || "ब १ पा ३४५६"} {/* Default demo text if none provided */}
          </div>
          <div className="confidence">
            <span>Confidence: 92%</span>
          </div>
        </div>
      </div>

      <div className="additional-info">
        <h3>How It Works</h3>
        <p>
          Our system uses YOLOv8 for license plate detection and a custom CRNN model 
          for Nepali character recognition. The model was trained on thousands of 
          Nepali license plate images to achieve high accuracy.
        </p>
        
        <h3>Next Steps</h3>
        <ul>
          <li>Verify the recognized text</li>
          <li>Use this data for your records</li>
          <li>Process another image if needed</li>
        </ul>
      </div>
    </div>
  );
}