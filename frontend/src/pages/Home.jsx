import { useState } from 'react'
import FileUpload from '../components/common/FileUpload'
import ResultDisplay from '../components/ResultDisplay'
import LoadingSpinner from '../components/common/LoadingSpinner'
import yoloModelImage from '../assets/images/yolo-v8-model.png'

export default function Home() {
  const [image, setImage] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpload = async (file) => {
    setLoading(true)
    setError(null)
    try {
      // Here you would typically call your API endpoint
      // const response = await axios.post('/api/recognize', formData)
      // Simulating API call with timeout
      setTimeout(() => {
        setResult({
          plateNumber: 'बा १२ प १२३४',
          confidence: '98.7%',
          image: URL.createObjectURL(file)
        })
        setLoading(false)
      }, 2000)
    } catch (err) {
      setError('Failed to process image. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Nepali License Plate Recognition
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload an image of a Nepali license plate to recognize the characters using our
          trained YOLOv8 model.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Try It Out</h2>
            <FileUpload onUpload={handleUpload} disabled={loading} />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {loading && (
            <div className="mt-6 flex justify-center">
              <LoadingSpinner />
              <span className="ml-2">Processing image...</span>
            </div>
          )}

          {result && <ResultDisplay result={result} />}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Our YOLOv8 Model</h2>
          <img
            src={yoloModelImage}
            alt="YOLOv8 model architecture"
            className="w-full h-auto rounded"
          />
          <p className="mt-4 text-gray-700">
            Our custom-trained YOLOv8 model specializes in recognizing Nepali license plate
            characters with high accuracy.
          </p>
        </div>
      </div>
    </div>
  )
}