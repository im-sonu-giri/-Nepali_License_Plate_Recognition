import { Link } from 'react-router-dom';
import './Header.css';
import img from "../assets/header_img.png";

export default function Header() {
    return(
        <header className="header">
            <div className="logo">Nepali License Plate Recognition</div>
            <div className="subtitle">सवारी साधन नम्बर प्लेट पहिचान प्रणाली</div>
            
            <img src={img} className="img" alt="logo" />
            
            <div className="footer">
                <div className="copyright">© 2024 NLPR System</div>
                <div className="institution">Nepal College of Information Technology</div>
            </div>
        </header>
    );
}