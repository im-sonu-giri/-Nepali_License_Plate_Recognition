export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">About Nepali License Plate Recognition</h1>
        
        <div className="prose">
          <h2 className="text-2xl font-semibold mb-3">Project Overview</h2>
          <p className="mb-4">
            The Nepali License Plate Recognition system is designed to automatically detect and
            recognize license plates from vehicles in Nepal. Using advanced computer vision
            techniques and our custom-trained YOLOv8 model, the system can accurately identify
            Nepali characters and numbers on license plates.
          </p>

          <h2 className="text-2xl font-semibold mb-3">Technology Stack</h2>
          <ul className="list-disc pl-5 mb-4">
            <li>YOLOv8 for object detection and character recognition</li>
            <li>React.js for the frontend interface</li>
            <li>Custom-trained model for Nepali character recognition</li>
            <li>Optimized for both desktop and mobile use</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
          <ol className="list-decimal pl-5 mb-4">
            <li>Upload an image containing a Nepali license plate</li>
            <li>Our system detects the license plate region</li>
            <li>Characters are segmented and recognized</li>
            <li>Results are displayed with confidence scores</li>
          </ol>

          <h2 className="text-2xl font-semibold mb-3">Applications</h2>
          <p>
            This technology can be used for traffic monitoring, parking management, law
            enforcement, and automated toll collection systems in Nepal.
          </p>
        </div>
      </div>
    </div>
  )
}