import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UploadPlate() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await axios.post("http://127.0.0.1:8000/detect", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      const { text, cropped_image } = res.data;

      navigate("/result", {
        state: {
          resultText: text,
          previewImage: `data:image/jpeg;base64,${cropped_image}`,
        },
      });
    } 
    catch (error) {
        if (error.response) {
          // Server responded with a status code outside 2xx
          console.error("Response error data:", error.response.data);
          console.error("Response error status:", error.response.status);
          console.error("Response error headers:", error.response.headers);
        } else if (error.request) {
          // Request was made but no response received
          console.error("No response received:", error.request);
        } else {
          // Something else happened setting up the request
          console.error("Error setting up request:", error.message);
        }
        alert("Error uploading image. Check console for details.");
      }
      
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload Image for License Plate Detection</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!file} style={{ marginLeft: "1rem" }}>
          Detect
        </button>
      </form>
    </div>
  );
}
