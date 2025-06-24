import { useCallback, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import './ImageUpload.css'; // Use separate CSS file for styling

export default function ImageUpload({ onUpload }) {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((files) => {
    const file = files[0];
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
      const mockFile = new File([], 'sample.jpg');
      await onUpload(mockFile);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
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
          <img src={preview} alt="Uploaded Preview" className="result-image" />
        ) : (
          <>
            <FiUpload className="upload-icon" size={48} />
            <p className="upload-text">Drag & drop an image, or click to select</p>
            <p className="upload-subtext">Supports: JPEG, PNG</p>
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
