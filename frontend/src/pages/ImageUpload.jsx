import { useCallback, useState } from 'react';
import { FiUpload, FiImage } from 'react-icons/fi';
import './ImageUpload.css';

export default function ImageUpload() {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleProcess = async () => {
    if (!preview) return;
    setIsLoading(true);
    try {
      // In a real app, you would upload to your backend here
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Processing complete! (This is a demo)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Nepali License Plate Recognition</h2>
      <p className="upload-description">Upload an image of a vehicle to recognize the Nepali license plate</p>
      
      <div 
        className={`dropzone ${preview ? 'dropzone-active' : ''}`}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input 
          id="file-input"
          type="file" 
          accept="image/*"
          onChange={(e) => onDrop(e.target.files)}
          style={{ display: 'none' }}
        />
        {preview ? (
          <img 
            src={preview} 
            alt="Preview" 
            className="result-image"
          />
        ) : (
          <>
            <FiUpload className="upload-icon" />
            <p className="upload-text">Drag & drop an image, or click to select</p>
            <p className="upload-hint">Supports: JPEG, PNG</p>
          </>
        )}
      </div>
      {preview && (
        <button
          onClick={handleProcess}
          disabled={isLoading}
          className="upload-btn"
        >
          {isLoading ? 'Processing...' : 'Recognize License Plate'}
        </button>
      )}
    </div>
  );
}