import ImageUpload from './ImageUpload';
import AboutPage from './AboutPage';
import './HomePage.css'; 

export default function HomePage() {
  return (
    <div className="scrollable-container">
      <ImageUpload />
      <AboutPage />
    </div>
  );
}