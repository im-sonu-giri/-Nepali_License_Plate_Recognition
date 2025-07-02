import React, { useState } from "react";
import axios from "axios";

export default function UploadPlate()
{
    const [file , setFile ]= useState(null);
    const [result, setResult] = useState(null);
    
    const handleFileChange = (e) =>{
        setFile(e.target.files[0]);
    };
    const handleSubmit = async (e) =>{
        e.preventDefault();

        if(!file)
        {
            alert("please select an image");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res =await axios.post("http://localhost:8000/detect", formData);
            setResult(res.data);
        }
        catch(error)
        {
            console.error("Error:", error);
            alert("Error uploading image");
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

        {result && (
            <div style={{ marginTop: "2rem" }}>
                <h3>{result.message}</h3>
          <p>Detected Text: <strong>{result.text}</strong></p>
          <img
            src={`data:image/jpeg;base64,${result.cropped_image}`}
            alt="Cropped Plate"
            style={{ width: "300px", border: "2px solid #000" }}
          />
        </div>
      )}
    </div>
  );
}


}