import { Link } from 'react-router-dom';
import './Header.css';
import img from "../assets/header_img.png";

export default function Header() {
    return(
        <header className="header">
            <div className="logo">Nepali License Plate Recognition</div>
            <div className="subtitle">सवारी साधन नम्बर प्लेट पहिचान प्रणाली</div>
            <hr className="divider" />
             <nav className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                            <hr className="divider" />   
                <Link to="/about" className="nav-link">About</Link>
                            <hr className="divider" /> 
            </nav>  
           <img src={img} className="img" alt="logo" />
            <div className="project-intro">
                <p>
                   नेपाली नम्बर प्लेट चिन्न र पढ्न तयार गरिएको स्वचालित प्रणाली।<br />
                   Built to detect and recognize Nepali license plates.
                </p>  
            </div>

            <div className="footer"> 
                <div className="copyright">© 2024 NLPR System (Team 200_OK)</div>
                <div className="institution">Nepal College of Information Technology</div>
            </div>
        </header>
    );
}