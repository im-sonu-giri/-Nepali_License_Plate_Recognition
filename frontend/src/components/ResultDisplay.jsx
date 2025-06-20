export default function ResultDisplay({ result }) {
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recognition Result</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Processed Image:</h3>
          <img
            src={result.image}
            alt="Processed license plate"
            className="w-full h-auto rounded border border-gray-200"
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Plate Number:</h3>
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {result.plateNumber}
          </div>
          <div className="text-sm text-gray-500">
            Confidence: <span className="font-medium">{result.confidence}</span>
          </div>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Copy Result
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}