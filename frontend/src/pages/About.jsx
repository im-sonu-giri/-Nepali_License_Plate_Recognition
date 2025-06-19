export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            About Nepali License Plate Recognition
          </h1>
          
          <div className="prose dark:prose-invert">
            <p>
              This project aims to develop an automatic license plate recognition system 
              specifically designed for Nepali license plates written in Devanagari script.
            </p>
            
            <h2 className="text-xl font-semibold mt-6">Key Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Real-time vehicle and license plate detection using YOLOv8</li>
              <li>OCR engine optimized for Nepali Devanagari characters</li>
              <li>Support for various lighting conditions and plate formats</li>
              <li>User-friendly interface for easy operation</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6">Technology Stack</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <h3 className="font-medium">Frontend</h3>
                <ul className="text-sm space-y-1 mt-2">
                  <li>React + TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Vite</li>
                </ul>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <h3 className="font-medium">Backend/ML</h3>
                <ul className="text-sm space-y-1 mt-2">
                  <li>Python</li>
                  <li>YOLOv8</li>
                  <li>PyTorch</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}