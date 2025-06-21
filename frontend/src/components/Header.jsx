export default function Header() {
  return (
    <header>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <FaCar className="text-2xl" />
          <span>Nepali Plate Recognition</span>
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/about" className="nav-link">About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}