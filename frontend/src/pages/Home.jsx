import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import Results from '../components/Results';
import Header from '../components/Header';
import { processImage } from '../services/api';

const Home = () => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (imageData) => {
    try {
      setError(null);
      const response = await processImage(imageData);
      setResults({
        originalImage: imageData,
        recognizedText: response.text,
        confidence: response.confidence
      });
    } catch (err) {
      setError('Failed to process image. Please try again with a clearer image.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Nepali License Plate Recognition
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Upload an image to detect and recognize Nepali license plates
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p>{error}</p>
            </div>
          )}

          <FileUpload onUpload={handleUpload} />

          {results && <Results {...results} />}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-lg mb-2">How it works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Upload a clear image of a vehicle with visible license plate</li>
              <li>Our system will detect the license plate region</li>
              <li>OCR engine will recognize the Devanagari characters</li>
              <li>View the results with confidence score</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;