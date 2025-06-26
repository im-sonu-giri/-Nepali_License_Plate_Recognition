import { useCallback, useState } from 'react';
import { FiUpload, FiImage, FiX, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ImageUpload.css';

export default function ImageUpload() {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const navigate = useNavigate();

  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!validFileTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG or PNG image.');
      return false;
    }
    if (file.size > maxFileSize) {
      setError('File size too large. Maximum size is 5MB.');
      return false;
    }
    return true;
  };

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    setIsDragActive(false);
    
    const file = acceptedFiles[0];
    if (!file) return;

    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    onDrop(files);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    onDrop(files);
  };

  const removeImage = () => {
    setPreview(null);
    setError(null);
    // Reset file input
    document.getElementById('file-input').value = '';
  };

  const handleProcess = async () => {
    if (!preview) return;
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would upload to your backend here
      // const formData = new FormData();
      // formData.append('image', document.getElementById('file-input').files[0]);
      // const response = await fetch('/api/process', { method: 'POST', body: formData });
      // const result = await response.json();
      
      // For demo purposes, we'll use mock data
      navigate('/result', { 
        state: { 
          previewImage: preview,
          imageName: document.getElementById('file-input').files[0]?.name || 'uploaded-image.jpg',
          resultText: "ब १ पा ३४५६" // Mock result
        } 
      });
    } catch (err) {
      setError('An error occurred during processing. Please try again.');
      console.error('Processing error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Nepali License Plate Recognition</h2>
      <p className="upload-description">Upload an image of a vehicle to recognize the Nepali license plate</p>
      
      <div 
        className={`dropzone ${preview ? 'dropzone-active' : ''} ${isDragActive ? 'dropzone-dragging' : ''}`}
        onClick={() => document.getElementById('file-input').click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input 
          id="file-input"
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {preview ? (
          <div className="preview-container">
            <img 
              src={preview} 
              alt="Preview" 
              className="result-image"
            />
            <button 
              className="remove-image-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
            >
              <FiX />
            </button>
          </div>
        ) : (
          <>
            <FiUpload className="upload-icon" />
            <p className="upload-text">
              {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
            </p>
            <p className="upload-hint">Supports: JPEG, PNG (Max 5MB)</p>
          </>
        )}
      </div>

      {error && (
        <div className="error-message">
          <FiX className="error-icon" /> {error}
        </div>
      )}

      {preview && (
        <div className="upload-actions">
          <button
            onClick={() => document.getElementById('file-input').click()}
            className="upload-btn secondary"
            disabled={isLoading}
          >
            Change Image
          </button>
          <button
            onClick={handleProcess}
            disabled={isLoading}
            className="upload-btn primary"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Processing...
              </>
            ) : (
              <>
                <FiCheck /> Recognize License Plate
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}