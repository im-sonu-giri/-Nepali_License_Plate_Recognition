import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { previewImage, resultText } = location.state || {};
  useEffect(() => {
    if (!previewImage || !resultText) {
      navigate("/imageupload");
    }
  },
  [previewImage, resultText, navigate]);
  if (!previewImage || !resultText){
    return null;
  }

  const handleBack = () => {
    navigate("/imageupload");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Recognition Results</h2>

      <div>
        <h3>Cropped License Plate</h3>
        <img
          src={previewImage}
          alt="Cropped License Plate"
          style={{ width: "300px", border: "2px solid #000" }}
        />
      </div>

      <div>
        <h3>Detected Text</h3>
        <p>{resultText}</p>
      </div>

      <button onClick={handleBack} style={{ marginTop: "2rem" }}>
        Back to Upload
      </button>
    </div>
  );
}
