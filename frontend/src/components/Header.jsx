import './Header.css';

export default function Header() {
    return(
        <header className="header">
         <div className="logo">NLPR System</div>
         <div className="subtitle">नेपाली नम्बर प्लेट चिनाउने</div>
         <div className="tech">YOLOv8 + OCR</div>
        </header>
    );
}