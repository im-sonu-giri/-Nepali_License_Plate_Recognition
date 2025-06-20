export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} Nepali License Plate Recognition System</p>
        <p className="text-sm mt-2 text-gray-400">
          Developed for efficient vehicle identification in Nepal
        </p>
      </div>
    </footer>
  )
}