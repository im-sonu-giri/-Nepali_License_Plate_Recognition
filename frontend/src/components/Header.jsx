import { Link } from 'react-router-dom'
import { FaCar } from 'react-icons/fa'

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <FaCar className="text-2xl" />
          <span className="text-xl font-bold">Nepali Plate Recognition</span>
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}