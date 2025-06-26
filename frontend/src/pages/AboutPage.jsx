import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="content-section">
      <h2>About Nepali License Plate Recognition</h2>
      
      <div className="about-content">
        <section>
          <h3>Project Overview</h3>
          <p>
            Our system is specifically designed to recognize Nepali license plates written in 
            Devanagari script. Using state-of-the-art deep learning models, we achieve high 
            accuracy in detecting and reading license plates under various conditions.
          </p>
        </section>

        <section>
          <h3>Technology Stack</h3>
          <ul>
            <li>YOLOv8 for license plate detection</li>
            <li>CRNN (CNN + LSTM) for character recognition</li>
            <li>React.js for the user interface</li>
            <li>Python backend with FastAPI</li>
          </ul>
        </section>

        <section>
          <h3>Team</h3>
          <p>
            This project is developed by Team 200_OK from Nepal College of Information 
            Technology as part of our academic research in computer vision and machine learning.
          </p>
        </section>
      </div>
    </div>
  );
}