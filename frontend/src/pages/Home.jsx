export default function Home() {
  return (
    <div className="container">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Nepali License Plate Recognition
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload an image of a Nepali license plate to recognize the characters.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="upload-section">
          <h2 className="text-xl font-semibold mb-4">Try It Out</h2>
          <div className="file-upload">
            {/* File upload content */}
          </div>
        </div>

        <div className="model-display">
          <h2 className="text-xl font-semibold mb-4">Our YOLOv8 Model</h2>
          {/* Model display content */}
        </div>
      </div>
    </div>
  )
}