import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
            const { text, cropped_image } = res.data;
            navigate("/result", {
                state: {
                  resultText: text,
                  previewImage: `data:image/jpeg;base64,${cropped_image}`,
                },
        });
    }catch(error)
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
        </div>
    );
}