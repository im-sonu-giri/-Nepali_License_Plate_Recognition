import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
    return(
        <header className="header">
            <div className="logo">NLPR System</div>
            <div className="subtitle">Nepali License Plate Recognition</div>
            
            <nav className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/recognize" className="nav-link active">Recognize</Link>
            </nav>
            
            <div className="footer">
                <div className="copyright">© 2024 NLPR System</div>
                <div className="institution">Nepal College of Information Technology</div>
            </div>
        </header>
    );
}