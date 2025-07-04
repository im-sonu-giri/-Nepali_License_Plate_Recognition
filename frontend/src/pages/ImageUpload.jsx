import { useCallback, useState } from 'react';
import { FiUpload, FiX, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ImageUpload.css';

export default function ImageUpload() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
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
    const newFile = acceptedFiles[0];
    if (!newFile) return;
    if (!validateFile(newFile)) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(newFile);

    setFile(newFile);
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
    setFile(null);
    setError(null);
    document.getElementById('file-input').value = '';
  };

  const handleProcess = async () => {
    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:8000/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      const { text, cropped_image } = data;

      navigate('/result', {
        state: {
          previewImage: `data:image/jpeg;base64,${cropped_image}`,
          imageName: file.name,
          resultText: text || "ब १ पा ३४५६", // fallback dummy Nepali plate text
        },
      });
    } catch (err) {
      setError('Error uploading image. Please try again.\nत्रुटि भयो। कृपया पुन: प्रयास गर्नुहोस्।');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h2 className="upload-title">
          Nepali License Plate Recognition
          <br />
          <span className="nepali-text">(नेपाली नम्बर प्लेट पहिचान प्रणाली)</span>
        </h2>
      </div>

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
    </div>
  );
}
