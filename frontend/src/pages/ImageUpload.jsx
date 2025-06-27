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
  const maxFileSize = 5 * 1024 * 1024;

  const validateFile = (file) => {
    if (!validFileTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG or PNG image.\nगलत फाइल प्रकार। कृपया JPEG वा PNG अपलोड गर्नुहोस्।');
      return false;
    }
    if (file.size > maxFileSize) {
      setError('File size too large. Maximum size is 5MB.\nफाइल साइज धेरै ठूलो छ। अधिकतम साइज ५MB हो।');
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
    document.getElementById('file-input').value = '';
  };

  const handleProcess = async () => {
    if (!preview) return;
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/result', {
        state: {
          previewImage: preview,
          imageName: document.getElementById('file-input').files[0]?.name || 'uploaded-image.jpg',
          resultText: "ब १ पा ३४५६"
        }
      });
    } catch (err) {
      setError('An error occurred during processing. Please try again.\nप्रोसेस गर्दा त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।');
      console.error('Processing error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">
        Nepali License Plate Recognition 
        <br />
        <span className="nepali-text">(नेपाली नम्बर प्लेट पहिचान प्रणाली)</span>
      </h2>

      <p className="upload-description">
        Upload an image of a vehicle to recognize the Nepali license plate.
        <br />
        <span className="nepali-text">नेपाली नम्बर प्लेट पहिचान गर्न सवारीको तस्बिर अपलोड गर्नुहोस्।</span>
      </p>

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
            <img src={preview} alt="Preview" className="result-image" />
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
              {isDragActive
                ? 'Drop the image here'
                : 'Drag & drop an image, or click to select'}
              <br />
              <span className="nepali-text">
                {isDragActive
                  ? 'तस्बिर यहाँ छोड्नुहोस्'
                  : 'तस्बिर तान्नुहोस् वा क्लिक गरेर छान्नुहोस्'}
              </span>
            </p>
            <p className="upload-hint">
              Supports: JPEG, PNG (Max 5MB)
              <br />
              <span className="nepali-text">समर्थित: JPEG, PNG (अधिकतम ५MB)</span>
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="error-message">
          <FiX className="error-icon" />
          {error.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
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
            <br />
            <span className="nepali-text">तस्बिर परिवर्तन गर्नुहोस्</span>
          </button>
          <button
            onClick={handleProcess}
            disabled={isLoading}
            className="upload-btn primary"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Processing...
                <br />
                <span className="nepali-text">प्रोसेस हुँदैछ...</span>
              </>
            ) : (
              <>
                <FiCheck /> Recognize License Plate
                <br />
                <span className="nepali-text">नम्बर प्लेट चिनाउनुहोस्</span>
              </>
            )}
          </button>
        </div>
      )}
      <button 
  onClick={() => {
    document.querySelector('.about-container').scrollIntoView({ behavior: 'smooth' });
  }}
  className="about-link-btn"
>
  Learn More About Our System
  <br />
  <span className="nepali-text">हाम्रो प्रणालीको बारेमा थप जान्नुहोस्</span>
</button>
    </div>
  );
}
